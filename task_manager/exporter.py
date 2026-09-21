import json
from pathlib import Path

def export_tasks(rows, path="exports/tasks.json"):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    data = [{"id":r[0], "title":r[1], "description":r[2], "status":r[3],
             "priority":r[4], "created_at":str(r[5]) if r[5] else None} for r in rows]
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)
    return path
