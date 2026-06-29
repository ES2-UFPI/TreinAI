import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";

import WorkoutHistoryList from "@/components/WorkoutHistoryList";
import {
  TourProvider,
  useTour,
  useTourRef,
} from "@/components/tour/FeatureTour";
import { TREINAI_TOUR_STEPS } from "@/components/tour/tourSteps";
import {
  markTourSeen,
  resetTourSeen,
  useTourAutoStart,
} from "@/components/tour/useTourAutoStart";
import { getWorkoutHistory } from "@/services/api";
import { getUserId, getUserName } from "@/services/session";

export default function DashboardScreen() {
  return (
    <TourProvider steps={TREINAI_TOUR_STEPS} onFinish={markTourSeen}>
      <DashboardContent />
    </TourProvider>
  );
}

function DashboardContent() {
  useTourAutoStart(600);
  const router = useRouter();

  const refGen = useTourRef("gen-workout");
  const refWorkouts = useTourRef("nav-workouts");
  const refExercises = useTourRef("nav-exercises");
  const refStats = useTourRef("stats-panel");
  const refHistory = useTourRef("workout-history");
  const refHelp = useTourRef("nav-help");

  const { startTour } = useTour();

  const [userName, setUserName] = useState("");
  const [workouts, setWorkouts] = useState<{ id: number; title: string }[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      const userId = await getUserId();
      const name = await getUserName();
      if (name) setUserName(name);

      if (!userId) {
        setHistoryLoading(false);
        return;
      }

      try {
        const data = await getWorkoutHistory(Number(userId));
        setWorkouts(data.map((item) => ({ id: item.id, title: item.title })));
      } catch {
        setWorkouts([]);
      } finally {
        setHistoryLoading(false);
      }
    }

    loadHistory();
  }, []);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>
        Olá{userName ? `, ${userName.split(" ")[0]}` : ""} 👋
      </Text>
      <Text style={styles.subtitle}>Pronto para treinar hoje?</Text>

      <View ref={refGen} style={styles.card}>
        <Text style={styles.cardTitle}>Gerar treino com IA</Text>
        <View style={styles.inputMock}>
          <Text style={styles.inputText}>
            Ex: &quot;Quero emagrecer, treino em casa, 3x por semana&quot;
          </Text>
        </View>
        <Pressable style={styles.btnGreen}>
          <Text style={styles.btnGreenText}>Gerar treino</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <View ref={refWorkouts} style={styles.navChip}>
          <Text style={styles.navChipText}>📋 Meus treinos</Text>
        </View>
        <View ref={refExercises} style={styles.navChip}>
          <Text style={styles.navChipText}>🏋️ Exercícios</Text>
        </View>
        <View ref={refHelp} style={styles.navChip}>
          <Text style={styles.navChipText}>❓ Ajuda</Text>
        </View>
      </View>

      <View ref={refStats} style={styles.statsRow}>
        <StatCard value="3" label="Treinos gerados" />
        <StatCard value="12" label="Dias ativos" />
        <StatCard value="Interm." label="Seu nível" />
      </View>

      <View ref={refHistory}>
        <WorkoutHistoryList
          workouts={workouts}
          loading={historyLoading}
          onItemPress={(id) => router.push(`/workout/${id}`)}
        />
      </View>

      <Pressable
        style={styles.btnOutline}
        onPress={async () => {
          await resetTourSeen();
          startTour();
        }}
      >
        <Text style={styles.btnOutlineText}>Ver tour novamente</Text>
      </Pressable>
    </ScrollView>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const GREEN = "#1D9E75";

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f9f9f7" },
  content: { padding: 20, gap: 14, paddingBottom: 40 },

  greeting: { fontSize: 22, fontWeight: "600", color: "#111" },
  subtitle: { fontSize: 14, color: "#888", marginTop: 2 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    gap: 10,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
  },
  cardTitle: { fontSize: 14, fontWeight: "600", color: "#222" },

  inputMock: {
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#f5f5f3",
  },
  inputText: { fontSize: 13, color: "#999" },

  btnGreen: {
    backgroundColor: GREEN,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  btnGreenText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  row: { flexDirection: "row", gap: 10 },
  navChip: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
  },
  navChipText: { fontSize: 12, color: "#333", fontWeight: "500" },

  statsRow: { flexDirection: "row", gap: 10 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
  },
  statValue: { fontSize: 18, fontWeight: "600", color: "#111" },
  statLabel: { fontSize: 10, color: "#888", marginTop: 2, textAlign: "center" },

  btnOutline: {
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.15)",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  btnOutlineText: { fontSize: 13, color: "#777" },
});
