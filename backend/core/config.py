from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

# Aponta para o .env que fica sempre em backend/
ENV_FILE = Path(__file__).resolve().parent.parent / ".env.dev"

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=str(ENV_FILE), extra="ignore")

    DATABASE_URL: str


settings = Settings()
