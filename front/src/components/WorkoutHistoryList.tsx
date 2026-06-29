import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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
          <ActivityIndicator color={GREEN} />
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

const GREEN = "#1D9E75";

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#222" },
  centered: { paddingVertical: 12, alignItems: "center" },
  empty: { fontSize: 13, color: "#999", paddingVertical: 4 },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    borderTopWidth: 0.5,
    borderColor: "rgba(0,0,0,0.06)",
  },
  historyIcon: { fontSize: 14 },
  historyName: { flex: 1, fontSize: 13, color: "#444" },
  badge: {
    backgroundColor: "#E1F5EE",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 10, color: GREEN, fontWeight: "600" },
  itemPressed: { opacity: 0.7 },
});
