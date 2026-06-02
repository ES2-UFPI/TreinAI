from sqlmodel import SQLModel

from .user import UserRead


class LoginRequest(SQLModel):
    email: str
    password: str


class LoginResponse(SQLModel):
    message: str
    user: UserRead


class InvalidCredentialsError(Exception):
    def __init__(self) -> None:
        super().__init__("Invalid email or password.")
