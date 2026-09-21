import unittest
from task_manager.manager import TaskManager
from task_manager.models import Task

class FakeCursor:
    def __init__(self,c): self.c=c; self.result=None; self.rowcount=0
    def execute(self,q,p=None):
        u=q.upper()
        if "INSERT INTO TASKS" in u:
            i=self.c.next_id; self.c.next_id+=1; self.c.rows.append((i,p[0],p[1],p[2],p[3],None)); self.result=(i,None)
        elif "UPDATE TASKS" in u:
            title,desc,status,priority,i=p
            for n,r in enumerate(self.c.rows):
                if r[0]==i: self.c.rows[n]=(i,title or r[1],desc or r[2],status or r[3],priority or r[4],r[5]); self.result=self.c.rows[n]; return
            self.result=None
        elif "DELETE FROM TASKS" in u:
            i=p[0]; old=len(self.c.rows); self.c.rows=[r for r in self.c.rows if r[0]!=i]; self.rowcount=old-len(self.c.rows)
    def fetchone(self): return self.result
    def fetchall(self): return list(self.c.rows)
    def __enter__(self): return self
    def __exit__(self,*a): pass
class FakeConnection:
    def __init__(self): self.rows=[]; self.next_id=1
    def cursor(self): return FakeCursor(self)
    def commit(self): pass
    def rollback(self): pass
    def close(self): pass
class FakeDB:
    def __init__(self): self.c=FakeConnection()
    def connect(self): return self.c
class TestTaskManager(unittest.TestCase):
    def setUp(self): self.m=TaskManager(FakeDB())
    def test_add(self): self.assertEqual(self.m.add_task(Task("SQL")).id,1)
    def test_update(self):
        t=self.m.add_task(Task("SQL")); self.assertEqual(self.m.update_task(t.id,status="completed")[3],"completed")
    def test_delete(self):
        t=self.m.add_task(Task("Git")); self.assertTrue(self.m.delete_task(t.id))
    def test_bad_status(self):
        with self.assertRaises(ValueError): self.m.add_task(Task("x",status="bad"))
    def test_empty_title(self):
        with self.assertRaises(ValueError): self.m.add_task(Task(""))
if __name__ == "__main__": unittest.main()
