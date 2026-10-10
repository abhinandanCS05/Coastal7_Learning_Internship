from pathlib import Path
import csv
import io
import json

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from celery.result import AsyncResult
from sqlalchemy.orm import Session

from .celery_app import celery_app
from .database import get_db
from .models import Order, OrderItem, User
from .security import admin_user, current_user, customer_user
from .tasks import (
    bulk_product_import,
    demo_background_job,
    generate_invoice,
)

router = APIRouter(prefix="/day18", tags=["Day 18 - Background Tasks"])


@router.post("/tasks/demo")
def start_demo_task(
    user: User = Depends(current_user),
):
    task = demo_background_job.delay(10)

    return {
        "task_id": task.id,
        "status": "QUEUED",
    }


@router.get("/tasks/{task_id}")
def task_status(
    task_id: str,
    user: User = Depends(current_user),
):
    result = AsyncResult(task_id, app=celery_app)

    response = {
        "task_id": task_id,
        "status": result.status,
        "ready": result.ready(),
    }

    if result.state == "PROGRESS":
        response["progress"] = result.info or {}

    elif result.successful():
        response["result"] = result.result

    elif result.failed():
        response["error"] = str(result.info)

    return response


@router.post("/orders/{order_id}/invoice")
def create_invoice(
    order_id: int,
    user: User = Depends(customer_user),
    db: Session = Depends(get_db),
):
    order = db.query(Order).filter(
        Order.id == order_id,
        Order.user_id == user.id,
    ).first()

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found",
        )

    items = db.query(OrderItem).filter(
        OrderItem.order_id == order.id
    ).all()

    order_data = {
        "total": order.total,
        "payment_method": order.payment_method,
        "customer": {
            "id": user.id,
            "name": user.full_name or user.email,
        },
        "items": [
            {
                "name": item.product_name,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "line_total": item.quantity * item.unit_price,
            }
            for item in items
        ],
    }

    task = generate_invoice.delay(
        order.id,
        order_data,
    )

    return {
        "task_id": task.id,
        "order_id": order.id,
        "status": "QUEUED",
        "message": "Invoice generation started.",
    }


@router.post("/admin/products/import")
async def import_products(
    file: UploadFile = File(...),
    user: User = Depends(admin_user),
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="CSV file is required.",
        )

    if not file.filename.lower().endswith(".csv"):
        raise HTTPException(
            status_code=400,
            detail="Only CSV files are supported.",
        )

    content = await file.read()

    if len(content) > 10 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="CSV file must be smaller than 10 MB.",
        )

    try:
        text = content.decode("utf-8-sig")

        reader = csv.DictReader(
            io.StringIO(text)
        )

        rows = list(reader)

    except Exception as exc:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid CSV: {exc}",
        )

    if not rows:
        raise HTTPException(
            status_code=400,
            detail="CSV contains no product rows.",
        )

    task = bulk_product_import.delay(rows)

    return {
        "task_id": task.id,
        "status": "QUEUED",
        "rows": len(rows),
        "message": "Bulk product import started.",
    }


@router.get("/search")
def advanced_search(
    q: str = "",
    db: Session = Depends(get_db),
):
    from .models import Product
    from .search_service import apply_product_search

    query = db.query(Product).filter(
        Product.is_active == True
    )

    query = apply_product_search(
        query,
        q,
        db,
    )

    products = query.limit(50).all()

    return {
        "query": q,
        "database": db.bind.dialect.name,
        "search_mode": (
            "postgresql_fts_trigram"
            if db.bind.dialect.name == "postgresql"
            else "sqlite_fallback"
        ),
        "count": len(products),
        "items": [
            {
                "id": p.id,
                "name": p.name,
                "description": p.description,
                "category": p.category,
                "subcategory": p.subcategory,
                "price": p.price,
                "stock": p.stock,
            }
            for p in products
        ],
    }