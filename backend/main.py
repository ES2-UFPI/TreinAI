from fastapi import Depends, FastAPI, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlmodel import Session, select

from core.database import get_session
from core.security import hash_password
from domain.user import User, UserCreate, UserRead


app = FastAPI(title="TreinAI API")


@app.post("/users", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_user(user_data: UserCreate, session: Session = Depends(get_session)) -> User:
    existing_user = session.exec(
        select(User).where(User.email == user_data.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered.",
        )

    user = User(
        **user_data.model_dump(exclude={"password"}),
        password_hash=hash_password(user_data.password),
    )
    session.add(user)

    try:
        session.commit()
    except IntegrityError:
        session.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered.",
        )

    session.refresh(user)
    return user
