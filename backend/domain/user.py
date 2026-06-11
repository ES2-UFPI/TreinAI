from typing import Optional

from sqlmodel import Field, SQLModel

from .workout import DifficultyLevel


class UserBase(SQLModel):
  name: str
  email: str = Field(index=True, unique=True)
  age: int
  weight: float
  height: float
  goal: str
  level: DifficultyLevel


class User(UserBase, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  password_hash: str


class UserCreate(UserBase):
  password: str


class UserRead(UserBase):
  id: int


class UserAlreadyExistsError(Exception):
  def __init__(self, email: str) -> None:
    super().__init__(f"User with email '{email}' already exists.")

class UserNotFoundError(Exception):
  def __init__(self) -> None:
    super().__init__(f"User not found")