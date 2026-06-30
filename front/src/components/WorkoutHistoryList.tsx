import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/styles/theme";

export type WorkoutHistoryEntry = {
  id: number;
  title: string;
};

type WorkoutHistoryListProps = {
  workouts: WorkoutHistoryEntry[];
  loading?: boolean;
  onItemPress?: (id: number) => void;
};

export default function WorkoutHistoryList({
  workouts,
  loading = false,
  onItemPress,
}: WorkoutHistoryListProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Histórico de treinos</Text>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} />
        </View>
      )}

      {!loading && workouts.length === 0 && (
        <Text style={styles.empty}>Nenhum treino realizado ainda.</Text>
      )}

      {!loading &&
        workouts.map((workout) => (
          <Pressable
            key={workout.id}
            onPress={() => onItemPress?.(workout.id)}
            style={({ pressed }) => pressed && styles.itemPressed}
          >
            <HistoryItem name={workout.title} />
          </Pressable>
        ))}
    </View>
  );
}

function HistoryItem({ name }: { name: string }) {
  return (
    <View style={styles.historyItem}>
      <Text style={styles.historyIcon}>🏋️</Text>
      <Text style={styles.historyName}>{name}</Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Concluído</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: colors.text },
  centered: { paddingVertical: 12, alignItems: "center" },
  empty: { fontSize: 13, color: colors.textDim, paddingVertical: 4 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  historyIcon: { fontSize: 14 },
  historyName: { flex: 1, fontSize: 13, color: colors.text },
  badge: {
    backgroundColor: colors.accentDim,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, color: colors.accent, fontWeight: "600" },
  itemPressed: { opacity: 0.7 },
});
