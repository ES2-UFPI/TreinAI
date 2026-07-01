from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlmodel import Field, SQLModel

UTC_M3 = timezone(timedelta(hours=-3))


class UserWorkout(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id", index=True)
    workout_id: Optional[int] = Field(default=None, foreign_key="workout.id")
    title: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC_M3).replace(tzinfo=None))


class WorkoutHistoryItem(SQLModel):
    id: int
    title: str
    created_at: datetime
    
class WorkoutNotFoundError(Exception):
    pass
