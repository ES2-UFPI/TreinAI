/**
 * FeatureTour — motor do tour de funcionalidades
 *
 * Funciona 100% com componentes nativos do React Native + Expo.
 * Sem dependências externas.
 * */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

// ─── Tipos ───────────────────────────────────────────────────────────────────

export interface TourStep {
  /** Deve bater com o id passado em useTourRef() */
  id: string;
  title: string;
  description: string;
  /** Onde o popover aparece em relação ao elemento. Padrão: 'bottom' */
  placement?: "top" | "bottom" | "left" | "right";
}

interface ElementRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TourContextValue {
  registerRef: (id: string, ref: React.RefObject<View | null>) => void;
  startTour: () => void;
  isRunning: boolean;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const TourContext = createContext<TourContextValue | null>(null);

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour deve ser usado dentro de <TourProvider>");
  return ctx;
}

/**
 * Hook que cria uma ref e a registra no tour automaticamente.
 *
 * @example
 * const ref = useTourRef('gen-workout');
 * <View ref={ref}>...</View>
 */
export function useTourRef(id: string) {
  const { registerRef } = useTour();
  const ref = useRef<View>(null);
  // Registra na primeira renderização apenas
  useEffect(() => {
    registerRef(id, ref);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// ─── Provider ────────────────────────────────────────────────────────────────

interface TourProviderProps {
  steps: TourStep[];
  children: React.ReactNode;
  /** Chamado quando o tour termina ou é pulado */
  onFinish?: () => void;
}

export function TourProvider({ steps, children, onFinish }: TourProviderProps) {
  const refs = useRef<Map<string, React.RefObject<View | null>>>(new Map());
  const [running, setRunning] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rect, setRect] = useState<ElementRect | null>(null);

  const fadeAnim = useMemo(() => new Animated.Value(0), []);
  const popoverAnim = useMemo(() => new Animated.Value(0), []);

  const registerRef = useCallback(
    (id: string, ref: React.RefObject<View | null>) => {
      refs.current.set(id, ref);
    },
    []
  );

  const measureStep = useCallback((index: number) => {
    const step = steps[index];
    const ref = refs.current.get(step.id);
    if (!ref?.current) return;

    // measureInWindow usa coordenadas da viewport — necessário para o Modal
    // (no web, measure/pageX/pageY pode divergir do zoom e do posicionamento fixo)
    ref.current.measureInWindow((pageX, pageY, width, height) => {
      setRect({ x: pageX, y: pageY, width, height });
    });
  }, [steps]);

  const animateIn = useCallback(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.spring(popoverAnim, {
        toValue: 1,
        tension: 120,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, popoverAnim]);

  const animateOut = useCallback((cb: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.timing(popoverAnim, {
        toValue: 0,
        duration: 180,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(cb);
  }, [fadeAnim, popoverAnim]);

  const startTour = useCallback(() => {
    setCurrentIndex(0);
    setRunning(true);
  }, []);

  // Mede o elemento quando o tour inicia ou o índice muda
  useEffect(() => {
    if (!running) return;
    // Pequeno delay para garantir que o layout já renderizou
    const t = setTimeout(() => {
      measureStep(currentIndex);
      popoverAnim.setValue(0);
      animateIn();
    }, 80);
    return () => clearTimeout(t);
  }, [running, currentIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-mede ao redimensionar a janela (zoom do navegador, rotação, etc.)
  useEffect(() => {
    if (!running) return;
    const sub = Dimensions.addEventListener("change", () => {
      measureStep(currentIndex);
    });
    return () => sub.remove();
  }, [running, currentIndex, measureStep]);

  const goNext = useCallback(() => {
    animateOut(() => {
      if (currentIndex < steps.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setRunning(false);
        setRect(null);
        onFinish?.();
      }
    });
  }, [animateOut, currentIndex, steps.length, onFinish]);

  const goPrev = useCallback(() => {
    if (currentIndex === 0) return;
    animateOut(() => setCurrentIndex((i) => i - 1));
  }, [animateOut, currentIndex]);

  const skip = useCallback(() => {
    animateOut(() => {
      setRunning(false);
      setRect(null);
      onFinish?.();
    });
  }, [animateOut, onFinish]);

  return (
    <TourContext.Provider value={{ registerRef, startTour, isRunning: running }}>
      {children}
      {running && rect && (
        <TourOverlay
          step={steps[currentIndex]}
          stepIndex={currentIndex}
          totalSteps={steps.length}
          rect={rect}
          fadeAnim={fadeAnim}
          popoverAnim={popoverAnim}
          onNext={goNext}
          onPrev={goPrev}
          onSkip={skip}
        />
      )}
    </TourContext.Provider>
  );
}

// ─── Overlay ─────────────────────────────────────────────────────────────────

const SPOTLIGHT_PAD = 8;
const POPOVER_WIDTH = 280;
const POPOVER_EST_HEIGHT = 260;
const POPOVER_GAP = 12;
const SCREEN_MARGIN = 16;

interface OverlayProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  rect: ElementRect;
  fadeAnim: Animated.Value;
  popoverAnim: Animated.Value;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
}

function TourOverlay({
  step,
  stepIndex,
  totalSteps,
  rect,
  fadeAnim,
  popoverAnim,
  onNext,
  onPrev,
  onSkip,
}: OverlayProps) {
  const [windowSize, setWindowSize] = useState(() => Dimensions.get("window"));

  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setWindowSize(window);
    });
    return () => sub.remove();
  }, []);

  const { width: SW, height: SH } = windowSize;
  const isLast = stepIndex === totalSteps - 1;
  const isFirst = stepIndex === 0;

  // Spotlight coords
  const slX = rect.x - SPOTLIGHT_PAD;
  const slY = rect.y - SPOTLIGHT_PAD;
  const slW = rect.width + SPOTLIGHT_PAD * 2;
  const slH = rect.height + SPOTLIGHT_PAD * 2;

  // Popover position (inverte o lado se não couber na viewport)
  const placement = resolvePlacement(
    step.placement ?? inferPlacement(rect, SH),
    rect,
    SW,
    SH,
    POPOVER_WIDTH,
    POPOVER_EST_HEIGHT,
    POPOVER_GAP,
    SPOTLIGHT_PAD
  );
  const popoverStyle = computePopoverPosition(
    placement,
    rect,
    SW,
    SH,
    POPOVER_WIDTH,
    POPOVER_EST_HEIGHT,
    POPOVER_GAP,
    SPOTLIGHT_PAD
  );

  const popoverScale = popoverAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  return (
    <Modal transparent visible animationType="none" statusBarTranslucent>
      {/* Overlay escuro com buraco no elemento */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        {/* Topo */}
        <View
          style={[styles.darkRect, { top: 0, left: 0, right: 0, height: slY }]}
        />
        {/* Esquerda */}
        <View
          style={[
            styles.darkRect,
            { top: slY, left: 0, width: slX, height: slH },
          ]}
        />
        {/* Direita */}
        <View
          style={[
            styles.darkRect,
            {
              top: slY,
              left: slX + slW,
              right: 0,
              height: slH,
            },
          ]}
        />
        {/* Base */}
        <View
          style={[
            styles.darkRect,
            { top: slY + slH, left: 0, right: 0, bottom: 0 },
          ]}
        />
      </Animated.View>

      {/* Borda de destaque no elemento */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.spotlight,
          { top: slY, left: slX, width: slW, height: slH },
          { opacity: fadeAnim },
        ]}
      />

      {/* Popover */}
      <Animated.View
        style={[
          styles.popover,
          popoverStyle,
          { maxHeight: SH - SCREEN_MARGIN * 2 },
          {
            opacity: fadeAnim,
            transform: [{ scale: popoverScale }],
          },
        ]}
      >
        {/* Cabeçalho */}
        <View style={styles.popoverHeader}>
          <Text style={styles.stepLabel}>
            {stepIndex + 1} / {totalSteps}
          </Text>
          <Pressable onPress={onSkip} hitSlop={8} accessibilityLabel="Pular tour">
            <Text style={styles.skipText}>Pular</Text>
          </Pressable>
        </View>

        <Text style={styles.popoverTitle}>{step.title}</Text>
        <Text style={styles.popoverBody}>{step.description}</Text>

        {/* Dots */}
        <View style={styles.dots}>
          {Array.from({ length: totalSteps }).map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === stepIndex && styles.dotActive]}
            />
          ))}
        </View>

        {/* Navegação */}
        <View style={styles.navRow}>
          {!isFirst ? (
            <Pressable onPress={onPrev} style={styles.btnSecondary}>
              <Text style={styles.btnSecondaryText}>← Anterior</Text>
            </Pressable>
          ) : (
            <View />
          )}
          <Pressable
            onPress={onNext}
            style={styles.btnPrimary}
            accessibilityRole="button"
          >
            <Text style={styles.btnPrimaryText}>
              {isLast ? "Começar 💪" : "Próximo →"}
            </Text>
          </Pressable>
        </View>
      </Animated.View>
    </Modal>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

type Placement = NonNullable<TourStep["placement"]>;

function inferPlacement(rect: ElementRect, screenHeight: number): Placement {
  return rect.y + rect.height / 2 < screenHeight / 2 ? "bottom" : "top";
}

function placementFits(
  placement: Placement,
  rect: ElementRect,
  sw: number,
  sh: number,
  popoverWidth: number,
  popoverHeight: number,
  gap: number,
  pad: number
): boolean {
  const h = rect.height + pad * 2;
  const slY = rect.y - pad;

  switch (placement) {
    case "top":
      return slY >= popoverHeight + gap + SCREEN_MARGIN;
    case "bottom":
      return sh - (slY + h) >= popoverHeight + gap + SCREEN_MARGIN;
    case "left":
      return rect.x >= popoverWidth + gap + SCREEN_MARGIN;
    case "right":
      return sw - (rect.x + rect.width) >= popoverWidth + gap + SCREEN_MARGIN;
  }
}

function resolvePlacement(
  preferred: Placement,
  rect: ElementRect,
  sw: number,
  sh: number,
  popoverWidth: number,
  popoverHeight: number,
  gap: number,
  pad: number
): Placement {
  if (placementFits(preferred, rect, sw, sh, popoverWidth, popoverHeight, gap, pad)) {
    return preferred;
  }

  const opposites: Record<Placement, Placement> = {
    top: "bottom",
    bottom: "top",
    left: "right",
    right: "left",
  };
  const opposite = opposites[preferred];
  if (placementFits(opposite, rect, sw, sh, popoverWidth, popoverHeight, gap, pad)) {
    return opposite;
  }

  const candidates: Placement[] = ["bottom", "top", "right", "left"];
  const best = candidates.reduce<{ placement: Placement; space: number }>(
    (acc, candidate) => {
      const h = rect.height + pad * 2;
      const slY = rect.y - pad;
      const space =
        candidate === "top"
          ? slY
          : candidate === "bottom"
            ? sh - (slY + h)
            : candidate === "left"
              ? rect.x
              : sw - (rect.x + rect.width);
      return space > acc.space ? { placement: candidate, space } : acc;
    },
    { placement: preferred, space: -1 }
  );

  return best.placement;
}

function computePopoverPosition(
  placement: Placement,
  rect: ElementRect,
  sw: number,
  sh: number,
  popoverWidth: number,
  popoverHeight: number,
  gap: number,
  pad: number
): object {
  const h = rect.height + pad * 2;
  const slY = rect.y - pad;

  let left = rect.x + rect.width / 2 - popoverWidth / 2;
  left = Math.max(SCREEN_MARGIN, Math.min(left, sw - popoverWidth - SCREEN_MARGIN));

  switch (placement) {
    case "top": {
      let bottom = sh - slY + gap;
      bottom = Math.max(
        SCREEN_MARGIN,
        Math.min(bottom, sh - popoverHeight - SCREEN_MARGIN)
      );
      return {
        position: "absolute" as const,
        bottom,
        left,
        width: popoverWidth,
      };
    }
    case "left": {
      let top = rect.y + rect.height / 2 - popoverHeight / 2;
      top = Math.max(
        SCREEN_MARGIN,
        Math.min(top, sh - popoverHeight - SCREEN_MARGIN)
      );
      return {
        position: "absolute" as const,
        top,
        right: sw - rect.x + gap,
        width: popoverWidth,
      };
    }
    case "right": {
      let top = rect.y + rect.height / 2 - popoverHeight / 2;
      top = Math.max(
        SCREEN_MARGIN,
        Math.min(top, sh - popoverHeight - SCREEN_MARGIN)
      );
      return {
        position: "absolute" as const,
        top,
        left: rect.x + rect.width + gap,
        width: popoverWidth,
      };
    }
    case "bottom":
    default: {
      let top = slY + h + gap;
      top = Math.max(
        SCREEN_MARGIN,
        Math.min(top, sh - popoverHeight - SCREEN_MARGIN)
      );
      return {
        position: "absolute" as const,
        top,
        left,
        width: popoverWidth,
      };
    }
  }
}

// ─── Estilos ─────────────────────────────────────────────────────────────────

const GREEN = "#1D9E75";

const styles = StyleSheet.create({
  darkRect: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,0.58)",
  },
  spotlight: {
    position: "absolute",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: GREEN,
  },
  popover: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 18,
    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    // Sombra Android
    elevation: 10,
  },
  popoverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: GREEN,
    letterSpacing: 0.4,
  },
  skipText: {
    fontSize: 12,
    color: "#999",
  },
  popoverTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },
  popoverBody: {
    fontSize: 13,
    color: "#555",
    lineHeight: 19,
  },
  dots: {
    flexDirection: "row",
    gap: 5,
    marginTop: 14,
    marginBottom: 12,
    justifyContent: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#ddd",
  },
  dotActive: {
    backgroundColor: GREEN,
    width: 14,
  },
  navRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  btnPrimary: {
    backgroundColor: GREEN,
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  btnSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  btnSecondaryText: {
    color: "#777",
    fontSize: 13,
  },
});
