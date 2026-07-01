import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import WorkoutContent from "@/components/WorkoutContent";
import { buscarDetalheTreino } from "@/services/api";
import { colors } from "@/styles/theme";
import type { WorkoutPlan } from "@/domain/workout";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
          setErro(e instanceof Error ? e.message : "Treino não encontrado");
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
      <View style={[styles.tela, styles.centro]}>
        <ActivityIndicator testID="loading" size="large" color={colors.accent} />
      </View>
    );
  }

  if (erro || !plano) {
    return (
      <View style={[styles.tela, styles.centro]}>
        <Text style={styles.erro}>{erro ?? "Treino não encontrado"}</Text>
        <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.conteudo,
        { paddingBottom: 40 + insets.bottom },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color={colors.accent} />
          <Text style={styles.backText}>Histórico</Text>
        </Pressable>
      </View>

      <View style={styles.cabecalho}>
        <Text style={styles.titulo}>{plano.title}</Text>
        {!!plano.description && (
          <Text style={styles.descricao}>{plano.description}</Text>
        )}
      </View>

      <WorkoutContent plan={plano} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  centro: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  conteudo: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 12,
    paddingHorizontal: 20,
    marginHorizontal: -20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  backText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  cabecalho: {
    gap: 8,
  },
  titulo: {
    color: colors.text,
    fontSize: 26,
    fontWeight: "700",
  },
  descricao: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 22,
  },
  erro: {
    color: colors.error,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 16,
  },
  botaoVoltar: {
    backgroundColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  botaoVoltarTexto: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
});