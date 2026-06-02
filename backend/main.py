from fastapi import FastAPI
from .routers.help import router as help_router

app = FastAPI(title="TreinAI API")
app.include_router(help_router)

def main():
    print("Hello from backend!")


if __name__ == "__main__":
    main()
