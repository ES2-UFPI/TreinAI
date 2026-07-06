import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BottomNav from "@/components/BottomNav";
import { colors, radius } from "@/styles/theme";

export default function LoadGuideScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar para o treino"
          style={styles.backLink}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={colors.accent} />
        </Pressable>

        <Text style={styles.brand}>TreinAI</Text>

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Ionicons name="barbell-outline" size={28} color={colors.bg} />
          </View>

          <Text style={styles.title}>Como escolher a carga certa?</Text>
          <Text style={styles.intro}>
            Uma estrategia pratica e usar uma faixa de repeticoes.
          </Text>

          <View style={styles.exampleBox}>
            <Text style={styles.sectionTitle}>Exemplo</Text>

            <GuideItem text="Meta: 8-12 repeticoes." boldStart />
            <GuideItem text="Escolha um peso com o qual voce consiga realizar pelo menos 8 repeticoes." />
            <GuideItem text="Quando conseguir completar 12 repeticoes em todas as series, mantendo uma boa tecnica, aumente a carga na proxima sessao de treino e volte a realizar aproximadamente 8-10 repeticoes." />
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={18} color={colors.bg} />
            <Text style={styles.primaryText}>Voltar</Text>
          </Pressable>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  );
}

function GuideItem({ text, boldStart = false }: { text: string; boldStart?: boolean }) {
  if (!boldStart) {
    return (
      <View style={styles.item}>
        <View style={styles.bullet} />
        <Text style={styles.itemText}>{text}</Text>
      </View>
    );
  }

  const [label, rest] = text.split(": ");

  return (
    <View style={styles.item}>
      <View style={styles.bullet} />
      <Text style={styles.itemText}>
        <Text style={styles.bold}>{label}:</Text> {rest}
      </Text>
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
  backLink: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
  },
  brand: {
    fontFamily: "Exo_900Black",
    fontSize: 24,
    letterSpacing: 2,
    color: colors.accent,
  },
  card: {
    width: "100%",
    maxWidth: 620,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 22,
    gap: 16,
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
    lineHeight: 31,
    textAlign: "center",
  },
  intro: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  exampleBox: {
    width: "100%",
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius + 4,
    padding: 16,
    gap: 13,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  item: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
    marginTop: 8,
  },
  itemText: {
    flex: 1,
    color: colors.text,
    fontSize: 14,
    lineHeight: 21,
  },
  bold: {
    color: colors.text,
    fontWeight: "800",
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
  },
  primaryButtonPressed: {
    backgroundColor: colors.accentHover,
    transform: [{ translateY: -1 }],
  },
  primaryText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0.7,
    textTransform: "uppercase",
  },
});
