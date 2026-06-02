from core.security import verify_password
from domain.auth import InvalidCredentialsError, LoginRequest, LoginResponse
from repositories.user_repository import UserRepository


class AuthService:
    def __init__(self, user_repository: UserRepository) -> None:
        self.user_repository = user_repository

    def login(self, login_data: LoginRequest) -> LoginResponse:
        user = self.user_repository.get_by_email(login_data.email)

        if not user or not verify_password(login_data.password, user.password_hash):
            raise InvalidCredentialsError()

        return LoginResponse(message="Login successful.", user=user)
