from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from .config import settings

connect_args = {"check_same_thread": False} if settings.database_url.startswith("sqlite") else {"options": "-csearch_path=shopflow,public"}
engine_options = {
    "connect_args": connect_args,
    "pool_pre_ping": True,
}

if not settings.database_url.startswith("sqlite"):
    engine_options.update({
        "pool_recycle": 300,
        "pool_size": 5,
        "max_overflow": 5,
        "pool_timeout": 30,
    })

engine = create_engine(settings.database_url, **engine_options)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
