import React from "react";
import { render, screen, waitFor } from "@testing-library/react-native";

import type { WorkoutPlan } from "@/domain/workout";

const mockBuscarDetalheTreino = jest.fn();
const mockUseLocalSearchParams = jest.fn();

jest.mock("@/services/api", () => ({
  buscarDetalheTreino: (...args: any[]) => mockBuscarDetalheTreino(...args),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => mockUseLocalSearchParams(),
  useRouter: () => ({ back: jest.fn(), push: jest.fn() }),
  usePathname: () => '/workout/1',
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import WorkoutDetailScreen from "@/app/workout/[id]";

const planoMock: WorkoutPlan = {
  title: "Treino A",
  description: "Treino de força",
  main_goal: "hipertrofia",
  workout_type: "força",
  training_level: "beginner",
  program_duration_weeks: 4,
  days_per_week: 3,
  time_per_workout: "45 min",
  equipment_required: "halteres",
  target_gender: "unisex",
  days: [
    {
      day: 1,
      focus: "Peito",
      exercises: [
        { name: "Supino", sets: 4, reps: "12", rest_seconds: 60, muscle_group: "Peitoral" },
      ],
    },
  ],
};

function setup(params: Record<string, string> = { id: "1" }) {
  mockUseLocalSearchParams.mockReturnValue(params);
  mockBuscarDetalheTreino.mockReset();
}

describe("Tela de detalhe do treino", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve buscar o treino pelo id ao montar a tela", async () => {
    setup({ id: "5" });
    mockBuscarDetalheTreino.mockResolvedValue(planoMock);

    await render(<WorkoutDetailScreen />);

    await waitFor(() => {
      expect(mockBuscarDetalheTreino).toHaveBeenCalledWith(5);
    });
  });

  it("deve exibir o titulo do treino quando carregado", async () => {
    setup();
    mockBuscarDetalheTreino.mockResolvedValue(planoMock);

    await render(<WorkoutDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText("Treino A")).toBeOnTheScreen();
    });
  });

  it("deve exibir mensagem de erro quando a busca falha", async () => {
    setup({ id: "999" });
    mockBuscarDetalheTreino.mockRejectedValue(new Error("Treino não encontrado"));

    await render(<WorkoutDetailScreen />);

    await waitFor(() => {
      expect(screen.getByText(/Treino não encontrado/)).toBeOnTheScreen();
    });
  });

  it("deve exibir indicador de carregamento enquanto busca", async () => {
    setup();
    mockBuscarDetalheTreino.mockReturnValue(new Promise(() => {}));

    await render(<WorkoutDetailScreen />);

    expect(screen.getByTestId("loading")).toBeOnTheScreen();
  });
});
