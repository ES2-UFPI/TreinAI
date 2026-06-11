from domain.user import UserNotFoundError
from domain.workout_plan import WorkoutPlan
from repositories.user_repository import UserRepository
from services.llm_facade import LLMFacade


class WorkoutService:
    def __init__(self, user_repository: UserRepository, llm_facade: LLMFacade) -> None:
        self._user_repo = user_repository
        self._facade = llm_facade

    def generate(self, user_id: int, query: str) -> WorkoutPlan:
        user = self._user_repo.get_by_id(user_id)
        if not user:
            raise UserNotFoundError()
        return self._facade.generate_workout_plan(user_query=query, user=user)
