from fastapi import FastAPI
from app.routers import users, products

app = FastAPI(title="Day 5 FastAPI Backend", version="1.0.0")
app.include_router(users.router)
app.include_router(products.router)

@app.get("/")
async def root():
    return {"message": "Day 5 FastAPI service is running"}
