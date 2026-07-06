from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from controllers.auth_controller import router as auth_router
from controllers.help_controller import router as help_router
from controllers.user_controller import router as user_router
from controllers.workout_controller import router as workout_router
from core.config import settings


app = FastAPI(title="TreinAI API")

origins = [o.strip() for o in settings.CORS_ORIGINS.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(help_router)
app.include_router(user_router)
app.include_router(workout_router)

