from fastapi import (
    FastAPI,
    Depends,
    HTTPException,
    UploadFile,
    File,
    WebSocket,
    WebSocketDisconnect,
    Query,
    Request,
)
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pathlib import Path
import json, shutil, jwt
from io import BytesIO
from datetime import datetime
from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_RIGHT
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

from .database import Base, engine, get_db
from .models import User, Product, Wishlist, CartItem, Order, OrderItem
from .schemas import RegisterIn, LoginIn, AddressIn, CartIn, CheckoutIn, StatusIn
from .security import hash_password, verify_password, create_token, current_user, admin_user, customer_user
from .config import settings
from .seed_data import PRODUCTS
from .day18 import router as day18_router
from .ai_router import router as ai_router


limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="ShopFlow E-Commerce API", version="2.0.0")
app.add_middleware(GZipMiddleware, minimum_size=1000)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(CORSMiddleware, allow_origins=[settings.frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.mount("/files", StaticFiles(directory=str(settings.upload_dir)), name="files")
# Invoice PDFs are generated on demand and served through authenticated endpoints.
app.include_router(day18_router)
app.include_router(ai_router)


@app.middleware("http")
async def day19_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    return response


# Lightweight local real-time channels. For production, use a shared pub/sub layer.
admin_connections: set[WebSocket] = set()
customer_connections: dict[int, set[WebSocket]] = {}

async def broadcast_admin(message: dict):
    stale=[]
    for ws in list(admin_connections):
        try:
            await ws.send_json(message)
        except Exception:
            stale.append(ws)
    for ws in stale:
        admin_connections.discard(ws)

async def broadcast_customer(user_id: int, message: dict):
    sockets=customer_connections.get(user_id, set())
    stale=[]
    for ws in list(sockets):
        try:
            await ws.send_json(message)
        except Exception:
            stale.append(ws)
    for ws in stale:
        sockets.discard(ws)
    if not sockets:
        customer_connections.pop(user_id, None)

def websocket_user(token: str, db: Session):
    try:
        payload=jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
        uid=int(payload["sub"])
    except Exception:
        return None
    return db.get(User, uid)

@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    db=next(get_db())
    try:
        if not db.query(User).filter(User.email=="admin@shopflow.com").first():
            db.add(User(email="admin@shopflow.com", password_hash=hash_password("Admin@123"), role="admin", full_name="ShopFlow Admin"))
        if not db.query(User).filter(User.email=="demo@shopflow.com").first():
            db.add(User(email="demo@shopflow.com", password_hash=hash_password("Demo@123"), role="user", full_name="Demo Customer"))
        if db.query(Product).count()==0:
            for x in PRODUCTS: db.add(Product(**x))
        db.commit()
    finally: db.close()

@app.get("/health")
def health(): return {"status":"ok","service":"ShopFlow API","products":len(PRODUCTS)}

@app.post("/auth/register")
@limiter.limit("5/minute")
def register(request: Request, data:RegisterIn, db:Session=Depends(get_db)):
    if db.query(User).filter(User.email==data.email).first(): raise HTTPException(400,"Email already registered")
    u=User(email=data.email,password_hash=hash_password(data.password),full_name=data.full_name)
    db.add(u); db.commit(); db.refresh(u)
    return {"message":"Registration successful","user_id":u.id}

@app.post("/auth/login")
@limiter.limit("5/minute")
def login(request: Request, data:LoginIn, db:Session=Depends(get_db)):
    u=db.query(User).filter(User.email==data.email).first()
    if not u or not verify_password(data.password,u.password_hash): raise HTTPException(401,"Invalid email or password")
    if u.role!=data.role: raise HTTPException(401,"Selected role does not match account")
    return {"access_token":create_token(u),"token_type":"bearer","role":u.role,"email":u.email,"full_name":u.full_name}

@app.get("/me")
def me(user:User=Depends(current_user)):
    return {"id":user.id,"email":user.email,"role":user.role,"full_name":user.full_name,"phone":user.phone,"address_line":user.address_line,"city":user.city,"state":user.state,"pincode":user.pincode}

@app.put("/me/address")
def save_address(data:AddressIn, user:User=Depends(current_user), db:Session=Depends(get_db)):
    user.full_name=data.full_name; user.phone=data.phone; user.address_line=data.address_line; user.city=data.city; user.state=data.state; user.pincode=data.pincode
    db.commit(); return {"message":"Address saved"}

@app.get("/categories")
def categories(db:Session=Depends(get_db)):
    rows=db.query(Product.category,Product.subcategory).distinct().all()
    out={}
    for c,s in rows: out.setdefault(c,[]).append(s)
    return out

@app.get("/products")
def list_products(
    search: str = "",
    category: str = "",
    subcategory: str = "",
    min_price: float | None = None,
    max_price: float | None = None,
    sort: str = "relevance",
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    q = db.query(Product).filter(Product.is_active == True)

    if search:
        from app.search_service import apply_product_search
        q = apply_product_search(q, search, db)

    if category:
        q = q.filter(Product.category == category)

    if subcategory:
        q = q.filter(Product.subcategory == subcategory)

    if min_price is not None:
        q = q.filter(Product.price >= min_price)

    if max_price is not None:
        q = q.filter(Product.price <= max_price)

    total = q.count()

    if sort == "price_asc":
        q = q.order_by(Product.price.asc(), Product.id.asc())
    elif sort == "price_desc":
        q = q.order_by(Product.price.desc(), Product.id.desc())
    elif sort == "rating":
        q = q.order_by(Product.rating.desc(), Product.id.desc())
    elif sort == "newest":
        q = q.order_by(Product.id.desc())
    elif sort == "discount":
        discount = (Product.mrp - Product.price) / Product.mrp
        q = q.order_by(discount.desc().nullslast(), Product.id.desc())
    else:
        q = q.order_by(Product.id.asc())

    offset = (page - 1) * page_size
    paginated_items = q.offset(offset).limit(page_size).all()
    end = offset + len(paginated_items)

    return {
        "items": [serialize_product(x) for x in paginated_items],
        "total": total,
        "page": page,
        "page_size": page_size,
        "has_next": end < total,
        "has_previous": page > 1,
    }

@app.get("/products/{product_id}")
def product(product_id:int,db:Session=Depends(get_db)):
    x=db.get(Product,product_id)
    if not x or not x.is_active: raise HTTPException(404,"Product not found")
    return serialize_product(x)

@app.get("/wishlist")
def wishlist(user:User=Depends(current_user),db:Session=Depends(get_db)):
    ids=[w.product_id for w in db.query(Wishlist).filter(Wishlist.user_id==user.id).all()]
    return {"product_ids":ids}

@app.post("/wishlist/{product_id}")
def wishlist_toggle(product_id:int,user:User=Depends(current_user),db:Session=Depends(get_db)):
    x=db.query(Wishlist).filter(Wishlist.user_id==user.id,Wishlist.product_id==product_id).first()
    if x: db.delete(x); action="removed"
    else: db.add(Wishlist(user_id=user.id,product_id=product_id)); action="added"
    db.commit(); return {"action":action}

@app.get("/cart")
def cart(user:User=Depends(current_user),db:Session=Depends(get_db)):
    rows=db.query(CartItem).filter(CartItem.user_id==user.id).all()
    return cart_response(rows,db)

@app.post("/cart/items")
def add_cart(data:CartIn,user:User=Depends(current_user),db:Session=Depends(get_db)):
    p=db.get(Product,data.product_id)
    if not p: raise HTTPException(404,"Product not found")
    if data.quantity>p.stock: raise HTTPException(400,f"Only {p.stock} left in stock")
    row=db.query(CartItem).filter(CartItem.user_id==user.id,CartItem.product_id==p.id).first()
    if row: row.quantity=min(data.quantity,row.quantity+data.quantity)
    else: db.add(CartItem(user_id=user.id,product_id=p.id,quantity=data.quantity))
    db.commit(); return cart(user,db)

@app.patch("/cart/items/{product_id}")
def update_cart(product_id:int,data:CartIn,user:User=Depends(current_user),db:Session=Depends(get_db)):
    row=db.query(CartItem).filter(CartItem.user_id==user.id,CartItem.product_id==product_id).first()
    if not row: raise HTTPException(404,"Cart item not found")
    p=db.get(Product,product_id)
    if data.quantity>p.stock: raise HTTPException(400,f"Only {p.stock} left in stock")
    row.quantity=data.quantity; db.commit(); return cart(user,db)

@app.delete("/cart/items/{product_id}")
def remove_cart(product_id:int,user:User=Depends(current_user),db:Session=Depends(get_db)):
    row=db.query(CartItem).filter(CartItem.user_id==user.id,CartItem.product_id==product_id).first()
    if row: db.delete(row); db.commit()
    return cart(user,db)

@app.get("/offers")
def offers():
    return [
        {"code":"WELCOME10","title":"Welcome Offer","description":"10% off up to Ã¢â€šÂ¹500","type":"PERCENT","value":10,"min_order":999},
        {"code":"SHOP500","title":"Flat Ã¢â€šÂ¹500 Off","description":"Ã¢â€šÂ¹500 off on orders above Ã¢â€šÂ¹7,999","type":"FLAT","value":500,"min_order":7999},
        {"code":"FREESHIP","title":"Free Delivery","description":"Free delivery on eligible orders","type":"SHIPPING","value":0,"min_order":499}
    ]

@app.post("/orders")
async def checkout(data:CheckoutIn,user:User=Depends(customer_user),db:Session=Depends(get_db)):
    rows=db.query(CartItem).filter(CartItem.user_id==user.id).all()
    if not rows: raise HTTPException(400,"Cart is empty")
    subtotal=0; items=[]
    for row in rows:
        p=db.get(Product,row.product_id)
        if not p or row.quantity>p.stock: raise HTTPException(400,f"Stock unavailable for {p.name if p else row.product_id}")
        subtotal += p.price*row.quantity
        items.append((p,row.quantity))
    discount=500 if subtotal>=7999 else (round(subtotal*.10,2) if subtotal>=999 else 0)
    shipping=0 if subtotal>=499 else 49
    total=max(0,subtotal-discount+shipping)
    user.full_name=data.address.full_name; user.phone=data.address.phone; user.address_line=data.address.address_line; user.city=data.address.city; user.state=data.address.state; user.pincode=data.address.pincode
    address=json.dumps(data.address.model_dump())
    order=Order(user_id=user.id,total=total,payment_method=data.payment_method,payment_status="PENDING" if data.payment_method!="COD" else "PAY_ON_DELIVERY",status="PLACED",address_snapshot=address)
    db.add(order); db.flush()
    for p,q in items:
        db.add(OrderItem(order_id=order.id,product_id=p.id,product_name=p.name,quantity=q,unit_price=p.price)); p.stock-=q
    for row in rows: db.delete(row)
    db.commit(); db.refresh(order)
    payload=order_json(order,db)
    await broadcast_admin({"event":"order_created","order":payload})
    await broadcast_customer(user.id,{"event":"order_updated","order":payload})
    return {"order_id":order.id,"subtotal":subtotal,"discount":discount,"shipping":shipping,"total":total,"payment_method":data.payment_method,"status":"PLACED"}

@app.get("/orders")
def orders(user:User=Depends(current_user),db:Session=Depends(get_db)):
    orders_list=db.query(Order).filter(Order.user_id==user.id).order_by(Order.id.desc()).all()
    order_ids=[o.id for o in orders_list]
    items_by_order={oid:[] for oid in order_ids}
    if order_ids:
        for item in db.query(OrderItem).filter(OrderItem.order_id.in_(order_ids)).all():
            items_by_order[item.order_id].append(item)
    customers={user.id:user}
    return [order_json(o,db,items_by_order.get(o.id,[]),customers) for o in orders_list]

@app.get("/admin/orders")
def admin_orders(user:User=Depends(admin_user),db:Session=Depends(get_db)):
    orders_list=db.query(Order).order_by(Order.id.desc()).all()
    order_ids=[o.id for o in orders_list]
    items_by_order={oid:[] for oid in order_ids}
    if order_ids:
        for item in db.query(OrderItem).filter(OrderItem.order_id.in_(order_ids)).all():
            items_by_order[item.order_id].append(item)
    user_ids={o.user_id for o in orders_list}
    customers={u.id:u for u in db.query(User).filter(User.id.in_(user_ids)).all()} if user_ids else {}
    return [order_json(o,db,items_by_order.get(o.id,[]),customers) for o in orders_list]

@app.patch("/admin/orders/{order_id}/status")
async def admin_status(order_id:int,data:StatusIn,user:User=Depends(admin_user),db:Session=Depends(get_db)):
    o=db.get(Order,order_id)
    if not o: raise HTTPException(404,"Order not found")
    allowed={
        "PLACED":{"PROCESSING","CANCELLED"},
        "PROCESSING":{"SHIPPED","CANCELLED"},
        "SHIPPED":{"DELIVERED","CANCELLED"},
        "DELIVERED":set(),
        "CANCELLED":set(),
    }
    if data.status==o.status:
        return order_json(o,db)
    if data.status not in allowed.get(o.status,set()):
        raise HTTPException(400,f"Cannot change order from {o.status} to {data.status}")
    if data.status=="CANCELLED":
        for item in db.query(OrderItem).filter(OrderItem.order_id==o.id).all():
            p=db.get(Product,item.product_id)
            if p: p.stock += item.quantity
    o.status=data.status
    if data.status=="DELIVERED" and o.payment_method=="COD": o.payment_status="PAID"
    db.commit(); db.refresh(o)
    payload=order_json(o,db)
    await broadcast_admin({"event":"order_updated","order":payload})
    await broadcast_customer(o.user_id,{"event":"order_updated","order":payload})
    return payload

@app.websocket("/ws/admin")
async def admin_ws(websocket:WebSocket):
    token=websocket.query_params.get("token","")
    db = next(get_db())
    try:
        user = websocket_user(token, db)
        if not user or user.role != "admin":
            await websocket.close(code=1008)
            return

        # Preserve required values, then release the DB connection.
        admin_id = user.id
        admin_name = user.full_name or user.email
    finally:
        db.close()

    await websocket.accept()
    admin_connections.add(websocket)

    try:
        while True:
            raw_message=await websocket.receive_text()

            try:
                message=json.loads(raw_message)
            except json.JSONDecodeError:
                continue

            if message.get("type")=="chat_message":
                text=str(message.get("message","")).strip()
                target_user_id=message.get("target_user_id")

                if not text or not target_user_id:
                    continue

                payload={
                    "event":"chat_message",
                    "sender_id":admin_id,
                    "sender_role":"admin",
                    "sender_name":admin_name,
                    "target_user_id":int(target_user_id),
                    "message":text,
                }

                await broadcast_customer(int(target_user_id),payload)

    except WebSocketDisconnect:
        admin_connections.discard(websocket)
    finally:
        admin_connections.discard(websocket)
        db.close()


@app.websocket("/ws/orders")
async def customer_ws(websocket:WebSocket):
    token=websocket.query_params.get("token","")
    db = next(get_db())
    try:
        user = websocket_user(token, db)
        if not user or user.role != "user":
            await websocket.close(code=1008)
            return

        # Copy required values before releasing the database session.
        user_id = user.id
        user_name = user.full_name or user.email
    finally:
        db.close()

    await websocket.accept()
    customer_connections.setdefault(user_id, set()).add(websocket)

    try:
        while True:
            raw_message=await websocket.receive_text()

            try:
                message=json.loads(raw_message)
            except json.JSONDecodeError:
                continue

            if message.get("type")=="chat_message":
                text=str(message.get("message","")).strip()

                if not text:
                    continue

                payload={
                    "event":"chat_message",
                    "sender_id":user_id,
                    "sender_role":"user",
                    "sender_name":user_name,
                    "target_role":"admin",
                    "message":text,
                }

                await broadcast_admin(payload)

    except WebSocketDisconnect:
        customer_connections.get(user_id,set()).discard(websocket)
    finally:
        customer_connections.get(user_id,set()).discard(websocket)

        if not customer_connections.get(user_id):
            customer_connections.pop(user_id,None)

        db.close()

@app.post("/admin/products/{product_id}/image")
async def upload_product_image(
    product_id: int,
    file: UploadFile = File(...),
    user: User = Depends(admin_user),
    db: Session = Depends(get_db)
):
    product = db.get(Product, product_id)

    if not product:
        raise HTTPException(404, "Product not found")

    allowed = {
        "image/jpeg": ".jpg",
        "image/png": ".png",
        "image/webp": ".webp",
    }

    if file.content_type not in allowed:
        raise HTTPException(
            400,
            "Only JPG, PNG and WebP images are allowed."
        )

    contents = await file.read()

    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            400,
            "Image must be smaller than 5 MB."
        )

    # Remove previous locally stored image
    if product.image_url and product.image_url.startswith("/files/"):
        old_name = product.image_url.split("/files/", 1)[1]
        old_file = settings.upload_dir / old_name

        if old_file.exists():
            old_file.unlink()

    import uuid

    filename = (
        f"product_{product_id}_"
        f"{uuid.uuid4().hex}"
        f"{allowed[file.content_type]}"
    )

    destination = settings.upload_dir / filename
    destination.write_bytes(contents)

    product.image_url = f"/files/{filename}"

    db.commit()
    db.refresh(product)

    return {
        "message": "Product image uploaded successfully",
        "product_id": product.id,
        "image_url": product.image_url,
    }


@app.delete("/admin/products/{product_id}/image")
def delete_product_image(product_id:int,user:User=Depends(admin_user),db:Session=Depends(get_db)):
    p=db.get(Product,product_id)
    if not p:
        raise HTTPException(404,"Product not found")

    if p.image_url and p.image_url.startswith("/files/"):
        filename=p.image_url.split("/files/",1)[1]
        target=settings.upload_dir/filename
        if target.exists():
            target.unlink()

    p.image_url=""
    db.commit()

    return {"message":"Product image removed","image_url":""}


@app.post("/admin/products")
def create_product(data:dict,user:User=Depends(admin_user),db:Session=Depends(get_db)):
    required=["name","description","category","subcategory","price","mrp","stock"]
    if any(k not in data for k in required): raise HTTPException(400,"Missing product fields")
    p=Product(**{k:data[k] for k in required},image_url=data.get("image_url",""),offer_text=data.get("offer_text",""),badge=data.get("badge",""))
    db.add(p); db.commit(); db.refresh(p); return serialize_product(p)

@app.put("/admin/products/{product_id}")
def update_product(product_id:int,data:dict,user:User=Depends(admin_user),db:Session=Depends(get_db)):
    p=db.get(Product,product_id)
    if not p: raise HTTPException(404,"Product not found")
    for k,v in data.items():
        if hasattr(p,k) and k not in {"id"}: setattr(p,k,v)
    db.commit(); db.refresh(p); return serialize_product(p)

@app.delete("/admin/products/{product_id}")
def delete_product(product_id:int,user:User=Depends(admin_user),db:Session=Depends(get_db)):
    p=db.get(Product,product_id)
    if not p: raise HTTPException(404,"Product not found")
    p.is_active=False; db.commit(); return {"message":"Product archived"}


def _invoice_pdf(order: Order, db: Session) -> bytes:
    """Render an order invoice from persisted order snapshots without inventing tax fields."""
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).order_by(OrderItem.id.asc()).all()
    address = {}
    try:
        address = json.loads(order.address_snapshot or "{}")
    except (TypeError, json.JSONDecodeError):
        address = {}

    customer = db.get(User, order.user_id)
    subtotal = round(sum(float(item.unit_price) * int(item.quantity) for item in items), 2)
    discount = 500 if subtotal >= 7999 else (round(subtotal * 0.10, 2) if subtotal >= 999 else 0)
    shipping = 0 if subtotal >= 499 else 49
    total = round(float(order.total or 0), 2)

    buffer = BytesIO()
    doc = SimpleDocTemplate(
        buffer, pagesize=A4,
        rightMargin=18 * mm, leftMargin=18 * mm,
        topMargin=17 * mm, bottomMargin=18 * mm,
        title=f"zetA Invoice INV-{order.id:06d}",
        author="zetA",
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(
        name="ZetaBrand", parent=styles["Title"], fontName="Helvetica-Bold",
        fontSize=25, leading=29, textColor=colors.HexColor("#635bff"), alignment=0,
        spaceAfter=2,
    ))
    styles.add(ParagraphStyle(
        name="ZetaSmall", parent=styles["BodyText"], fontSize=8.5, leading=12,
        textColor=colors.HexColor("#64748b"),
    ))
    styles.add(ParagraphStyle(
        name="ZetaRight", parent=styles["BodyText"], alignment=TA_RIGHT,
        fontSize=9, leading=13,
    ))
    styles.add(ParagraphStyle(
        name="ZetaSection", parent=styles["Heading2"], fontSize=11,
        leading=14, textColor=colors.HexColor("#1e293b"), spaceBefore=10, spaceAfter=5,
    ))

    def safe(value):
        text = str(value or "")
        return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                .replace("\n", "<br/>"))

    story = [
        Paragraph("zetA", styles["ZetaBrand"]),
        Paragraph("THOUGHTFUL SHOPPING", styles["ZetaSmall"]),
        Spacer(1, 7 * mm),
    ]
    meta = [
        [Paragraph("<b>INVOICE</b>", styles["Heading1"]),
         Paragraph(f"<b>Invoice no.</b> INV-{order.id:06d}<br/><b>Order no.</b> #{order.id}<br/><b>Issued</b> {order.created_at.strftime('%d %b %Y') if order.created_at else 'â€”'}", styles["ZetaRight"])],
        [Paragraph("Order summary", styles["ZetaSection"]),
         Paragraph(f"<b>Order status:</b> {safe(order.status)}<br/><b>Payment method:</b> {safe(order.payment_method)}<br/><b>Payment status:</b> {safe(order.payment_status)}", styles["ZetaRight"])]
    ]
    meta_table = Table(meta, colWidths=[83*mm, 85*mm])
    meta_table.setStyle(TableStyle([
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("ALIGN", (1,0), (1,-1), "RIGHT"),
        ("LINEBELOW", (0,0), (-1,0), 0.8, colors.HexColor("#e2e8f0")),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
        ("LEFTPADDING", (0,0), (-1,-1), 0),
        ("RIGHTPADDING", (0,0), (-1,-1), 0),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph("BILL TO", styles["ZetaSection"]))
    customer_name = address.get("full_name") or (customer.full_name if customer else "")
    customer_email = customer.email if customer else ""
    address_lines = [
        customer_name, customer_email, address.get("phone"),
        address.get("address_line"),
        ", ".join(x for x in [address.get("city"), address.get("state")] if x),
        address.get("pincode"),
    ]
    bill_to = "<br/>".join(safe(line) for line in address_lines if line)
    story.append(Paragraph(bill_to or "Customer details not available in order snapshot.", styles["BodyText"]))
    story.append(Spacer(1, 7 * mm))

    data = [[
        Paragraph("<b>Item</b>", styles["BodyText"]),
        Paragraph("<b>Qty</b>", styles["BodyText"]),
        Paragraph("<b>Unit price</b>", styles["BodyText"]),
        Paragraph("<b>Line total</b>", styles["BodyText"]),
    ]]
    for item in items:
        unit = float(item.unit_price)
        qty = int(item.quantity)
        data.append([
            Paragraph(safe(item.product_name), styles["BodyText"]),
            str(qty),
            f"INR {unit:,.2f}",
            f"INR {unit * qty:,.2f}",
        ])
    item_table = Table(data, colWidths=[88*mm, 16*mm, 31*mm, 33*mm], repeatRows=1)
    item_table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#f1f5f9")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.HexColor("#334155")),
        ("GRID", (0,0), (-1,-1), 0.4, colors.HexColor("#e2e8f0")),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("ALIGN", (1,1), (-1,-1), "RIGHT"),
        ("LEFTPADDING", (0,0), (-1,-1), 7),
        ("RIGHTPADDING", (0,0), (-1,-1), 7),
        ("TOPPADDING", (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 8),
    ]))
    story.extend([item_table, Spacer(1, 5 * mm)])

    totals = [
        ["Subtotal", f"INR {subtotal:,.2f}"],
        ["Discount", f"- INR {discount:,.2f}"],
        ["Shipping", f"INR {shipping:,.2f}"],
        ["Order total", f"INR {total:,.2f}"],
    ]
    totals_table = Table(totals, colWidths=[132*mm, 36*mm], hAlign="RIGHT")
    totals_table.setStyle(TableStyle([
        ("ALIGN", (1,0), (1,-1), "RIGHT"),
        ("FONTNAME", (0,0), (-1,-2), "Helvetica"),
        ("FONTNAME", (0,-1), (-1,-1), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 9),
        ("TEXTCOLOR", (0,-1), (-1,-1), colors.HexColor("#635bff")),
        ("LINEABOVE", (0,-1), (-1,-1), 0.8, colors.HexColor("#635bff")),
        ("TOPPADDING", (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
    ]))
    story.extend([totals_table, Spacer(1, 9 * mm)])
    story.append(Paragraph(
        "This invoice reflects the order information recorded by zetA. "
        "No GST or tax amount is shown because tax registration and tax breakdown "
        "are not present in the supplied order records.",
        styles["ZetaSmall"],
    ))
    story.append(Spacer(1, 3 * mm))
    story.append(Paragraph("Thank you for shopping with zetA.", styles["ZetaSmall"]))
    doc.build(story)
    return buffer.getvalue()


@app.get("/orders/{order_id}/invoice")
def customer_order_invoice(
    order_id: int,
    user: User = Depends(customer_user),
    db: Session = Depends(get_db),
):
    order = db.get(Order, order_id)
    if not order or order.user_id != user.id:
        raise HTTPException(status_code=404, detail="Order not found")
    from fastapi.responses import Response
    pdf = _invoice_pdf(order, db)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="zetA_invoice_{order.id:06d}.pdf"',
                 "Cache-Control": "private, no-store"},
    )


@app.get("/admin/orders/{order_id}/invoice")
def admin_order_invoice(
    order_id: int,
    user: User = Depends(admin_user),
    db: Session = Depends(get_db),
):
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    from fastapi.responses import Response
    pdf = _invoice_pdf(order, db)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="zetA_invoice_{order.id:06d}.pdf"',
                 "Cache-Control": "private, no-store"},
    )


def serialize_product(p):
    return {"id":p.id,"name":p.name,"description":p.description,"category":p.category,"subcategory":p.subcategory,"price":p.price,"mrp":p.mrp,"discount_percent":round((p.mrp-p.price)*100/p.mrp) if p.mrp else 0,"stock":p.stock,"image_url":p.image_url,"badge":p.badge,"offer_text":p.offer_text,"rating":p.rating,"reviews":p.reviews}

def cart_response(rows,db):
    items=[]; total=0; count=0
    for r in rows:
        p=db.get(Product,r.product_id)
        if not p: continue
        line=p.price*r.quantity; total+=line; count+=r.quantity
        items.append({"product":serialize_product(p),"quantity":r.quantity,"line_total":line})
    return {"items":items,"subtotal":total,"count":count}

def order_json(o,db,items=None,customers=None):
    items = items if items is not None else db.query(OrderItem).filter(OrderItem.order_id==o.id).all()
    customer = customers.get(o.user_id) if customers is not None else db.get(User,o.user_id)
    address=json.loads(o.address_snapshot or "{}")
    subtotal=round(sum(x.quantity*x.unit_price for x in items),2)
    discount=500 if subtotal>=7999 else (round(subtotal*.10,2) if subtotal>=999 else 0)
    shipping=0 if subtotal>=499 else 49
    return {"id":o.id,"user_id":o.user_id,"total":o.total,"subtotal":subtotal,"discount":discount,"shipping":shipping,"payment_method":o.payment_method,"payment_status":o.payment_status,"status":o.status,"customer":{"id":customer.id if customer else o.user_id,"full_name":customer.full_name if customer else address.get("full_name",""),"email":customer.email if customer else "","phone":customer.phone if customer else address.get("phone","")},"address":address,"created_at":o.created_at.isoformat(),"items":[{"product_id":x.product_id,"name":x.product_name,"quantity":x.quantity,"unit_price":x.unit_price,"line_total":round(x.quantity*x.unit_price,2)} for x in items]}



