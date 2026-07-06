import React from "react";
import { act, fireEvent, render, waitFor } from "@testing-library/react-native";

const mockGenerateWorkout = jest.fn();
const mockGetUserId = jest.fn();
const mockReplace = jest.fn();
const mockSetParams = jest.fn();

jest.mock("@/services/api", () => ({
  generateWorkout: (...args: any[]) => mockGenerateWorkout(...args),
  saveWorkoutToHistory: jest.fn(),
}));

jest.mock("@/services/session", () => ({
  getUserId: () => mockGetUserId(),
  getUserName: jest.fn().mockResolvedValue("Thalysson"),
}));

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({}),
  useRouter: () => ({
    push: jest.fn(),
    replace: mockReplace,
    setParams: mockSetParams,
  }),
  usePathname: () => "/",
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("@/components/tour/FeatureTour", () => ({
  TourProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useTour: () => ({ startTour: jest.fn() }),
  useTourRef: () => null,
}));

jest.mock("@/components/tour/useTourAutoStart", () => ({
  markTourSeen: jest.fn(),
  useTourAutoStart: jest.fn(),
}));

jest.mock("@/components/WorkoutModal", () => () => null);
jest.mock("@/components/BottomNav", () => () => null);

import DashboardScreen from "@/app/index";

const workoutResponse = {
  title: "Treino gerado",
  description: "",
  main_goal: "hipertrofia",
  workout_type: "forca",
  training_level: "beginner",
  days: [],
};

type RenderedScreen = Awaited<ReturnType<typeof render>>;

async function renderGenerateScreen() {
  mockGenerateWorkout.mockResolvedValue(workoutResponse);
  mockGetUserId.mockResolvedValue("1");

  const view = await render(<DashboardScreen />);

  await act(async () => {
    fireEvent(
      view.getByPlaceholderText('Ex: "Quero emagrecer, treino em casa, 3x por semana"'),
      "changeText",
      "Quero ganhar massa",
    );
  });

  return view;
}

async function generate(view: RenderedScreen) {
  await act(async () => {
    fireEvent.press(view.getByLabelText("Gerar treino"));
  });
  await waitFor(() => expect(mockGenerateWorkout).toHaveBeenCalled());
}

async function pressDay(view: RenderedScreen, label: string) {
  await act(async () => {
    fireEvent.press(view.getByText(label));
  });
}

describe("Tela de gerar treino - dias disponíveis", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("exibe os dias da semana como opções selecionáveis", async () => {
    const view = await renderGenerateScreen();

    expect(view.getByText("Dias disponíveis")).toBeOnTheScreen();
    expect(view.getByText("Seg")).toBeOnTheScreen();
    expect(view.getByText("Ter")).toBeOnTheScreen();
    expect(view.getByText("Qua")).toBeOnTheScreen();
    expect(view.getByText("Qui")).toBeOnTheScreen();
    expect(view.getByText("Sex")).toBeOnTheScreen();
    expect(view.getByText("Sáb")).toBeOnTheScreen();
    expect(view.getByText("Dom")).toBeOnTheScreen();
  });

  it("gera treino sem enviar dias quando nenhum dia foi selecionado", async () => {
    const view = await renderGenerateScreen();

    await generate(view);

    expect(mockGenerateWorkout).toHaveBeenCalledWith(
      1,
      "Quero ganhar massa",
      undefined,
      undefined,
    );
  });

  it("permite gerar treino com apenas um dia selecionado", async () => {
    const view = await renderGenerateScreen();

    await pressDay(view, "Seg");
    await generate(view);

    expect(view.getByLabelText("Segunda-feira").props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(mockGenerateWorkout).toHaveBeenCalledWith(
      1,
      "Quero ganhar massa",
      undefined,
      ["monday"],
    );
  });

  it("permite gerar treino com todos os dias selecionados", async () => {
    const view = await renderGenerateScreen();

    for (const label of ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"]) {
      await pressDay(view, label);
    }
    await generate(view);

    expect(mockGenerateWorkout).toHaveBeenCalledWith(
      1,
      "Quero ganhar massa",
      undefined,
      ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    );
  });

  it("atualiza a seleção quando o usuário muda os dias escolhidos", async () => {
    const view = await renderGenerateScreen();

    await pressDay(view, "Seg");
    await pressDay(view, "Qua");
    await pressDay(view, "Seg");
    await generate(view);

    expect(view.getByLabelText("Segunda-feira").props.accessibilityState).toMatchObject({
      selected: false,
    });
    expect(view.getByLabelText("Quarta-feira").props.accessibilityState).toMatchObject({
      selected: true,
    });
    expect(mockGenerateWorkout).toHaveBeenCalledWith(
      1,
      "Quero ganhar massa",
      undefined,
      ["wednesday"],
    );
  });
});
