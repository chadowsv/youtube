from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select,SQLModel
from typing import Optional
from app.models.user import User, DEFAULT_PROFILE_PIC
from app.db import get_session
from app.models.user import User
from app.services.security import hash_password, verify_password

router = APIRouter()

class UserCreate(SQLModel):
    username: str
    email: str
    password: str
    profile_picture_url: Optional[str] = None

class UserPublic(SQLModel):
    id: int
    username: str
    email: str
    profile_picture_url: Optional[str] = None

class LoginRequest(SQLModel):
    email: str
    password: str

# ── Registro: pasa la foto al crear el usuario ──
@router.post("/register", response_model=UserPublic)
def register(user_data: UserCreate, session: Session = Depends(get_session)):
    existing = session.exec(select(User).where(User.email == user_data.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email ya registrado")

    new_user = User(
        username=user_data.username,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        profile_picture_url=user_data.profile_picture_url or DEFAULT_PROFILE_PIC  # ← aquí
    )
    session.add(new_user)
    session.commit()
    session.refresh(new_user)
    return new_user


# ── Login: devuelve la foto en el response ──
@router.post("/login")
def login(credentials: LoginRequest, session: Session = Depends(get_session)):
    user = session.exec(select(User).where(User.email == credentials.email)).first()

    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    return {
        "message": "Login exitoso",
        "user_id": user.id,
        "username": user.username,
        "profile_picture_url": user.profile_picture_url  # ← aquí
    }
@router.get("/{user_id}", response_model=UserPublic)
def get_user(user_id: int, session: Session = Depends(get_session)):
    user = session.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return user