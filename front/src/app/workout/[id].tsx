import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import BottomNav from "@/components/BottomNav";
import WorkoutContent from "@/components/WorkoutContent";
import { buscarDetalheTreino } from "@/services/api";
import { colors, radius } from "@/styles/theme";
import type { WorkoutPlan } from "@/domain/workout";

export default function WorkoutDetailScreen() {
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [plano, setPlano] = useState<WorkoutPlan | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    let ativo = true;

    (async () => {
      try {
        const dados = await buscarDetalheTreino(Number(id));
        if (ativo) {
          setPlano(dados);
          setErro(null);
        }
      } catch (e) {
        if (ativo) {
          setErro(e instanceof Error ? e.message : "Treino nao encontrado");
        }
      } finally {
        if (ativo) setCarregando(false);
      }
    })();

    return () => {
      ativo = false;
    };
  }, [id]);

  if (carregando) {
    return (
      <View style={styles.screen}>
        <View style={[styles.center, { paddingTop: insets.top }] }>
          <ActivityIndicator testID="loading" size="large" color={colors.accent} />
          <Text style={styles.loadingText}>Carregando treino...</Text>
        </View>
        <BottomNav />
      </View>
    );
  }

  if (erro || !plano) {
    return (
      <View style={styles.screen}>
        <View style={[styles.center, { paddingTop: insets.top }] }>
          <View style={styles.errorCard}>
            <Ionicons name="alert-circle-outline" size={34} color={colors.error} />
            <Text style={styles.errorTitle}>Nao foi possivel abrir este treino</Text>
            <Text style={styles.errorText}>{erro ?? "Treino nao encontrado"}</Text>
            {!!title && <Text style={styles.fallbackTitle}>{title}</Text>}
            <Pressable style={styles.primaryButton} onPress={() => router.push("/workouts")}>
              <Ionicons name="clipboard-outline" size={17} color={colors.bg} />
              <Text style={styles.primaryText}>Voltar para meus treinos</Text>
            </Pressable>
          </View>
        </View>
        <BottomNav />
      </View>
    );
  }

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
        <Pressable style={styles.backButton} onPress={() => router.push("/workouts")}>
          <Ionicons name="arrow-back" size={18} color={colors.accent} />
          <Text style={styles.backText}>Voltar para meus treinos</Text>
        </Pressable>

        <Text style={styles.brand}>TreinAI</Text>

        <View style={styles.headerCard}>
          <View style={styles.iconWrap}>
            <Ionicons name="barbell-outline" size={28} color={colors.bg} />
          </View>
          <Text style={styles.title}>{plano.title}</Text>
          {!!plano.description && <Text style={styles.description}>{plano.description}</Text>}
        </View>

        <View style={styles.contentCard}>
          <WorkoutContent plan={plano} showLoadGuideButton />
        </View>
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
    gap: 16,
    alignItems: "center",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    paddingBottom: 110,
    gap: 12,
  },
  loadingText: {
    color: colors.textDim,
    fontSize: 13,
  },
  backButton: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  backText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  brand: {
    fontFamily: "Exo_900Black",
    fontSize: 24,
    letterSpacing: 2,
    color: colors.accent,
  },
  headerCard: {
    width: "100%",
    maxWidth: 620,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    gap: 12,
    alignItems: "center",
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
    textAlign: "center",
  },
  description: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  contentCard: {
    width: "100%",
    maxWidth: 620,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 18,
    gap: 18,
  },
  errorCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    gap: 12,
    alignItems: "center",
  },
  errorTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  errorText: {
    color: colors.textDim,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  fallbackTitle: {
    color: colors.text,
    fontSize: 14,
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    minHeight: 48,
    borderRadius: radius,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  primaryText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
});
