from datetime import datetime
from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException
from fastapi import status

from domain.user_workout import WorkoutHistoryItem
from domain.workout_plan import PlannedExercise, WorkoutDay, WorkoutPlan


class TestDetalheTreinoNoServico:
    def test_retornar_plano_completo_quando_treino_existe(self):
        from services.workout_service import WorkoutService

        mock_user_repo = MagicMock()
        mock_user_workout_repo = MagicMock()
        mock_llm_facade = MagicMock()

        servico = WorkoutService(mock_user_repo, mock_user_workout_repo, mock_llm_facade)

        plano_esperado = WorkoutPlan(
            title="Treino A",
            description="Treino de força",
            main_goal="hipertrofia",
            workout_type="força",
            training_level="beginner",
            program_duration_weeks=4,
            days_per_week=3,
            time_per_workout="45 min",
            equipment_required="halteres",
            target_gender="unisex",
            days=[
                WorkoutDay(
                    day=1,
                    focus="Peito",
                    exercises=[
                        PlannedExercise(
                            order=1,
                            name="Supino",
                            sets=4,
                            reps="12",
                            rest_seconds=60,
                            muscle_group="Peitoral",
                        ),
                    ],
                )
            ],
        )

        mock_user_workout_repo.get_by_id.return_value = WorkoutHistoryItem(
            id=1, title="Treino A", created_at=datetime(2026, 1, 1)
        )

        resultado = servico.get_detalhe_treino(1)

        assert resultado == plano_esperado

    def test_lancar_erro_quando_treino_nao_encontrado(self):
        from services.workout_service import WorkoutService

        mock_user_repo = MagicMock()
        mock_user_workout_repo = MagicMock()
        mock_llm_facade = MagicMock()

        servico = WorkoutService(mock_user_repo, mock_user_workout_repo, mock_llm_facade)

        mock_user_workout_repo.get_by_id.return_value = None

        with pytest.raises(TreinoNaoEncontradoError):
            servico.get_detalhe_treino(999)


class TestDetalheTreinoNoController:
    def test_retornar_404_quando_treino_nao_encontrado(self):
        from controllers.workout_controller import get_detalhe_treino

        mock_servico = MagicMock()
        mock_servico.get_detalhe_treino.side_effect = TreinoNaoEncontradoError()

        with pytest.raises(HTTPException) as exc:
            get_detalhe_treino(workout_id=999, service=mock_servico)

        assert exc.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc.value.detail == "Treino não encontrado"


class TreinoNaoEncontradoError(Exception):
    pass
