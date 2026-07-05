import React, { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import Alert from "@/components/Alert";
import BottomNav from "@/components/BottomNav";
import WorkoutModal from "@/components/WorkoutModal";
import type { Modality, WorkoutPlan } from "@/domain/workout";
import {
  TourProvider,
  useTour,
  useTourRef,
} from "@/components/tour/FeatureTour";
import { TREINAI_TOUR_STEPS } from "@/components/tour/tourSteps";
import {
  markTourSeen,
  useTourAutoStart,
} from "@/components/tour/useTourAutoStart";
import { generateWorkout, saveWorkoutToHistory } from "@/services/api";
import { getUserId, getUserName } from "@/services/session";
import { colors, radius } from "@/styles/theme";
import OptionSelect from "@/components/OptionSelect";

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
  const insets = useSafeAreaInsets();
  const { startTour: startTourParam } = useLocalSearchParams<{
    startTour?: string;
  }>();
  const { startTour } = useTour();

  const refGen = useTourRef("gen-workout");
  const refWorkouts = useTourRef("nav-workouts");
  const refProfile = useTourRef("nav-profile");
  const refHelp = useTourRef("nav-help");

  const [userName, setUserName] = useState("");
  const [prompt, setPrompt] = useState("");
  const [modality, setModality] = useState<Modality | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    getUserName().then((name) => {
      if (name) setUserName(name);
    });
  }, []);

  useEffect(() => {
    if (startTourParam !== "1") return;
    const t = setTimeout(() => {
      startTour();
      router.setParams({ startTour: "" });
    }, 600);
    return () => clearTimeout(t);
  }, [startTourParam, startTour, router]);

  async function handleGenerate() {
    setError("");

    if (!prompt.trim()) {
      setError("Descreva seu objetivo para gerar um treino.");
      return;
    }

    const userId = await getUserId();
    if (!userId) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      const generated = await generateWorkout(Number(userId), prompt.trim(), modality || undefined,);
      setPlan(generated);
    } catch (err: any) {
      setError(err.message || "Nao foi possivel gerar o treino agora.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(planToSave: WorkoutPlan) {
    if (!planToSave.id) return;

    const userId = await getUserId();
    if (!userId) return;

    try {
      await saveWorkoutToHistory(Number(userId), planToSave.id, planToSave.title);
    } catch {}

    setPlan(null);
    router.push("/workouts");
  }

  async function handleRegenerate(feedback: string) {
    setError("");

    const userId = await getUserId();
    if (!userId) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      const enhancedPrompt = `${prompt.trim()}

Feedback sobre o treino anterior: ${feedback}`;
      const generated = await generateWorkout(Number(userId), enhancedPrompt, modality || undefined);
      setPlan(generated);
    } catch (err: any) {
      setError(err.message || "Nao foi possivel gerar o treino agora.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 110 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.brand}>TreinAI</Text>
        <Text style={styles.greeting}>
          Ola{userName ? `, ${userName.split(" ")[0]}` : ""} :)
        </Text>
        <Text style={styles.subtitle}>Pronto para treinar hoje?</Text>

        <View ref={refGen} style={styles.genCard}>
          <View style={styles.genIconWrap}>
            <Ionicons name="sparkles" size={26} color={colors.bg} />
          </View>
          <Text style={styles.genTitle}>Gerar treino com IA</Text>
          <Text style={styles.genHint}>
            Descreva seu objetivo e a IA monta um plano completo para voce.
          </Text>

          <Alert type="error" message={error} />

          <TextInput
            value={prompt}
            onChangeText={setPrompt}
            editable={!loading}
            multiline
            placeholder={'Ex: "Quero emagrecer, treino em casa, 3x por semana"'}
            placeholderTextColor={colors.textDim}
            style={styles.promptInput}
            textAlignVertical="top"
          />

          <OptionSelect
            label="Modalidade"
            options={[
              { label: "Tanto faz", value: "" },
              { label: "Sem equipamento", value: "bodyweight" },
              { label: "Com equipamento", value: "equipment" },
            ]}
            value={modality}
            onChange={(v) => setModality(v as Modality | "")}
          />

          <Pressable
            disabled={loading}
            style={({ pressed }) => [
              styles.btnGreen,
              pressed && !loading && styles.btnGreenPressed,
              loading && styles.btnDisabled,
            ]}
            onPress={handleGenerate}
          >
            <Text style={styles.btnGreenText}>
              {loading ? "Gerando..." : "Gerar treino"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <WorkoutModal
        visible={!!plan}
        plan={plan || emptyPlan}
        onClose={() => setPlan(null)}
        onSaveToHistory={handleSave}
        onRegenerate={handleRegenerate}
      />

      <BottomNav
        tourRefs={{
          "nav-workouts": refWorkouts,
          "nav-profile": refProfile,
          "nav-help": refHelp,
        }}
      />
    </View>
  );
}

const emptyPlan: WorkoutPlan = {
  title: "Treino",
  description: "",
  main_goal: "",
  workout_type: "",
  training_level: "",
  days: [],
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  scroll: { flex: 1 },
  content: {
    padding: 20,
    paddingTop: 16,
    gap: 10,
    alignItems: "center",
    flexGrow: 1,
  },

  brand: {
    fontFamily: "Exo_900Black",
    fontSize: 24,
    letterSpacing: 2,
    color: colors.accent,
  },
  greeting: {
    fontSize: 19,
    fontWeight: "600",
    color: colors.text,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textDim,
    marginBottom: 8,
  },

  genCard: {
    width: "100%",
    maxWidth: 480,
    flexGrow: 1,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 10,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 360,
  },
  genIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 26,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  genTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    textAlign: "center",
  },
  genHint: {
    fontSize: 13,
    color: colors.textDim,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },

  promptInput: {
    width: "100%",
    minHeight: 84,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.surface2,
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
  },

  btnGreen: {
    width: "100%",
    backgroundColor: colors.accent,
    borderRadius: radius,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 4,
  },
  btnGreenPressed: {
    backgroundColor: colors.accentHover,
    transform: [{ translateY: -1 }],
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnGreenText: {
    color: colors.bg,
    fontSize: 14,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 6,
  },
  linkButtonPressed: {
    opacity: 0.75,
  },
  linkButtonText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
});
