import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import type { WorkoutHistoryItem } from "@/services/api";
import { colors } from "@/styles/theme";

type WorkoutHistoryListProps = {
  workouts: WorkoutHistoryItem[];
  loading?: boolean;
  onItemPress?: (id: number) => void;
};

function formatDate(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const time = `${hours}:${minutes}`;

  if (isSameDay(d, today)) return { date: "Hoje", time };
  if (isSameDay(d, yesterday)) return { date: "Ontem", time };

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return { date: `${day}/${month}/${year}`, time };
}

export default function WorkoutHistoryList({
  workouts,
  loading = false,
  onItemPress,
}: WorkoutHistoryListProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>HISTÓRICO</Text>
      </View>

      {loading && (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.accent} size="small" />
        </View>
      )}

      {/* Empty */}
      {!loading && workouts.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Nenhum treino registrado</Text>
          <Text style={styles.emptySubtitle}>
            Gere seu primeiro treino e ele vai aparecer aqui.
          </Text>
        </View>
      )}

      {/* List */}
      {!loading && workouts.length > 0 && (
        <View style={styles.list}>
          {workouts.map((workout) => {
            const { date, time } = formatDate(workout.created_at);

            return (
              <Pressable
                key={workout.id}
                onPress={() => onItemPress?.(workout.id)}
                style={({ pressed }) => [
                  styles.card,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardMeta}>
                  <Text style={styles.metaDate}>{date}</Text>
                  <Text style={styles.metaDot}>·</Text>
                  <Text style={styles.metaTime}>{time}</Text>
                </View>
                <View style={styles.cardBottom}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {workout.title}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={colors.accent}
                    style={styles.cardChevron}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },

  // ── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: colors.textDim,
  },
  headerCount: {
    fontSize: 11,
    color: colors.textDim,
    opacity: 0.6,
  },

  // ── Loading / Empty ──────────────────────────────────────────────────────
  centered: {
    paddingVertical: 32,
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    gap: 6,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textDim,
  },
  emptySubtitle: {
    fontSize: 12,
    color: colors.textDim,
    opacity: 0.6,
    lineHeight: 18,
  },

  // ── List ─────────────────────────────────────────────────────────────────
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // Card
  card: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 4,
  },
  cardPressed: {
    opacity: 0.6,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaDate: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.accent,
  },
  metaDot: {
    fontSize: 11,
    color: colors.textDim,
    opacity: 0.5,
  },
  metaTime: {
    fontSize: 11,
    color: colors.textDim,
    opacity: 0.7,
  },
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    lineHeight: 19,
  },
  cardChevron: {
    marginTop: 1,
  },
});