import logging
import psycopg2
from .config import DB_CONFIG

logger = logging.getLogger(__name__)

class Database:
    def connect(self):
        try:
            conn = psycopg2.connect(**DB_CONFIG)
            logger.info("Connected to PostgreSQL")
            return conn
        except psycopg2.Error:
            logger.exception("PostgreSQL connection failed")
            raise

    def initialize(self):
        conn = self.connect()
        try:
            with conn.cursor() as cur:
                cur.execute('''CREATE TABLE IF NOT EXISTS tasks (
                    id SERIAL PRIMARY KEY,
                    title VARCHAR(200) NOT NULL,
                    description TEXT DEFAULT '',
                    status VARCHAR(20) NOT NULL DEFAULT 'pending',
                    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                )''')
                cur.execute("CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)")
                cur.execute('''CREATE TABLE IF NOT EXISTS task_statuses (
                    status VARCHAR(20) PRIMARY KEY,
                    label VARCHAR(50) NOT NULL
                )''')
                cur.execute("""INSERT INTO task_statuses(status,label)
                    VALUES ('pending','Pending'),('in_progress','In Progress'),('completed','Completed')
                    ON CONFLICT (status) DO NOTHING""")
            conn.commit()
        except Exception:
            conn.rollback()
            logger.exception("Database initialization failed")
            raise
        finally:
            conn.close()
