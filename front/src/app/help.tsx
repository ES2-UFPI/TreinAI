import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import BottomNav from "@/components/BottomNav";
import { resetTourSeen } from "@/components/tour/useTourAutoStart";
import { colors, radius } from "@/styles/theme";

const TIPS = [
  {
    title: "Gerar treino com IA",
    body: 'Na tela inicial, descreva seu objetivo em linguagem simples — por exemplo: "emagrecer treinando em casa 3x por semana".',
  },
  {
    title: "Meus treinos",
    body: "Todos os treinos gerados ficam salvos em Meus treinos. Abra qualquer um para ver exercícios, séries e descanso.",
  },
  {
    title: "Perfil",
    body: "Mantenha idade, peso, altura, objetivo e nível atualizados para a IA montar planos mais precisos.",
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  async function handleRestartTour() {
    await resetTourSeen();
    router.push({ pathname: "/", params: { startTour: "1" } });
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
        <Text style={styles.brand}>TreinAI</Text>
        <Text style={styles.title}>Ajuda</Text>
        <Text style={styles.subtitle}>
          Dicas rápidas para aproveitar melhor o app.
        </Text>

        {TIPS.map((tip) => (
          <View key={tip.title} style={styles.tipCard}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipBody}>{tip.body}</Text>
          </View>
        ))}

        <View style={styles.tourSection}>
          <Text style={styles.tourSectionTitle}>Tour de funcionalidades</Text>
          <Text style={styles.tourSectionBody}>
            Quer rever os destaques da tela inicial e dos menus? Refaça o tour
            guiado a qualquer momento.
          </Text>
          <Pressable
            style={({ pressed }) => [
              styles.btnOutline,
              pressed && styles.btnOutlinePressed,
            ]}
            onPress={handleRestartTour}
          >
            <Ionicons name="play-circle-outline" size={16} color={colors.accent} />
            <Text style={styles.btnOutlineText}>Ver tour novamente</Text>
          </Pressable>
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
  tipCard: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 6,
  },
  tipTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text,
  },
  tipBody: {
    fontSize: 13,
    color: colors.textDim,
    lineHeight: 19,
  },
  tourSection: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
    gap: 10,
    marginTop: 4,
  },
  tourSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
  },
  tourSectionBody: {
    fontSize: 13,
    color: colors.textDim,
    lineHeight: 19,
  },
  btnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  btnOutlinePressed: {
    backgroundColor: colors.accentDim,
  },
  btnOutlineText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.accent,
  },
});
