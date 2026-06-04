from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    DATABASE_URL: str
    GEMINI_API_KEY: str = ""

    OLLAMA_HOST: str = "https://ollama.com"
    OLLAMA_API_KEY: str = ""
    LLM_MODEL: str = ""
    
    EMBED_MODEL:  str = "qwen3-embedding:4b"
    EMBED_DIM: int = 768


settings = Settings()
