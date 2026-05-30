from typing import Optional

from sqlmodel import Field, SQLModel

class Exercise(SQLModel, table=True):
  id: Optional[int] = Field(default=None, primary_key=True)
  name: str = Field(index=True, unique=True)    
  exercise_type: Optional[str] = Field(default=None)
  muscle_group: Optional[str] = Field(default=None)   
  equipment: Optional[str] = Field(default=None)     