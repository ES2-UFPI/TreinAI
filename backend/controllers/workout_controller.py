from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from core.database import get_session
from domain.user import UserNotFoundError
from domain.user_workout import WorkoutNotFoundError, WorkoutHistoryItem
from domain.workout_plan import WorkoutPlan, WorkoutRequest
from repositories.user_repository import UserRepository
from repositories.user_workout_repository import UserWorkoutRepository
from repositories.workout_repository import WorkoutRepository
from services.llm_facade import LLMFacade
from services.rag_engine import RAGEngine
from services.workout_service import WorkoutService


router = APIRouter(prefix="/workouts", tags=["workouts"])


def get_workout_service(session: Session = Depends(get_session)) -> WorkoutService:
    user_repository = UserRepository(session)
    user_workout_repository = UserWorkoutRepository(session)
    workout_repository = WorkoutRepository(session)
    rag_engine = RAGEngine(workout_repository)
    llm_facade = LLMFacade(rag_engine)

    return WorkoutService(
        user_repository, user_workout_repository, workout_repository, llm_facade
    )


@router.get("/history", response_model=list[WorkoutHistoryItem])
def get_workout_history(
    user_id: int,
    service: WorkoutService = Depends(get_workout_service),
) -> list[WorkoutHistoryItem]:
    try:
        return service.list_history(user_id)
    except UserNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.post("/generate", response_model=WorkoutPlan, status_code=status.HTTP_200_OK)
def generate_workout(
    request: WorkoutRequest,
    service: WorkoutService = Depends(get_workout_service),
) -> WorkoutPlan:
    try:
        return service.generate(request.user_id, request.query)
    except UserNotFoundError as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(error),
        )


@router.get("/{workout_id}", response_model=WorkoutPlan)
def get_workout_detail(
    workout_id: int,
    service: WorkoutService = Depends(get_workout_service),
) -> WorkoutPlan:
    try:
        return service.get_workout_detail(workout_id)
    except WorkoutNotFoundError:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Treino não encontrado",
        )
