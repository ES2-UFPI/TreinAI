from sqlmodel import SQLModel
from domain.exercise import Modality

class WorkoutRequest(SQLModel):
    user_id: int
    query: str
    modality: Modality | None = None


class PlannedExercise(SQLModel):
    order: int
    name: str
    sets: int | None = None
    reps: str | None = None
    rest_seconds: int | None = None
    muscle_group: str | None = None
    notes: str | None = None


class WorkoutDay(SQLModel):
    day: int
    focus: str
    exercises: list[PlannedExercise] = []


class WorkoutPlan(SQLModel):
    title: str
    description: str = ""
    main_goal: str
    workout_type: str
    training_level: str
    program_duration_weeks: int | None = None
    days_per_week: int | None = None
    time_per_workout: str | None = None
    equipment_required: str | None = None
    target_gender: str | None = None
    days: list[WorkoutDay] = []
