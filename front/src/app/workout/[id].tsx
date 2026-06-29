import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.screen}>
      <Text style={styles.title}>Detalhe do treino</Text>
      <Text style={styles.subtitle}>Treino #{id}</Text>
      <Text style={styles.placeholder}>
        A exibição completa deste treino será implementada em breve.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f9f9f7",
    padding: 20,
    gap: 8,
  },
  title: { fontSize: 22, fontWeight: "600", color: "#111" },
  subtitle: { fontSize: 14, color: "#888" },
  placeholder: { fontSize: 13, color: "#666", marginTop: 8 },
});
