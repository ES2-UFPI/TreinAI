import React from 'react'
import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'

import { colors, radius } from '../styles/theme'

export default function Button({ children, loading, variant = 'primary', style, ...props }) {
  const disabled = loading || props.disabled

  return (
    <Pressable
      {...props}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        variant === 'secondary' ? styles.secondary : styles.primary,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? colors.bg : colors.accent} />
      ) : (
        <Text style={[styles.text, variant === 'secondary' && styles.secondaryText]}>
          {children}
        </Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius,
    paddingHorizontal: 24,
    paddingVertical: 13,
    width: '100%',
  },
  primary: {
    backgroundColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 4,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderColor: colors.border,
    borderWidth: 1,
  },
  pressed: {
    backgroundColor: colors.accentHover,
    transform: [{ translateY: -1 }],
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  secondaryText: {
    color: colors.text,
  },
})
