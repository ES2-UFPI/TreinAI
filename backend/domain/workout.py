from enum import Enum
from typing import Optional

from sqlmodel import Field, SQLModel


class DifficultyLevel(str, Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"


class Workout(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    objective: str
    description: str
    difficulty_level: DifficultyLevel
    estimated_duration_minutes: int
