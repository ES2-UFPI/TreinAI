import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View } from 'react-native'

import { colors, radius } from '../styles/theme'

export default function Input({ label, error, style, ...props }) {
  const [focused, setFocused] = useState(false)

  return (
    <View style={[styles.group, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        {...props}
        placeholderTextColor={colors.textDim}
        onBlur={(event) => {
          setFocused(false)
          props.onBlur?.(event)
        }}
        onFocus={(event) => {
          setFocused(true)
          props.onFocus?.(event)
        }}
        style={[styles.input, focused && styles.focused, error && styles.inputError]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  group: {
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    color: colors.textDim,
  },
  input: {
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    color: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: radius,
    fontSize: 14,
    minHeight: 48,
  },
  focused: {
    borderColor: colors.accent,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  inputError: {
    borderColor: colors.error,
  },
  error: {
    fontSize: 12,
    color: colors.error,
  },
})
