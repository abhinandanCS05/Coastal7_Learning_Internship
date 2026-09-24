from datetime import date
from pydantic import BaseModel, ConfigDict, Field
from .models import TaskStatus, UserRole

class RegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=72)

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class RefreshRequest(BaseModel):
    refresh_token: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    role: UserRole

class ProjectCreate(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    description: str | None = None

class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=120)
    description: str | None = None

class ProjectResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: str | None
    owner_id: int

class TaskCreate(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    description: str | None = None
    due_date: date | None = None
    assignee_id: int | None = None

class TaskUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=150)
    description: str | None = None
    status: TaskStatus | None = None
    due_date: date | None = None
    assignee_id: int | None = None

class TaskResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: str | None
    status: TaskStatus
    due_date: date | None
    project_id: int
    assignee_id: int | None
