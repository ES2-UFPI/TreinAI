import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import WorkoutHistoryList from "@/components/WorkoutHistoryList";
import { getWorkoutHistory, type WorkoutHistoryItem } from "@/services/api";
import { getUserId } from "@/services/session";
import { colors } from "@/styles/theme";

export default function WorkoutsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [workouts, setWorkouts] = useState<WorkoutHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const userId = await getUserId();
      if (!userId) {
        setWorkouts([]);
        setLoading(false);
        return;
      }

      try {
        const data = await getWorkoutHistory(Number(userId));
        setWorkouts(data);
      } catch {
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>TreinAI</Text>
        <Text style={styles.title}>Meus treinos</Text>
        <Text style={styles.subtitle}>
          Treinos gerados pela IA ficam salvos aqui.
        </Text>

        <WorkoutHistoryList
          workouts={workouts}
          loading={loading}
          onItemPress={(id) => router.push(`/workout/${id}`)}
        />
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    gap: 14,
    alignItems: "center",
  },
  brand: {
    fontFamily: "Exo_900Black",
    fontSize: 24,
    letterSpacing: 2,
    color: colors.accent,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textDim,
    textAlign: "center",
    marginBottom: 6,
  },
});
