CREATE TABLE IF NOT EXISTS tasks (
 id SERIAL PRIMARY KEY, title VARCHAR(200) NOT NULL, description TEXT DEFAULT '',
 status VARCHAR(20) NOT NULL DEFAULT 'pending', priority VARCHAR(20) NOT NULL DEFAULT 'medium',
 created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS task_statuses(status VARCHAR(20) PRIMARY KEY,label VARCHAR(50) NOT NULL);
INSERT INTO task_statuses VALUES ('pending','Pending'),('in_progress','In Progress'),('completed','Completed')
ON CONFLICT (status) DO NOTHING;
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
-- JOIN: SELECT t.title,s.label FROM tasks t JOIN task_statuses s ON t.status=s.status;
-- GROUP BY/HAVING: SELECT status,COUNT(*) FROM tasks GROUP BY status HAVING COUNT(*) > 0;
-- Aggregate: SELECT COUNT(*) FROM tasks;
