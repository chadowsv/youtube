from sqlmodel import Field, SQLModel,Relationship
from typing import List, TYPE_CHECKING
if TYPE_CHECKING:
    from app.models.video import Video
class Category(SQLModel,table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(unique=True)
    videos: List["Video"] = Relationship(back_populates="category")