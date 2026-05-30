from typing import Any, Optional

from pgvector.sqlalchemy import Vector
from sqlalchemy import Column
from sqlmodel import Field, SQLModel

EMBEDDING_DIM = 768

class EmbeddingDocument(SQLModel, table=True):
    __tablename__ = "embedding_document"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    chunk_text: str
    chunk_index: int
    content_type: str
    metadata_json: Optional[str] = Field(default=None)
    embedding: Any = Field(sa_column=Column(Vector(EMBEDDING_DIM), nullable=False))
