from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


class UserWorkout(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    title: str
    created_at: datetime = Field(default_factory=datetime.utcnow)


class WorkoutHistoryItem(SQLModel):
    id: int
    title: str
    created_at: datetime
