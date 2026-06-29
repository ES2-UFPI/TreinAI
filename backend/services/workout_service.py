from domain.user import UserNotFoundError
from domain.user_workout import UserWorkout, WorkoutHistoryItem
from domain.workout_plan import WorkoutPlan
from repositories.user_repository import UserRepository
from repositories.user_workout_repository import UserWorkoutRepository
from services.llm_facade import LLMFacade


class WorkoutService:
    def __init__(
        self,
        user_repository: UserRepository,
        user_workout_repository: UserWorkoutRepository,
        llm_facade: LLMFacade,
    ) -> None:
        self._user_repo = user_repository
        self._user_workout_repo = user_workout_repository
        self._facade = llm_facade

    def generate(self, user_id: int, query: str) -> WorkoutPlan:
        user = self._user_repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError()

        plan = self._facade.generate_workout_plan(user_query=query, user=user)
        self._user_workout_repo.save(UserWorkout(user_id=user_id, title=plan.title))
        return plan

    def list_history(self, user_id: int) -> list[WorkoutHistoryItem]:
        user = self._user_repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError()

        workouts = self._user_workout_repo.list_by_user(user_id)
        return [
            WorkoutHistoryItem(id=w.id, title=w.title, created_at=w.created_at)
            for w in workouts
        ]
