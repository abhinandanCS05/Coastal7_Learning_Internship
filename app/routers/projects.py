from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session
from ..database import get_db
from ..dependencies import get_current_user
from ..models import Project, User
from ..schemas import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])

def can_manage(project: Project, user: User) -> bool:
    return user.role.value == "admin" or project.owner_id == user.id

@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = Project(name=data.name, description=data.description, owner_id=current_user.id)
    db.add(project); db.commit(); db.refresh(project)
    return project

@router.get("", response_model=list[ProjectResponse])
def list_projects(skip: int = Query(0, ge=0), limit: int = Query(10, ge=1, le=100), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    stmt = select(Project).order_by(Project.id.desc()).offset(skip).limit(limit)
    if current_user.role.value != "admin":
        stmt = stmt.where(Project.owner_id == current_user.id)
    return list(db.scalars(stmt).all())

@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if not can_manage(project, current_user): raise HTTPException(status_code=403, detail="Access denied")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if not can_manage(project, current_user): raise HTTPException(status_code=403, detail="Access denied")
    for field, value in data.model_dump(exclude_unset=True).items(): setattr(project, field, value)
    db.commit(); db.refresh(project)
    return project

@router.delete("/{project_id}", status_code=204)
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.get(Project, project_id)
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    if not can_manage(project, current_user): raise HTTPException(status_code=403, detail="Access denied")
    db.delete(project); db.commit()
