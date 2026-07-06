export const TRAINING_DAYS = [
  { label: "Seg", fullLabel: "Segunda-feira", value: "monday" },
  { label: "Ter", fullLabel: "Terça-feira", value: "tuesday" },
  { label: "Qua", fullLabel: "Quarta-feira", value: "wednesday" },
  { label: "Qui", fullLabel: "Quinta-feira", value: "thursday" },
  { label: "Sex", fullLabel: "Sexta-feira", value: "friday" },
  { label: "Sáb", fullLabel: "Sábado", value: "saturday" },
  { label: "Dom", fullLabel: "Domingo", value: "sunday" },
] as const;

export type TrainingDayValue = (typeof TRAINING_DAYS)[number]["value"];

const WEEK_ORDER = TRAINING_DAYS.map((day) => day.value);

export function toggleTrainingDaySelection(
  selectedDays: string[],
  day: string,
): string[] {
  if (selectedDays.includes(day)) {
    return selectedDays.filter((selectedDay) => selectedDay !== day);
  }

  return [...selectedDays, day].sort(
    (a, b) => WEEK_ORDER.indexOf(a as TrainingDayValue) - WEEK_ORDER.indexOf(b as TrainingDayValue),
  );
}
