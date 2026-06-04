from sqlalchemy import text
from sqlmodel import Session


class WorkoutRepository:
    def __init__(self, session: Session) -> None:
        self.session = session

    def search_similar(
        self, vector: list[float], n: int = 3, min_similarity: float = 0.55
    ) -> list[tuple[str, str]]:
        vector_literal = f"[{','.join(str(v) for v in vector)}]"
        sql = text("""
            SELECT title, chunk_text,
                1 - (embedding <=> CAST(:vec AS vector)) AS similarity
            FROM embedding_document
            WHERE 1 - (embedding <=> CAST(:vec AS vector)) > :min_sim
            ORDER BY similarity DESC
            LIMIT :n
        """)
        rows = self.session.exec(
            sql, params={"vec": vector_literal, "n": n, "min_sim": min_similarity}
        ).all()
        return [(row[0], row[1]) for row in rows]
