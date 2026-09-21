import logging
from .models import Task

logger = logging.getLogger(__name__)

class TaskManager:
    VALID_STATUSES = {"pending", "in_progress", "completed"}
    VALID_PRIORITIES = {"low", "medium", "high"}

    def __init__(self, database):
        self.database = database

    def _validate(self, task):
        if not task.title.strip():
            raise ValueError("Task title cannot be empty")
        if task.status not in self.VALID_STATUSES:
            raise ValueError("Invalid status")
        if task.priority not in self.VALID_PRIORITIES:
            raise ValueError("Invalid priority")

    def add_task(self, task):
        self._validate(task)
        conn = self.database.connect()
        try:
            with conn.cursor() as cur:
                cur.execute("""INSERT INTO tasks(title,description,status,priority)
                    VALUES (%s,%s,%s,%s) RETURNING id,created_at""",
                    (task.title, task.description, task.status, task.priority))
                task.id, task.created_at = cur.fetchone()
            conn.commit()
            return task
        except Exception:
            conn.rollback(); logger.exception("Create failed"); raise
        finally:
            conn.close()

    def list_tasks(self, status=None):
        conn = self.database.connect()
        try:
            with conn.cursor() as cur:
                if status:
                    if status not in self.VALID_STATUSES: raise ValueError("Invalid status")
                    cur.execute("SELECT id,title,description,status,priority,created_at FROM tasks WHERE status=%s ORDER BY id", (status,))
                else:
                    cur.execute("SELECT id,title,description,status,priority,created_at FROM tasks ORDER BY id")
                return cur.fetchall()
        finally:
            conn.close()

    def update_task(self, task_id, title=None, description=None, status=None, priority=None):
        if status and status not in self.VALID_STATUSES: raise ValueError("Invalid status")
        if priority and priority not in self.VALID_PRIORITIES: raise ValueError("Invalid priority")
        conn = self.database.connect()
        try:
            with conn.cursor() as cur:
                cur.execute("""UPDATE tasks SET title=COALESCE(%s,title),
                    description=COALESCE(%s,description), status=COALESCE(%s,status),
                    priority=COALESCE(%s,priority) WHERE id=%s
                    RETURNING id,title,description,status,priority,created_at""",
                    (title, description, status, priority, task_id))
                row = cur.fetchone()
            conn.commit(); return row
        except Exception:
            conn.rollback(); logger.exception("Update failed"); raise
        finally:
            conn.close()

    def delete_task(self, task_id):
        conn = self.database.connect()
        try:
            with conn.cursor() as cur:
                cur.execute("DELETE FROM tasks WHERE id=%s", (task_id,))
                deleted = cur.rowcount > 0
            conn.commit(); return deleted
        except Exception:
            conn.rollback(); logger.exception("Delete failed"); raise
        finally:
            conn.close()

    def search_tasks(self, keyword):
        conn = self.database.connect()
        try:
            with conn.cursor() as cur:
                p = f"%{keyword}%"
                cur.execute("""SELECT id,title,description,status,priority,created_at
                    FROM tasks WHERE title ILIKE %s OR description ILIKE %s ORDER BY id""", (p, p))
                return cur.fetchall()
        finally:
            conn.close()

    def statistics(self):
        conn = self.database.connect()
        try:
            with conn.cursor() as cur:
                cur.execute("SELECT status,COUNT(*) FROM tasks GROUP BY status HAVING COUNT(*) > 0 ORDER BY status")
                grouped = cur.fetchall()
                cur.execute("SELECT COUNT(*), COUNT(*) FILTER (WHERE status='completed') FROM tasks")
                totals = cur.fetchone()
                return {"by_status": grouped, "totals": totals}
        finally:
            conn.close()

    def joined_tasks(self):
        conn = self.database.connect()
        try:
            with conn.cursor() as cur:
                cur.execute("""SELECT t.id,t.title,s.label FROM tasks t
                    JOIN task_statuses s ON t.status=s.status ORDER BY t.id""")
                return cur.fetchall()
        finally:
            conn.close()
