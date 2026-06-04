from google import genai

from core.config import settings
from domain.user import User
from services.rag_engine import RAGEngine

_MODEL = "gemini-2.0-flash"


class LLMFacade:
    def __init__(self, rag_engine: RAGEngine) -> None:
        self._rag = rag_engine
        self._client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def generate_workout_plan(self, user: User) -> str:
        context = self._rag.retrieve_context(self._build_rag_query(user))
        prompt = self._build_prompt(user, context)
        return self._call_gemini(prompt)

    def _build_rag_query(self, user: User) -> str:
        return f"{user.goal} {user.level.value} workout"

    def _build_prompt(self, user: User, context: str | None) -> str:
        return (
            "You are an expert personal trainer. Create a personalized workout plan.\n\n"
            "User profile:\n"
            f"- Name: {user.name}\n"
            f"- Age: {user.age} | Weight: {user.weight}kg | Height: {user.height}cm\n"
            f"- Goal: {user.goal}\n"
            f"- Level: {user.level.value}\n\n"
            "Reference workouts from our database:\n"
            f"{context or 'No reference workouts available.'}\n\n"
            "Based on the user profile and reference workouts, create a tailored workout plan. "
            "Include exercises, sets, reps, rest periods, weekly schedule, and practical tips. "
            "Adapt the intensity and exercises to the user's level and goal."
        )

    def _call_gemini(self, prompt: str) -> str:
        response = self._client.models.generate_content(model=_MODEL, contents=prompt)
        return response.text
