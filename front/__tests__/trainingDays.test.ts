import {
  TRAINING_DAYS,
  toggleTrainingDaySelection,
} from "@/domain/trainingDays";

describe("seleção de dias de treino", () => {
  it("mantém a seleção vazia quando nenhum dia foi escolhido", () => {
    expect(toggleTrainingDaySelection([], "monday")).toEqual(["monday"]);
    expect(TRAINING_DAYS).toHaveLength(7);
  });

  it("permite selecionar apenas um dia", () => {
    expect(toggleTrainingDaySelection([], "wednesday")).toEqual(["wednesday"]);
  });

  it("permite selecionar todos os dias preservando a ordem da semana", () => {
    const selected = TRAINING_DAYS.reduce<string[]>(
      (current, day) => toggleTrainingDaySelection(current, day.value),
      [],
    );

    expect(selected).toEqual(TRAINING_DAYS.map((day) => day.value));
  });

  it("remove um dia quando ele é selecionado novamente", () => {
    expect(toggleTrainingDaySelection(["monday", "wednesday"], "monday")).toEqual([
      "wednesday",
    ]);
  });
});
