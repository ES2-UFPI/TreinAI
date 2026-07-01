from unittest.mock import MagicMock

import pytest
from fastapi import HTTPException
from fastapi import status

from domain.user_workout import WorkoutNotFoundError, UserWorkout
from domain.workout import DifficultyLevel, Workout
from domain.workout_exercise import WorkoutExercise
from domain.workout_plan import PlannedExercise, WorkoutDay, WorkoutPlan


class TestDetalheTreinoNoServico:
    def test_retornar_plano_completo_quando_treino_existe(self):
        from services.workout_service import WorkoutService

        mock_repo_usuario = MagicMock()
        mock_repo_treino_usuario = MagicMock()
        mock_repo_treino = MagicMock()
        mock_llm = MagicMock()

        servico = WorkoutService(
            mock_repo_usuario, mock_repo_treino_usuario, mock_repo_treino, mock_llm
        )

        mock_repo_treino_usuario.get_by_id.return_value = UserWorkout(
            id=1, user_id=100, workout_id=10, title="Treino A"
        )

        treino_db = Workout(
            id=10,
            title="Treino A",
            description="Treino de força",
            main_goal="hipertrofia",
            workout_type="força",
            training_level=DifficultyLevel.beginner,
            program_duration_weeks=4,
            days_per_week=3,
            time_per_workout="45 min",
            equipment_required="halteres",
            target_gender="unisex",
        )
        mock_repo_treino.get_workout_by_id.return_value = treino_db

        mock_repo_treino.get_exercises_by_workout_id.return_value = [
            WorkoutExercise(
                day=1,
                focus="Peito",
                order=1,
                name="Supino",
                sets=4,
                reps="12",
                rest_seconds=60,
                muscle_group="Peitoral",
            ),
        ]

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

        resultado = servico.get_workout_detail(1)

        assert resultado == plano_esperado

    def test_lancar_erro_quando_treino_nao_encontrado(self):
        from services.workout_service import WorkoutService

        mock_repo_usuario = MagicMock()
        mock_repo_treino_usuario = MagicMock()
        mock_repo_treino = MagicMock()
        mock_llm = MagicMock()

        servico = WorkoutService(
            mock_repo_usuario, mock_repo_treino_usuario, mock_repo_treino, mock_llm
        )

        mock_repo_treino_usuario.get_by_id.return_value = None

        with pytest.raises(WorkoutNotFoundError):
            servico.get_workout_detail(999)


class TestDetalheTreinoNoController:
    def test_retornar_404_quando_treino_nao_encontrado(self):
        from controllers.workout_controller import get_workout_detail

        mock_servico = MagicMock()
        mock_servico.get_workout_detail.side_effect = WorkoutNotFoundError()

        with pytest.raises(HTTPException) as exc:
            get_workout_detail(workout_id=999, service=mock_servico)

        assert exc.value.status_code == status.HTTP_404_NOT_FOUND
        assert exc.value.detail == "Treino não encontrado"
