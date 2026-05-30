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
  description: str
  main_goal: str                          
  workout_type: str                       
  training_level: DifficultyLevel         
  program_duration_weeks: Optional[int] = Field(default=None)  
  days_per_week: Optional[int] = Field(default=None)           
  time_per_workout: Optional[str] = Field(default=None)        
  equipment_required: Optional[str] = Field(default=None)      
  target_gender: Optional[str] = Field(default=None)           