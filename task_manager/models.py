from dataclasses import dataclass
from typing import Optional

@dataclass
class Task:
    title: str
    description: str = ""
    status: str = "pending"
    priority: str = "medium"
    id: Optional[int] = None
    created_at: Optional[str] = None
