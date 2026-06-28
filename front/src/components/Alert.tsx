import React from 'react'
import { StyleSheet, Text } from 'react-native'

import { colors, radius } from '@/styles/theme'

export default function Alert({ type = 'error', message }: { type?: 'error' | 'success'; message?: string }) {
  if (!message) return null

  return (
    <Text style={[styles.alert, type === 'success' ? styles.success : styles.error]}>
      {message}
    </Text>
  )
}

const styles = StyleSheet.create({
  alert: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radius,
    borderWidth: 1,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },
  error: {
    backgroundColor: 'rgba(255,77,77,0.1)',
    borderColor: 'rgba(255,77,77,0.3)',
    color: '#ff7a7a',
  },
  success: {
    backgroundColor: 'rgba(77,255,145,0.1)',
    borderColor: 'rgba(77,255,145,0.3)',
    color: colors.success,
  },
})
