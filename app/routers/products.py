from fastapi import APIRouter, Depends, HTTPException
from ..auth import get_current_user, require_admin
from ..models import products, User
from ..schemas import ProductCreate, ProductResponse

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=list[ProductResponse])
def list_products(current_user: User = Depends(get_current_user)):
    return list(products.values())

@router.post("", response_model=ProductResponse)
def create_product(data: ProductCreate, admin: User = Depends(require_admin)):
    new_id = max(products.keys(), default=0) + 1
    products[new_id] = {"id": new_id, **data.model_dump()}
    return products[new_id]

@router.put("/{product_id}", response_model=ProductResponse)
def update_product(product_id: int, data: ProductCreate, admin: User = Depends(require_admin)):
    if product_id not in products:
        raise HTTPException(status_code=404, detail="Product not found")
    products[product_id] = {"id": product_id, **data.model_dump()}
    return products[product_id]
