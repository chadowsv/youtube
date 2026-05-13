from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.db import create_db
from app.routes import videos,users,comments,categories

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db()
    yield

app=FastAPI(title="Youtube",lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]    
)

app.include_router(users.router,prefix="/api/users",tags=["users"])
app.include_router(videos.router,prefix="/api/videos",tags=["videos"])
app.include_router(comments.router,prefix="/api/comments",tags=["comments"])
app.include_router(categories.router,prefix="/api/categories",tags=["categories"])
@app.get("/")
def root():
    return {"status":"ok"}