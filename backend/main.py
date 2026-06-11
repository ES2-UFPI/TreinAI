from fastapi import FastAPI

from controllers.auth_controller import router as auth_router
from controllers.user_controller import router as user_router
from controllers.workout_controller import router as workout_router


app = FastAPI(title="TreinAI API")

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(workout_router)

