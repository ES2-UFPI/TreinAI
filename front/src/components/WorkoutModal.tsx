import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'

import WorkoutContent from '@/components/WorkoutContent'
import { colors, radius } from '@/styles/theme'
import type { WorkoutPlan } from '@/domain/workout'

export type { WorkoutPlan }

interface WorkoutModalProps {
  plan: WorkoutPlan
  visible: boolean
  onClose: () => void
  onSaveToHistory?: (plan: WorkoutPlan) => void
}

export default function WorkoutModal({ plan, visible, onClose, onSaveToHistory }: WorkoutModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Header plan={plan} onClose={onClose} />
            <WorkoutContent plan={plan} />
            <SaveButton onPress={() => onSaveToHistory?.(plan)} />
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

function Header({ plan, onClose }: { plan: WorkoutPlan; onClose: () => void }) {
  return (
    <View style={styles.header}>
      <View style={styles.headerText}>
        <Text style={styles.title}>{plan.title}</Text>
        {!!plan.description && (
          <Text style={styles.description}>{plan.description}</Text>
        )}
      </View>
      <Pressable style={styles.closeBtn} onPress={onClose} hitSlop={12}>
        <Text style={styles.closeBtnText}>✕</Text>
      </Pressable>
    </View>
  )
}

function SaveButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable style={({ pressed }) => [styles.saveBtn, pressed && styles.saveBtnPressed]} onPress={onPress}>
      <Text style={styles.saveBtnText}>Salvar treino</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxWidth: 672,
    maxHeight: '90%',
    backgroundColor: '#121212',
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 8,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  description: {
    color: colors.textDim,
    fontSize: 14,
    lineHeight: 22,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    color: colors.textDim,
    fontSize: 13,
    lineHeight: 14,
  },

  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveBtnPressed: {
    backgroundColor: colors.accentHover,
    transform: [{ translateY: -1 }],
  },
  saveBtnText: {
    color: colors.bg,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
})