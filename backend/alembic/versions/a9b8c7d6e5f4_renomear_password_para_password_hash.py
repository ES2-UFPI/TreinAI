"""renomear password para password_hash

Revision ID: a9b8c7d6e5f4
Revises: f5a3d2c1b7e9
Create Date: 2026-06-01 12:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = "a9b8c7d6e5f4"
down_revision: Union[str, Sequence[str], None] = "f5a3d2c1b7e9"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    op.alter_column(
        "user",
        "password",
        new_column_name="password_hash",
        existing_type=sqlmodel.sql.sqltypes.AutoString(),
        existing_nullable=False,
    )


def downgrade() -> None:
    """Downgrade schema."""
    op.alter_column(
        "user",
        "password_hash",
        new_column_name="password",
        existing_type=sqlmodel.sql.sqltypes.AutoString(),
        existing_nullable=False,
    )
