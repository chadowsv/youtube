from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select, SQLModel
from datetime import datetime
from app.db import get_session
from app.models.comment import Comment
from app.models.user import User

class CommentPublic(SQLModel):
    id: int
    content: str
    created_at: datetime
    video_id: int
    user_id: int
    username: str = ""

class CommentCreate(SQLModel):
    content: str
    video_id: int
    user_id: int

class CommentUpdate(SQLModel):
    content: str

router = APIRouter()

@router.get("/video/{video_id}")
def get_comments(video_id: int, session: Session = Depends(get_session)):
    comments = session.exec(select(Comment).where(Comment.video_id == video_id)).all()
    result = []
    for c in comments:
        user = session.get(User, c.user_id)
        result.append(CommentPublic(
            id=c.id, content=c.content, created_at=c.created_at,
            video_id=c.video_id, user_id=c.user_id,
            username=user.username if user else "Usuario"
        ))
    return result

@router.post("/")
def create_comment(comment_data: CommentCreate, session: Session = Depends(get_session)):
    comment = Comment(**comment_data.model_dump())
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

@router.put("/{comment_id}")
def update_comment(comment_id: int, data: CommentUpdate, session: Session = Depends(get_session)):
    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    comment.content = data.content
    session.add(comment)
    session.commit()
    session.refresh(comment)
    return comment

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, session: Session = Depends(get_session)):
    comment = session.get(Comment, comment_id)
    if not comment:
        raise HTTPException(status_code=404, detail="Comentario no encontrado")
    session.delete(comment)
    session.commit()
    return {"message": "Comentario eliminado"}