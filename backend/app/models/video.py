from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import List,Optional, TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.user import User
    from app.models.category import Category
    from app.models.comment import Comment
DEFAULT_THUMBNAIL = "https://aws-youtube-lis-contenidos.s3.us-west-1.amazonaws.com/miniaturas/default.jpg"
class Video(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    description: Optional[str] = None
    video_url: str
    thumbnail_url: str = Field(default=DEFAULT_THUMBNAIL)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    owner_id: Optional[int] = Field(default=None, foreign_key="user.id")
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    owner: Optional["User"] = Relationship(back_populates="videos")
    category: Optional["Category"] = Relationship(back_populates="videos")
    comments: List["Comment"] = Relationship(back_populates="video")
