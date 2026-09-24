from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .exceptions import register_exception_handlers
from .routers import auth, projects, tasks

app = FastAPI(title="Task Management API", version="1.0.0", description="Mini-Project 2: Projects and Tasks REST API.")
app.add_middleware(CORSMiddleware, allow_origins=settings.origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)
register_exception_handlers(app)

@app.get("/", tags=["Health"])
def health_check():
    return {"message": "Task Management API is running"}
