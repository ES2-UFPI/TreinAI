/**
 * Passos do tour do TreinAI
 *
 */

import type { TourStep } from "./FeatureTour";

export const TREINAI_TOUR_STEPS: TourStep[] = [
  {
    id: "gen-workout",
    title: "🤖 Gere seu treino com IA",
    description:
      'Descreva seu objetivo em linguagem simples — "emagrecer", "ganhar massa em casa 3x por semana". A IA monta um plano completo só para você.',
    placement: "bottom",
  },
  {
    id: "nav-workouts",
    title: "📋 Meus treinos",
    description:
      "Todos os treinos gerados ficam salvos aqui. Abra qualquer um para ver exercícios, séries, repetições e tempo de descanso.",
    placement: "bottom",
  },
  {
    id: "nav-exercises",
    title: "🏋️ Catálogo de exercícios",
    description:
      "Explore centenas de exercícios com músculo-alvo e requisito de equipamento. Filtre por modalidade: com equipamento ou bodyweight.",
    placement: "bottom",
  },
  {
    id: "stats-panel",
    title: "📊 Acompanhe sua evolução",
    description:
      "Veja seus dias ativos, treinos concluídos e nível atual. Quanto mais você usa, mais a IA aprende seu perfil.",
    placement: "top",
  },
  {
    id: "workout-history",
    title: "🕒 Histórico de treinos",
    description:
      "Seus treinos recentes aparecem aqui. Toque em qualquer sessão para ver os detalhes ou repetir o treino.",
    placement: "top",
  },
  {
    id: "nav-help",
    title: "❓ Precisa de ajuda?",
    description:
      "Dicas rápidas e suporte estão sempre disponíveis aqui. Você também pode refazer este tour a qualquer momento.",
    placement: "bottom",
  },
];
