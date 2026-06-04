"""adiciona 'requer equipamento' e modalidade a exercicio

Revision ID: a1b2c3d4e5f6
Revises: a9b8c7d6e5f4
Create Date: 2026-06-04 15:05:10.000000

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "a9b8c7d6e5f4"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# Definimos o Enum do PostgreSQL explicitamente.
# O nome "modality" deve ser único no schema público.
modality_enum = sa.Enum("equipment", "bodyweight", name="modality")


def upgrade() -> None:
    # 1. Cria o tipo ENUM no banco (só roda se ainda não existir)
    modality_enum.create(op.get_bind(), checkfirst=True)

    # 2. Adiciona a coluna requires_equipment
    #    server_default="false" garante que linhas existentes recebam False
    op.add_column(
        "exercise",
        sa.Column(
            "requires_equipment",
            sa.Boolean(),
            nullable=False,
            server_default=sa.text("false"),
        ),
    )

    # 3. Adiciona a coluna modality usando o ENUM criado acima
    #    server_default="bodyweight" garante que linhas existentes recebam o valor padrão
    op.add_column(
        "exercise",
        sa.Column(
            "modality",
            modality_enum,
            nullable=False,
            server_default="bodyweight",
        ),
    )

    # 4. Cria os índices declarados no modelo
    op.create_index(
        op.f("ix_exercise_requires_equipment"),
        "exercise",
        ["requires_equipment"],
        unique=False,
    )
    op.create_index(
        op.f("ix_exercise_modality"),
        "exercise",
        ["modality"],
        unique=False,
    )


def downgrade() -> None:
    # Remove índices
    op.drop_index(op.f("ix_exercise_modality"), table_name="exercise")
    op.drop_index(op.f("ix_exercise_requires_equipment"), table_name="exercise")

    # Remove colunas
    op.drop_column("exercise", "modality")
    op.drop_column("exercise", "requires_equipment")

    # Remove o tipo ENUM do banco
    modality_enum.drop(op.get_bind(), checkfirst=True)
