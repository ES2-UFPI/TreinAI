from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from core.database import get_session
from domain.auth import InvalidCredentialsError, LoginRequest, LoginResponse
from repositories.user_repository import UserRepository
from services.auth_service import AuthService


router = APIRouter(tags=["auth"])


def get_auth_service(session: Session = Depends(get_session)) -> AuthService:
    user_repository = UserRepository(session)
    return AuthService(user_repository)


@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    service: AuthService = Depends(get_auth_service),
) -> LoginResponse:
    try:
        return service.login(login_data)
    except InvalidCredentialsError as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(error),
        )
