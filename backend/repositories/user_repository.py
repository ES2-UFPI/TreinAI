from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from domain.user import User, UserAlreadyExistsError


class UserRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def get_by_email(self, email: str) -> User | None:
        return self.session.exec(select(User).where(User.email == email)).first()

    def save(self, user: User) -> User:
        self.session.add(user)

        try:
            self.session.commit()
        except IntegrityError:
            self.session.rollback()
            raise UserAlreadyExistsError(user.email)

        self.session.refresh(user)
        return user
