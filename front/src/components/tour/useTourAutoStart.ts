/**
 * useTourAutoStart
 *
 * Controla se o tour deve abrir automaticamente na primeira visita.
 * Usa AsyncStorage para persistir o estado entre sessões.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useRef } from "react";
import { useTour } from "./FeatureTour";

const TOUR_KEY = "treinai_tour_seen_v1";

/**
 * Dispara o tour automaticamente uma única vez.
 *
 * @param delayMs  Tempo em ms antes de abrir o tour (padrão: 600ms,
 *                 para esperar o dashboard terminar de renderizar)
 */
export function useTourAutoStart(delayMs = 600) {
  const { startTour } = useTour();
  const didCheck = useRef(false);

  useEffect(() => {
    if (didCheck.current) return;
    didCheck.current = true;

    AsyncStorage.getItem(TOUR_KEY).then((seen) => {
      if (!seen) {
        const t = setTimeout(() => startTour(), delayMs);
        return () => clearTimeout(t);
      }
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}

/**
 * Marca o tour como visto.
 */
export async function markTourSeen() {
  await AsyncStorage.setItem(TOUR_KEY, "1");
}

/**
 * Reseta o estado — útil para "Ver tour novamente" nas configurações.
 */
export async function resetTourSeen() {
  await AsyncStorage.removeItem(TOUR_KEY);
}
