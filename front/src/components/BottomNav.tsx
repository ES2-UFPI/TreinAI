import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { usePathname, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { colors, radius } from "@/styles/theme";

type IconName = keyof typeof Ionicons.glyphMap;

type NavKey = "dashboard" | "workouts" | "profile" | "help";

type NavItem = {
  key: NavKey;
  label: string;
  icon: IconName;
  href: "/" | "/workouts" | "/profile" | "/help";
  tourId?: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    icon: "home-outline",
    href: "/",
  },
  {
    key: "workouts",
    label: "Meus treinos",
    icon: "clipboard-outline",
    href: "/workouts",
    tourId: "nav-workouts",
  },
  {
    key: "profile",
    label: "Perfil",
    icon: "person-outline",
    href: "/profile",
    tourId: "nav-profile",
  },
  {
    key: "help",
    label: "Ajuda",
    icon: "help-circle-outline",
    href: "/help",
    tourId: "nav-help",
  },
];

type BottomNavProps = {
  tourRefs?: Partial<Record<string, React.RefObject<View | null>>>;
};

function isDashboardPath(pathname: string) {
  return pathname === "/" || pathname === "/index";
}

export default function BottomNav({ tourRefs }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bottomNav, { paddingBottom: insets.bottom + 8 }]}>
      {NAV_ITEMS.map((item) => {
        const active =
          item.key === "dashboard"
            ? isDashboardPath(pathname)
            : pathname === item.href;
        const ref = item.tourId ? tourRefs?.[item.tourId] : undefined;

        return (
          <View key={item.key} ref={ref} style={styles.navItemWrap}>
            <Pressable
              style={({ pressed }) => [
                styles.navItem,
                active && styles.navItemActive,
                pressed && styles.navItemPressed,
              ]}
              onPress={() => router.push(item.href)}
            >
              <Ionicons
                name={item.icon}
                size={21}
                color={active ? colors.accent : colors.text}
              />
              <Text
                style={[styles.navLabel, active && styles.navLabelActive]}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
    paddingHorizontal: 4,
  },
  navItemWrap: { flex: 1 },
  navItem: {
    alignItems: "center",
    gap: 3,
    paddingVertical: 6,
    borderRadius: radius,
  },
  navItemActive: {
    backgroundColor: colors.accentDim,
  },
  navItemPressed: {
    backgroundColor: colors.surface2,
  },
  navLabel: {
    fontSize: 10,
    color: colors.textDim,
    textAlign: "center",
  },
  navLabelActive: {
    color: colors.accent,
    fontWeight: "600",
  },
});
