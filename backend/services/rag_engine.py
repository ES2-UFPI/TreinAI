# Serviço tlvz precise modificar ja que o banco ja ta estruturado
# pra poupar fazer busca vetorial/contextual toda vez
# e fazer um select normal
# "preciso de um treino para iniciante" -> busca no banco direto por iniciante

import ollama

from core.database import get_session
from domain.embedding import EMBEDDING_DIM
from repositories.workout_repository import WorkoutRepository

EMBED_MODEL = "qwen3-embedding:4b"


class RAGEngine:
    def __init__(self, workout_repository: WorkoutRepository) -> None:
        self._repo = workout_repository

    def _embed_query(self, query: str) -> list[float]:
        response = ollama.embed(model=EMBED_MODEL, input=query, dimensions=EMBEDDING_DIM)
        return response["embeddings"][0]

    def retrieve_context(self, query: str, n: int = 3) -> str | None:
        vector = self._embed_query(query)
        rows = self._repo.search_similar(vector, n=n)
        
        if not rows:
            return None
        
        parts = [f"[{i}] {title}\n{chunk_text}" for i, (title, chunk_text) in enumerate(rows, start=1)]
        return "\n\n---\n\n".join(parts)