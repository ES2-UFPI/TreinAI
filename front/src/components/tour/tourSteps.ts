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
    placement: "top",
  },
  {
    id: "nav-profile",
    title: "👤 Seu perfil",
    description:
      "Atualize idade, peso, altura, objetivo e nível para a IA personalizar cada treino de acordo com você.",
    placement: "top",
  },
  {
    id: "nav-help",
    title: "❓ Precisa de ajuda?",
    description:
      "Dicas rápidas e suporte estão sempre disponíveis aqui. Você também pode refazer o tour a qualquer momento.",
    placement: "top",
  },
];
