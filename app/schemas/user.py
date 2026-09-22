from pydantic import BaseModel, EmailStr, Field, field_validator

class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr

    @field_validator("name")
    @classmethod
    def clean_name(cls, value):
        return value.strip()

class UserUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    email: EmailStr | None = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    model_config = {"from_attributes": True}
