"""Corrige requires_equipment e modality baseado no campo equipment

Revision ID: b2c3d4e5f6a7
Revises: a1b2c3d4e5f6
Create Date: 2026-06-04 16:32:27.000000
"""
from alembic import op
import sqlalchemy as sa

revision = "b2c3d4e5f6a7"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None

# Palavras que indicam bodyweight
BODYWEIGHT_VALUES = ("Bodyweight", "bodyweight", "none", "None")

def upgrade() -> None:
    conn = op.get_bind()

    # Exercícios COM equipamento real → equipment + requires_equipment = true
    conn.execute(sa.text("""
        UPDATE exercise
        SET 
            requires_equipment = true,
            modality = 'equipment'
        WHERE 
            equipment IS NOT NULL
            AND LOWER(equipment) NOT IN ('bodyweight', 'none', 'no equipment', '')
    """))

    # Exercícios SEM equipamento ou bodyweight → bodyweight + requires_equipment = false
    conn.execute(sa.text("""
        UPDATE exercise
        SET 
            requires_equipment = false,
            modality = 'bodyweight'
        WHERE 
            equipment IS NULL
            OR LOWER(equipment) IN ('bodyweight', 'none', 'no equipment', '')
    """))

def downgrade() -> None:
    # Reverte tudo para o estado anterior (todos bodyweight/false)
    op.execute(sa.text("""
        UPDATE exercise SET requires_equipment = false, modality = 'bodyweight'
    """))