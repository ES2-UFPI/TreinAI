from typing import Optional

from sqlmodel import Field, SQLModel

from .workout import DifficultyLevel


class User(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)

  name: str
  email: str = Field(index=True, unique=True)
  password: str
  age: int
  weight: float
  height: float
  goal: str
  level: DifficultyLevel
