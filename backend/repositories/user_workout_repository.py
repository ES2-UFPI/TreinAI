from typing import Optional

from sqlmodel import Session, select

from domain.user_workout import UserWorkout


class UserWorkoutRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def save(self, user_workout: UserWorkout) -> UserWorkout:
        self.session.add(user_workout)
        self.session.commit()
        self.session.refresh(user_workout)
        return user_workout

    def list_by_user(self, user_id: int) -> list[UserWorkout]:
        statement = (
            select(UserWorkout)
            .where(UserWorkout.user_id == user_id)
            .order_by(UserWorkout.created_at.desc())
        )
        return list(self.session.exec(statement).all())

    def get_by_id(self, workout_id: int) -> Optional[UserWorkout]:
        return self.session.get(UserWorkout, workout_id)
