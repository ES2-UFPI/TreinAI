"""criar tabela de user

Revision ID: f5a3d2c1b7e9
Revises: c3a0d90cff64
Create Date: 2026-06-01 11:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "f5a3d2c1b7e9"
down_revision: Union[str, Sequence[str], None] = "c3a0d90cff64"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("email", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("password", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column("age", sa.Integer(), nullable=False),
        sa.Column("weight", sa.Float(), nullable=False),
        sa.Column("height", sa.Float(), nullable=False),
        sa.Column("goal", sqlmodel.sql.sqltypes.AutoString(), nullable=False),
        sa.Column(
            "level",
            postgresql.ENUM(
                "beginner",
                "intermediate",
                "advanced",
                name="difficultylevel",
                create_type=False,
            ),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_user_email"), "user", ["email"], unique=True)


def downgrade() -> None:
    """Downgrade schema."""
    op.drop_index(op.f("ix_user_email"), table_name="user")
    op.drop_table("user")
