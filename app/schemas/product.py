from pydantic import BaseModel, Field, model_validator

class ProductCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    price: float = Field(gt=0)
    owner_id: int = Field(gt=0)

    @model_validator(mode="after")
    def clean_product(self):
        self.name = self.name.strip()
        return self

class ProductUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=100)
    price: float | None = Field(default=None, gt=0)
