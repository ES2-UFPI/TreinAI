"""adiciona workout_id a userworkout e novos campos a workout_exercise

Revision ID: f6a7b8c9d0e1
Revises: e5f6a7b8c9d0
Create Date: 2026-07-01 15:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "f6a7b8c9d0e1"
down_revision: Union[str, Sequence[str], None] = "e5f6a7b8c9d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "userworkout",
        sa.Column("workout_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_userworkout_workout_id",
        "userworkout",
        "workout",
        ["workout_id"],
        ["id"],
    )

    op.alter_column(
        "workout_exercise",
        "exercise_id",
        existing_type=sa.Integer(),
        nullable=True,
    )
    op.add_column(
        "workout_exercise",
        sa.Column("day", sa.Integer(), nullable=False, server_default="0"),
    )
    op.add_column(
        "workout_exercise",
        sa.Column("focus", sa.String(), nullable=False, server_default=""),
    )
    op.add_column(
        "workout_exercise",
        sa.Column("name", sa.String(), nullable=False, server_default=""),
    )
    op.add_column(
        "workout_exercise",
        sa.Column("muscle_group", sa.String(), nullable=True),
    )


def downgrade() -> None:
    op.drop_column("workout_exercise", "muscle_group")
    op.drop_column("workout_exercise", "name")
    op.drop_column("workout_exercise", "focus")
    op.drop_column("workout_exercise", "day")
    op.alter_column(
        "workout_exercise",
        "exercise_id",
        existing_type=sa.Integer(),
        nullable=False,
    )
    op.drop_constraint("fk_userworkout_workout_id", "userworkout", type_="foreignkey")
    op.drop_column("userworkout", "workout_id")