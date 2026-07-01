import React, { useEffect, useState } from "react";

import {

  Pressable,

  ScrollView,

  StyleSheet,

  Text,

  View,

} from "react-native";

import { useLocalSearchParams, useRouter } from "expo-router";

import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Ionicons } from "@expo/vector-icons";



import BottomNav from "@/components/BottomNav";

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

import { getUserName } from "@/services/session";

import { colors, radius } from "@/styles/theme";



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

          Olá{userName ? `, ${userName.split(" ")[0]}` : ""} :)

        </Text>

        <Text style={styles.subtitle}>Pronto para treinar hoje?</Text>



        <View ref={refGen} style={styles.genCard}>

          <View style={styles.genIconWrap}>

            <Ionicons name="sparkles" size={26} color={colors.bg} />

          </View>

          <Text style={styles.genTitle}>Gerar treino com IA</Text>

          <Text style={styles.genHint}>

            Descreva seu objetivo e a IA monta um plano completo para você.

          </Text>



          <View style={styles.inputMock}>

            <Text style={styles.inputText} numberOfLines={3}>

              Ex: &quot;Quero emagrecer, treino em casa, 3x por semana&quot;

            </Text>

          </View>



          <Pressable

            style={({ pressed }) => [

              styles.btnGreen,

              pressed && styles.btnGreenPressed,

            ]}

          >

            <Text style={styles.btnGreenText}>Gerar treino</Text>

          </Pressable>

        </View>

      </ScrollView>



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



const styles = StyleSheet.create({

  screen: { flex: 1, backgroundColor: colors.bg },

  scroll: { flex: 1 },

  content: {

    padding: 20,

    paddingTop: 28,

    gap: 16,

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

    marginTop: 8,

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

    paddingVertical: 36,

    paddingHorizontal: 28,

    gap: 16,

    borderWidth: 1,

    borderColor: colors.border,

    minHeight: 340,

  },

  genIconWrap: {

    width: 52,

    height: 52,

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

    lineHeight: 19,

    paddingHorizontal: 8,

  },



  inputMock: {

    width: "100%",

    minHeight: 72,

    borderWidth: 1,

    borderColor: colors.border,

    borderRadius: radius,

    paddingVertical: 16,

    paddingHorizontal: 16,

    backgroundColor: colors.surface2,

    justifyContent: "center",

  },

  inputText: {

    fontSize: 14,

    color: colors.textDim,

    textAlign: "center",

    lineHeight: 20,

  },



  btnGreen: {

    width: "100%",

    backgroundColor: colors.accent,

    borderRadius: radius,

    paddingVertical: 16,

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

  btnGreenText: {

    color: colors.bg,

    fontSize: 14,

    fontWeight: "700",

    textTransform: "uppercase",

    letterSpacing: 0.8,

  },

});


