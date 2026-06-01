from typing import Optional

from sqlmodel import Field, SQLModel

class WorkoutExercise(SQLModel, table=True):
  __tablename__ = "workout_exercise"
  
  id: Optional[int] = Field(default=None, primary_key=True)
  workout_id: int = Field(foreign_key="workout.id", index=True)
  exercise_id: int = Field(foreign_key="exercise.id", index=True)
  order: int                                      
  sets: Optional[int] = Field(default=None)
  reps: Optional[str] = Field(default=None)       
  rest_seconds: Optional[int] = Field(default=None)
  notes: Optional[str] = Field(default=None)