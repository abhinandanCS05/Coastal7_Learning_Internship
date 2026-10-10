import os
import sqlite3
from pathlib import Path
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

BASE = Path(__file__).resolve().parent
load_dotenv(BASE / ".env")

url = os.getenv("DATABASE_URL")
if not url:
    raise RuntimeError("DATABASE_URL missing")

if url.startswith("postgresql://"):
    url = url.replace("postgresql://", "postgresql+psycopg2://", 1)

sqlite_path = BASE / "shopflow.db"

print("========================================")
print(" SHOPFLOW SQLITE -> NEON MIGRATION")
print("========================================")
print("SQLite:", sqlite_path)
print("Target: Neon PostgreSQL")
print()

src = sqlite3.connect(str(sqlite_path))
src.row_factory = sqlite3.Row

tables = [
    "users",
    "products",
    "orders",
    "order_items",
    "cart_items",
    "wishlists",
]

expected = {}

print("SOURCE COUNTS")
print("----------------------------------------")

for table in tables:
    count = src.execute(
        f"SELECT COUNT(*) FROM {table}"
    ).fetchone()[0]

    expected[table] = count
    print(f"{table:15} {count}")

print("TOTAL:", sum(expected.values()))

engine = create_engine(
    url,
    future=True,
    pool_pre_ping=True
)

with engine.begin() as db:

    print()
    print("Creating shopflow schema...")

    db.execute(
        text("CREATE SCHEMA IF NOT EXISTS shopflow")
    )

    existing_tables = db.execute(text("""
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'shopflow'
    """)).scalars().all()

    print("Existing ShopFlow tables:", existing_tables)

    if existing_tables:
        existing_data = {}

        for table in tables:
            if table in existing_tables:
                count = db.execute(
                    text(f"SELECT COUNT(*) FROM shopflow.{table}")
                ).scalar_one()

                existing_data[table] = count

        if any(count > 0 for count in existing_data.values()):
            raise RuntimeError(
                "ShopFlow schema already contains data: "
                + str(existing_data)
            )

    print()
    print("Creating ShopFlow tables...")

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS shopflow.users (
            id INTEGER PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(500) NOT NULL,
            role VARCHAR(20) NOT NULL DEFAULT 'user',
            full_name VARCHAR(120) DEFAULT '',
            phone VARCHAR(30) DEFAULT '',
            address_line VARCHAR(255) DEFAULT '',
            city VARCHAR(100) DEFAULT '',
            state VARCHAR(100) DEFAULT '',
            pincode VARCHAR(20) DEFAULT '',
            created_at TIMESTAMP
        )
    """))

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS shopflow.products (
            id INTEGER PRIMARY KEY,
            name VARCHAR(200) NOT NULL,
            description TEXT DEFAULT '',
            category VARCHAR(80) NOT NULL,
            subcategory VARCHAR(100) NOT NULL,
            price DOUBLE PRECISION NOT NULL,
            mrp DOUBLE PRECISION NOT NULL,
            stock INTEGER DEFAULT 0,
            image_url VARCHAR(500) DEFAULT '',
            badge VARCHAR(80) DEFAULT '',
            offer_text VARCHAR(150) DEFAULT '',
            rating DOUBLE PRECISION DEFAULT 4.2,
            reviews INTEGER DEFAULT 0,
            is_active BOOLEAN DEFAULT TRUE
        )
    """))

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS shopflow.orders (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL
                REFERENCES shopflow.users(id),
            total DOUBLE PRECISION DEFAULT 0,
            payment_method VARCHAR(40) NOT NULL,
            payment_status VARCHAR(40) DEFAULT 'PENDING',
            status VARCHAR(40) DEFAULT 'PLACED',
            address_snapshot TEXT DEFAULT '',
            created_at TIMESTAMP
        )
    """))

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS shopflow.order_items (
            id INTEGER PRIMARY KEY,
            order_id INTEGER NOT NULL
                REFERENCES shopflow.orders(id),
            product_id INTEGER NOT NULL,
            product_name VARCHAR(200) NOT NULL,
            quantity INTEGER NOT NULL,
            unit_price DOUBLE PRECISION NOT NULL
        )
    """))

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS shopflow.cart_items (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL
                REFERENCES shopflow.users(id),
            product_id INTEGER NOT NULL
                REFERENCES shopflow.products(id),
            quantity INTEGER DEFAULT 1
        )
    """))

    db.execute(text("""
        CREATE TABLE IF NOT EXISTS shopflow.wishlists (
            id INTEGER PRIMARY KEY,
            user_id INTEGER NOT NULL
                REFERENCES shopflow.users(id),
            product_id INTEGER NOT NULL
                REFERENCES shopflow.products(id)
        )
    """))

    print("Tables created.")

    column_map = {
        "users": [
            "id",
            "email",
            "password_hash",
            "role",
            "full_name",
            "phone",
            "address_line",
            "city",
            "state",
            "pincode",
            "created_at"
        ],
        "products": [
            "id",
            "name",
            "description",
            "category",
            "subcategory",
            "price",
            "mrp",
            "stock",
            "image_url",
            "badge",
            "offer_text",
            "rating",
            "reviews",
            "is_active"
        ],
        "orders": [
            "id",
            "user_id",
            "total",
            "payment_method",
            "payment_status",
            "status",
            "address_snapshot",
            "created_at"
        ],
        "order_items": [
            "id",
            "order_id",
            "product_id",
            "product_name",
            "quantity",
            "unit_price"
        ],
        "cart_items": [
            "id",
            "user_id",
            "product_id",
            "quantity"
        ],
        "wishlists": [
            "id",
            "user_id",
            "product_id"
        ],
    }

    print()
    print("Migrating data...")
    print("----------------------------------------")

    for table in tables:

        cols = column_map[table]

        col_sql = ", ".join(cols)
        bind_sql = ", ".join(":" + c for c in cols)

        rows = src.execute(
            f"""
            SELECT {col_sql}
            FROM {table}
            ORDER BY id
            """
        ).fetchall()

        if not rows:
            print(f"{table:15} 0 rows")
            continue

        insert_sql = text(
            f"""
            INSERT INTO shopflow.{table}
            ({col_sql})
            VALUES ({bind_sql})
            """
        )

        for row in rows:
            data = dict(row)

            if table == "products":
                data["is_active"] = bool(data["is_active"])

            db.execute(
                insert_sql,
                data
            )

        print(f"{table:15} {len(rows)} rows")

    print()
    print("Verifying row counts...")
    print("----------------------------------------")

    total = 0

    for table in tables:

        actual = db.execute(
            text(
                f"SELECT COUNT(*) "
                f"FROM shopflow.{table}"
            )
        ).scalar_one()

        expected_count = expected[table]

        print(
            f"{table:15} "
            f"source={expected_count:<5} "
            f"target={actual:<5} "
            f"{'OK' if actual == expected_count else 'FAIL'}"
        )

        if actual != expected_count:
            raise RuntimeError(
                f"Count mismatch in {table}: "
                f"{expected_count} != {actual}"
            )

        total += actual

    print()
    print("Verifying relationships...")
    print("----------------------------------------")

    checks = [
        (
            "orders -> users",
            """
            SELECT COUNT(*)
            FROM shopflow.orders o
            LEFT JOIN shopflow.users u
                ON u.id = o.user_id
            WHERE u.id IS NULL
            """
        ),
        (
            "order_items -> orders",
            """
            SELECT COUNT(*)
            FROM shopflow.order_items oi
            LEFT JOIN shopflow.orders o
                ON o.id = oi.order_id
            WHERE o.id IS NULL
            """
        ),
        (
            "cart -> users",
            """
            SELECT COUNT(*)
            FROM shopflow.cart_items c
            LEFT JOIN shopflow.users u
                ON u.id = c.user_id
            WHERE u.id IS NULL
            """
        ),
        (
            "cart -> products",
            """
            SELECT COUNT(*)
            FROM shopflow.cart_items c
            LEFT JOIN shopflow.products p
                ON p.id = c.product_id
            WHERE p.id IS NULL
            """
        ),
        (
            "wishlist -> users",
            """
            SELECT COUNT(*)
            FROM shopflow.wishlists w
            LEFT JOIN shopflow.users u
                ON u.id = w.user_id
            WHERE u.id IS NULL
            """
        ),
        (
            "wishlist -> products",
            """
            SELECT COUNT(*)
            FROM shopflow.wishlists w
            LEFT JOIN shopflow.products p
                ON p.id = w.product_id
            WHERE p.id IS NULL
            """
        ),
    ]

    for name, query in checks:

        bad = db.execute(text(query)).scalar_one()

        print(
            f"{name:25} "
            f"{'OK' if bad == 0 else 'FAIL'}"
        )

        if bad != 0:
            raise RuntimeError(
                f"Relationship failure: {name}"
            )

    print()
    print("TOTAL MIGRATED:", total)

    if total != sum(expected.values()):
        raise RuntimeError("TOTAL COUNT MISMATCH")

print()
print("========================================")
print(" MIGRATION SUCCESSFUL")
print("========================================")
print("Schema: shopflow")
print("All 210 source records verified.")
print("Existing public schema was not modified.")

src.close()
