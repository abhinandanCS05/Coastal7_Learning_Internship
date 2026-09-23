from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routers import auth, products

app = FastAPI(title="Day 6 - Authentication & Security")

# Why: allow only configured browser frontend origins to call the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)

@app.get("/")
def root():
    return {"message": "Day 6 Authentication & Security API"}
