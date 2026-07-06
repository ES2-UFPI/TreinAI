from types import SimpleNamespace
from unittest.mock import MagicMock


def test_workout_request_aceita_dias_disponiveis():
    from domain.workout_plan import WorkoutRequest

    request = WorkoutRequest(
        user_id=1,
        query="quero treinar",
        available_days=["monday", "wednesday"],
    )

    assert request.available_days == ["monday", "wednesday"]


def test_servico_repassa_dias_disponiveis_para_o_facade():
    from services.workout_service import WorkoutService

    mock_repo_usuario = MagicMock()
    mock_repo_treino_usuario = MagicMock()
    mock_repo_treino = MagicMock()
    mock_llm = MagicMock()

    mock_repo_usuario.get_by_id.return_value = MagicMock(id=1)
    mock_llm.generate_workout_plan.return_value = MagicMock(title="Treino", days=[])

    servico = WorkoutService(
        mock_repo_usuario, mock_repo_treino_usuario, mock_repo_treino, mock_llm
    )

    servico.generate(
        user_id=1,
        query="quero treinar",
        available_days=["monday", "wednesday"],
    )

    _, kwargs = mock_llm.generate_workout_plan.call_args
    assert kwargs["available_days"] == ["monday", "wednesday"]


def test_prompt_orienta_ia_a_usar_apenas_os_dias_disponiveis():
    from services.llm_facade import LLMFacade

    facade = object.__new__(LLMFacade)
    user = SimpleNamespace(
        name="Ana",
        age=30,
        weight=70,
        height=170,
        goal="hipertrofia",
        level=SimpleNamespace(value="beginner"),
    )

    prompt = facade._build_prompt(
        "quero treinar",
        user,
        context=None,
        available_days=["monday", "wednesday"],
    )

    assert "Available training days: monday, wednesday" in prompt
    assert "days_per_week must be 2" in prompt
