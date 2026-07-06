from typing import Optional

from sqlalchemy import text
from sqlmodel import Session, select

from domain.workout import Workout
from domain.workout_exercise import WorkoutExercise


class WorkoutRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def search_similar(
        self, vector: list[float], n: int = 3, min_similarity: float = 0.3
    ) -> list[tuple[str, str]]:
        vector_literal = f"[{','.join(str(v) for v in vector)}]"
        sql = text("""
            SELECT title, chunk_text,
                1 - (embedding <=> CAST(:vec AS vector)) AS similarity
            FROM embedding_document
            WHERE 1 - (embedding <=> CAST(:vec AS vector)) > :min_sim
            ORDER BY similarity DESC
            LIMIT :n
        """)
        rows = self.session.exec(
            sql, params={"vec": vector_literal, "n": n, "min_sim": min_similarity}
        ).all()
        return [(row[0], row[1]) for row in rows]

    def save_workout(self, workout: Workout) -> Workout:
        self.session.add(workout)
        self.session.commit()
        self.session.refresh(workout)
        return workout

    def get_workout_by_id(self, workout_id: int) -> Optional[Workout]:
        return self.session.get(Workout, workout_id)

    def save_exercise(self, exercise: WorkoutExercise) -> WorkoutExercise:
        self.session.add(exercise)
        self.session.commit()
        self.session.refresh(exercise)
        return exercise

    def get_exercises_by_workout_id(self, workout_id: int) -> list[WorkoutExercise]:
        statement = select(WorkoutExercise).where(
            WorkoutExercise.workout_id == workout_id
        ).order_by(WorkoutExercise.day, WorkoutExercise.order)
        return list(self.session.exec(statement).all())
