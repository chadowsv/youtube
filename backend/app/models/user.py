from sqlmodel import SQLModel,Field,Relationship
from typing import Optional,List,TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.video import Video
    from app.models.comment import Comment
DEFAULT_PROFILE_PIC = "https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/perfil/Wi3.jpg"
class User(SQLModel, table=True):
    id: Optional[int] | None = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(unique=True)
    hashed_password: str
    profile_picture_url: str = Field(default=DEFAULT_PROFILE_PIC)

    videos: List["Video"] = Relationship(back_populates="owner")
    comments: List["Comment"] = Relationship(back_populates="user")
