from core.security import hash_password
from domain.user import User, UserAlreadyExistsError, UserCreate
from repositories.user_repository import UserRepository


class UserService:
    def __init__(self, repository: UserRepository) -> None:
        self.repository = repository

    def create_user(self, user_data: UserCreate) -> User:
        if self.repository.get_by_email(user_data.email):
            raise UserAlreadyExistsError(user_data.email)

        user = User(
            **user_data.model_dump(exclude={"password"}),
            password_hash=hash_password(user_data.password),
        )

        return self.repository.save(user)
