from sqlalchemy import func, or_

def apply_product_search(query, search: str, db):
    """
    Database-aware product search.

    PostgreSQL:
      - Full-text search using tsvector/plainto_tsquery
      - pg_trgm similarity ranking

    SQLite:
      - Case-insensitive LIKE fallback
      - Searches name, description, category and subcategory
    """

    from .models import Product

    if not search:
        return query

    term = search.strip()

    if not term:
        return query

    dialect = db.bind.dialect.name

    # PostgreSQL: Full-text search + trigram similarity
    if dialect == "postgresql":
        vector = func.to_tsvector(
            "english",
            func.concat(
                Product.name,
                " ",
                Product.description,
                " ",
                Product.category,
                " ",
                Product.subcategory,
            ),
        )

        ts_query = func.plainto_tsquery(
            "english",
            term,
        )

        query = query.filter(
            vector.op("@@")(ts_query)
        )

        similarity_score = func.greatest(
            func.similarity(Product.name, term),
            func.similarity(Product.description, term),
            func.similarity(Product.category, term),
            func.similarity(Product.subcategory, term),
        )

        return query.order_by(
            similarity_score.desc()
        )

    # SQLite fallback:
    # Match the search term in ANY searchable field.
    pattern = f"%{term}%"

    return query.filter(
        or_(
            Product.name.ilike(pattern),
            Product.description.ilike(pattern),
            Product.category.ilike(pattern),
            Product.subcategory.ilike(pattern),
        )
    )
