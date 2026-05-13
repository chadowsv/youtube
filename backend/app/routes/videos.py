from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select, SQLModel
from typing import Optional
import random
from app.db import get_session
from app.models.video import Video

router = APIRouter()

class VideoCreate(SQLModel):
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: Optional[str] = None
    owner_id: int
    category_id: int

# ── rutas fijas primero, SIEMPRE antes de /{video_id} ──

# Catálogo completo
@router.get("/")
def get_videos(session: Session = Depends(get_session)):
    return session.exec(select(Video)).all()

# Buscar por título
@router.get("/search/")
def search_videos(title: str, session: Session = Depends(get_session)):
    return session.exec(
        select(Video).where(Video.title.contains(title))
    ).all()

# Videos recientes
@router.get("/recent/")
def get_recent(session: Session = Depends(get_session)):
    return session.exec(
        select(Video).order_by(Video.created_at.desc()).limit(10)
    ).all()

# Videos por usuario
@router.get("/user/{user_id}")
def get_videos_by_user(user_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(Video).where(Video.owner_id == user_id)
    ).all()

# Filtrar por categoría
@router.get("/category/{category_id}")
def get_by_category(category_id: int, session: Session = Depends(get_session)):
    return session.exec(
        select(Video).where(Video.category_id == category_id)
    ).all()

# 10 recomendaciones aleatorias por categoría
@router.get("/recommendations/{category_id}")
def get_recommendations(category_id: int, session: Session = Depends(get_session)):
    videos = session.exec(
        select(Video).where(Video.category_id == category_id)
    ).all()
    aleatorios = random.sample(videos, min(10, len(videos)))
    return aleatorios

# ── rutas con parámetro al final ──

# Video por ID
@router.get("/{video_id}")
def get_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    return video

# Subir video
@router.post("/")
def create_video(video_data: VideoCreate, session: Session = Depends(get_session)):
    video = Video(**video_data.model_dump())
    session.add(video)
    session.commit()
    session.refresh(video)
    return video

# Actualizar thumbnail
@router.patch("/{video_id}/thumbnail")
def update_thumbnail(
    video_id: int, thumbnail_url: str, session: Session = Depends(get_session)
):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    video.thumbnail_url = thumbnail_url
    session.commit()
    session.refresh(video)
    return video

# Eliminar video
@router.delete("/{video_id}")
def delete_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video no encontrado")
    session.delete(video)
    session.commit()
    return {"message": "Video eliminado"}