# Servico tlvz precise modificar ja que o banco ja ta estruturado
# pra poupar fazer busca vetorial/contextual toda vez
# e fazer um select normal
# "preciso de um treino para iniciante" -> busca no banco direto por iniciante

from ollama import Client

from core.config import settings
from repositories.workout_repository import WorkoutRepository

EMBED_MODEL = settings.EMBED_MODEL
EMBEDDING_DIM = settings.EMBED_DIM


def _ollama_headers() -> dict[str, str]:
    if not settings.OLLAMA_API_KEY:
        return {}
    return {"Authorization": f"Bearer {settings.OLLAMA_API_KEY}"}


class RAGEngine:
    def __init__(self, workout_repository: WorkoutRepository) -> None:
        self._repo = workout_repository
        self._client = Client(
            host=settings.OLLAMA_HOST,
            headers=_ollama_headers(),
        )

    def _embed_query(self, query: str) -> list[float]:
        response = self._client.embed(model=EMBED_MODEL, input=query, dimensions=EMBEDDING_DIM)
        return response["embeddings"][0]

    def retrieve_context(self, query: str, n: int = 3) -> str | None:
        try:
            vector = self._embed_query(query)
            rows = self._repo.search_similar(vector, n=n)
        except Exception:
            return None

        if not rows:
            return None

        parts = [f"[{i}] {title}\n{chunk_text}" for i, (title, chunk_text) in enumerate(rows, start=1)]
        return "\n\n---\n\n".join(parts)
