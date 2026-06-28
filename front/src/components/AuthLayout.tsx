import React from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import { colors } from '@/styles/theme'

export default function AuthLayout({ title, subtitle, children }: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.wrapper}
    >
      <ScrollView
        contentContainerStyle={styles.panel}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.deco}>
          <Text style={styles.decoText}>TreinAI</Text>
          <Text style={styles.decoTagline}>Treinar ficou mais fácil do que nunca.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.logo}></Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <View style={styles.children}>{children}</View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  panel: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  deco: {
    alignItems: 'center',
    marginBottom: 28,
    paddingVertical: 10,
  },
  decoText: {
    fontFamily: 'Exo_900Black',
    fontSize: 35,
    lineHeight: 36,
    color: colors.accent,
    letterSpacing: 2,
    textAlign: 'center',
  },
  decoTagline: {
    marginTop: 20,
    fontSize: 15,
    color: 'rgba(200,241,53,0.6)',
    fontWeight: '300',
    lineHeight: 24,
    textAlign: 'center',
  },
  card: {
    width: '100%',
  },
  logo: {
    fontSize: 28,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Exo_900Black',
    fontSize: 20,
    letterSpacing: 1,
    color: colors.text,
    fontWeight: '900',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    color: colors.textDim,
    fontSize: 14,
    marginBottom: 32,
    lineHeight: 21,
    textAlign: 'center',
  },
  children: {
    gap: 16,
  },
})
