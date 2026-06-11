import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors, radius } from '../styles/theme'

export default function OptionSelect({ label, options, value, onChange }) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const selected = value === option.value
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, selected && styles.selected]}
            >
              <Text style={[styles.optionText, selected && styles.selectedText]}>
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
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
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    borderColor: colors.border,
    borderRadius: radius,
    borderWidth: 1,
    backgroundColor: colors.surface2,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  selected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  },
  optionText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
  selectedText: {
    color: colors.bg,
  },
})
