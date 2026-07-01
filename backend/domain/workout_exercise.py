from typing import Optional

from sqlmodel import Field, SQLModel

class WorkoutExercise(SQLModel, table=True):
  __tablename__ = "workout_exercise"

  id: Optional[int] = Field(default=None, primary_key=True)
  workout_id: int = Field(foreign_key="workout.id", index=True)
  exercise_id: Optional[int] = Field(default=None, foreign_key="exercise.id", index=True)
  day: int = Field(default=0)
  focus: str = Field(default="")
  order: int
  name: str = Field(default="")
  sets: Optional[int] = Field(default=None)
  reps: Optional[str] = Field(default=None)
  rest_seconds: Optional[int] = Field(default=None)
  muscle_group: Optional[str] = Field(default=None)
  notes: Optional[str] = Field(default=None)
