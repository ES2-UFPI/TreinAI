from unittest.mock import MagicMock

from domain.exercise import Modality


class TestGeracaoTreinoConsiderandoModalidade:
    def test_repassa_modalidade_para_o_facade(self):
        from services.workout_service import WorkoutService

        mock_repo_usuario = MagicMock()
        mock_repo_treino_usuario = MagicMock()
        mock_repo_treino = MagicMock()
        mock_llm = MagicMock()

        mock_repo_usuario.get_by_id.return_value = MagicMock(id=1)
        mock_llm.generate_workout_plan.return_value = MagicMock(
            title="Treino", days=[]
        )

        servico = WorkoutService(
            mock_repo_usuario, mock_repo_treino_usuario, mock_repo_treino, mock_llm
        )

        servico.generate(user_id=1, query="quero treinar em casa", modality=Modality.bodyweight)

        _, kwargs = mock_llm.generate_workout_plan.call_args
        assert kwargs["modality"] == Modality.bodyweight