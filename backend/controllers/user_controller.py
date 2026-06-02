from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from core.database import get_session
from domain.user import UserAlreadyExistsError, UserCreate, UserRead
from repositories.user_repository import UserRepository
from services.user_service import UserService


router = APIRouter(prefix="/users", tags=["users"])


def get_user_service(session: Session = Depends(get_session)) -> UserService:
    repository = UserRepository(session)
    return UserService(repository)


@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(
    user_data: UserCreate,
    service: UserService = Depends(get_user_service),
) -> UserRead:
    try:
        return service.create_user(user_data)
    except UserAlreadyExistsError as error:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=str(error),
        )
