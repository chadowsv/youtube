from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select, SQLModel
from app.db import get_session
from app.models.category import Category

router = APIRouter()
class CategoryCreate(SQLModel):
    title:str

@router.get("/")
def get_categories(session: Session = Depends(get_session)):
    return session.exec(select(Category)).all()

@router.post("/")
def create_category(category_data: CategoryCreate, session: Session = Depends(get_session)):
    category = Category(title=category_data.title)
    session.add(category)
    session.commit()
    session.refresh(category)
    return category