from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime, timezone
from typing import Optional,TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.video import Video
    from app.models.user import User
class Comment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    video_id: Optional[int] = Field(default=None, foreign_key="video.id")
    user_id: Optional[int] = Field(default=None, foreign_key="user.id")
    video: Optional["Video"] = Relationship(back_populates="comments")
    user: Optional["User"] = Relationship(back_populates="comments")