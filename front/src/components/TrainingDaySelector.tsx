import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  TRAINING_DAYS,
  toggleTrainingDaySelection,
  type TrainingDayValue,
} from "@/domain/trainingDays";
import { colors, radius } from "@/styles/theme";

type TrainingDaySelectorProps = {
  value: TrainingDayValue[];
  disabled?: boolean;
  onChange: (days: TrainingDayValue[]) => void;
};

export default function TrainingDaySelector({
  value,
  disabled = false,
  onChange,
}: TrainingDaySelectorProps) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>Dias disponíveis</Text>
      <View style={styles.options}>
        {TRAINING_DAYS.map((day) => {
          const selected = value.includes(day.value);

          return (
            <Pressable
              key={day.value}
              accessibilityRole="button"
              accessibilityLabel={day.fullLabel}
              accessibilityState={{ selected, disabled }}
              disabled={disabled}
              onPress={() =>
                onChange(
                  toggleTrainingDaySelection(value, day.value) as TrainingDayValue[],
                )
              }
              style={({ pressed }) => [
                styles.option,
                selected && styles.selected,
                pressed && !disabled && styles.pressed,
                disabled && styles.disabled,
              ]}
            >
              <Text style={[styles.optionText, selected && styles.selectedText]}>
                {day.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    width: "100%",
    gap: 6,
    alignItems: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    color: colors.textDim,
    textAlign: "center",
  },
  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  option: {
    minWidth: 44,
    borderColor: colors.border,
    borderRadius: radius,
    borderWidth: 1,
    backgroundColor: colors.surface2,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  pressed: {
    opacity: 0.82,
  },
  disabled: {
    opacity: 0.6,
  },
  optionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  selectedText: {
    color: colors.bg,
  },
});
