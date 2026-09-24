from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models import Project, Task, TaskStatus, User
from ..schemas import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["Tasks"])
ALLOWED = {TaskStatus.TODO: {TaskStatus.TODO, TaskStatus.IN_PROGRESS}, TaskStatus.IN_PROGRESS: {TaskStatus.IN_PROGRESS, TaskStatus.DONE}, TaskStatus.DONE: {TaskStatus.DONE}}

def can_access(project: Project, user: User) -> bool:
    return user.role.value == "admin" or project.owner_id == user.id

@router.post("/projects/{project_id}/tasks", response_model=TaskResponse, status_code=201)
def create_task(project_id: int, data: TaskCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if not can_access(project, current_user): raise HTTPException(status_code=403, detail="Access denied")
    if data.assignee_id is not None and not db.get(User, data.assignee_id): raise HTTPException(status_code=404, detail="Assignee not found")
    task = Task(title=data.title, description=data.description, due_date=data.due_date, assignee_id=data.assignee_id, project_id=project_id, status=TaskStatus.TODO)
    db.add(task); db.commit(); db.refresh(task)
    return task

@router.get("", response_model=list[TaskResponse])
def list_tasks(status_filter: TaskStatus | None = Query(None, alias="status"), assignee_id: int | None = Query(None), due_date: date | None = Query(None), skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Task).join(Project).order_by(Task.id.desc())
    if current_user.role.value != "admin": stmt = stmt.where(Project.owner_id == current_user.id)
    if status_filter: stmt = stmt.where(Task.status == status_filter)
    if assignee_id is not None: stmt = stmt.where(Task.assignee_id == assignee_id)
    if due_date is not None: stmt = stmt.where(Task.due_date == due_date)
    return list(db.scalars(stmt.offset(skip).limit(limit)).all())

@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.get(Task, task_id)
    if not task: raise HTTPException(status_code=404, detail="Task not found")
    if not can_access(task.project, current_user): raise HTTPException(status_code=403, detail="Access denied")
    return task

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(task_id: int, data: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.get(Task, task_id)
    if not task: raise HTTPException(status_code=404, detail="Task not found")
    if not can_access(task.project, current_user): raise HTTPException(status_code=403, detail="Access denied")
    updates = data.model_dump(exclude_unset=True)
    if updates.get("assignee_id") is not None and not db.get(User, updates["assignee_id"]):
        raise HTTPException(status_code=404, detail="Assignee not found")
    if "status" in updates and updates["status"] not in ALLOWED[task.status]:
        raise HTTPException(status_code=400, detail=f"Invalid status transition: {task.status.value} -> {updates['status'].value}")
    for field, value in updates.items(): setattr(task, field, value)
    db.commit(); db.refresh(task)
    return task

@router.delete("/{task_id}", status_code=204)
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.get(Task, task_id)
    if not task: raise HTTPException(status_code=404, detail="Task not found")
    if not can_access(task.project, current_user): raise HTTPException(status_code=403, detail="Access denied")
    db.delete(task); db.commit()
