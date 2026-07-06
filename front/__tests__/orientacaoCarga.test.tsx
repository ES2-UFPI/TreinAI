import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";

const mockBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({ back: mockBack }),
  usePathname: () => "/load-guide",
}));

jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import LoadGuideScreen from "@/app/load-guide";

describe("Tela de orientacao de carga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve exibir as orientacoes para escolher a carga certa", async () => {
    await render(<LoadGuideScreen />);

    expect(screen.getByText("Como escolher a carga certa?")).toBeOnTheScreen();
    expect(screen.getByText("Exemplo")).toBeOnTheScreen();
    expect(screen.getByText(/Meta: 8-12 repeticoes/)).toBeOnTheScreen();
    expect(screen.getByText(/pelo menos 8 repeticoes/)).toBeOnTheScreen();
    expect(screen.getByText(/aumente a carga na proxima sessao/)).toBeOnTheScreen();
  });

  it("deve permitir voltar para a tela anterior", async () => {
    await render(<LoadGuideScreen />);

    fireEvent.press(screen.getByText("Voltar"));

    expect(mockBack).toHaveBeenCalled();
  });
});
