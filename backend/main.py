from fastapi import FastAPI

from controllers.user_controller import router as user_router

app = FastAPI(title="TreinAI API")
app.include_router(user_router)
