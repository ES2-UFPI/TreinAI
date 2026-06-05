import json
import re

from ollama import Client

from repositories.workout_repository import WorkoutRepository
from core.database import get_session
from core.config import settings
from domain.user import User
from domain.workout import DifficultyLevel
from domain.workout_plan import WorkoutPlan
from services.rag_engine import RAGEngine
from services.workout_factory import WorkoutFactory

_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "title":                  {"type": "string"},
        "description":            {"type": "string"},
        "main_goal":              {"type": "string"},
        "workout_type":           {"type": "string"},
        "training_level":         {"type": "string", "enum": ["beginner", "intermediate", "advanced"]},
        "program_duration_weeks": {"type": "integer"},
        "days_per_week":          {"type": "integer"},
        "time_per_workout":       {"type": "string"},
        "equipment_required":     {"type": "string"},
        "target_gender":          {"type": "string"},
        "exercises": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name":         {"type": "string"},
                    "sets":         {"type": "integer"},
                    "reps":         {"type": "string"},
                    "rest_seconds": {"type": "integer"},
                    "muscle_group": {"type": "string"},
                    "notes":        {"type": "string"},
                },
                "required": ["name", "sets", "reps"],
            },
        },
    },
    "required": ["title", "main_goal", "workout_type", "training_level", "exercises"],
}


class LLMFacade:
    def __init__(self, rag_engine: RAGEngine) -> None:
        self._rag = rag_engine
        self._client = Client(
            host=settings.OLLAMA_HOST,
            headers={"Authorization": f"Bearer {settings.OLLAMA_API_KEY}"},
        )

    def generate_workout_plan(self, user_query: str, user: User) -> WorkoutPlan:
        context = self._rag.retrieve_context(self._build_rag_query(query=user_query))
        prompt = self._build_prompt(user_query, user, context)
        data = self._call_llm_json(prompt)
        return WorkoutFactory.from_llm_response(data)

    def _build_rag_query(self, query: str) -> str:
        return f"{query} workout"

    def _build_prompt(self, user_query: str, user: User, context: str | None) -> str:
        schema_str = json.dumps(_RESPONSE_SCHEMA, indent=2)
        return (
            "You are an expert personal trainer. Create a personalized workout plan.\n\n"
            "User profile:\n"
            f"- Name: {user.name}\n"
            f"- Age: {user.age} | Weight: {user.weight}kg | Height: {user.height}cm\n"
            f"- Global Goal: {user.goal}\n"
            f"- (Precedence over global goal) Last query request: {user_query}\n"
            f"- Level: {user.level.value}\n\n"
            "Reference workouts from our database:\n"
            f"{context or 'No reference workouts available.'}\n\n"
            "Based on the user profile and reference workouts, create a tailored workout plan. "
            "Adapt intensity and exercises to the user's level and goal. "
            "Always answer in pt-BR, translate everything.\n\n"
            "Respond ONLY with a valid JSON object matching this schema (no markdown, no explanation):\n"
            f"{schema_str}"
        )

    def _call_llm_json(self, prompt: str, retries: int = 2) -> dict:
        for attempt in range(retries + 1):
            chunks = []
            for part in self._client.chat(model=settings.LLM_MODEL, messages=[{"role": "user", "content": prompt}], format="json", stream=True):
                chunks.append(part.message.content)
                
            content = "".join(chunks)
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if not match:
                if attempt < retries:
                    continue
                raise ValueError(f"No JSON found in model response: {content!r}")
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                if attempt < retries:
                    continue
                raise
