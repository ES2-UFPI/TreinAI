from fastapi import APIRouter

router = APIRouter(prefix="/help", tags=["help"])


@router.get("", response_model=dict[str, list[str]])
def get_help() -> dict[str, list[str]]:
    """
    Endpoint simples que retorna um pequeno tutorial e dicas gerais.
    Troque o conteúdo estático por leitura do banco se quiser conteúdo dinâmico.
    """
    return {
        "intro": [
            "Bem-vindo ao TreinAI — crie treinos, adicione exercícios e acompanhe seu progresso.",
            "Use a aba 'Programs' para seguir um plano estruturado."
        ],
        "quick_tips": [
            "Priorize forma correta sobre carga.",
            "Aqueça por 5-10 minutos antes do treino.",
            "Consistência é mais importante que intensidade inicial."
        ],
        "resources": [
            "Documentação do app: /docs",
            "Contate suporte: suporte@treinai.exemplo"
        ]
    }
