import { useEffect, useRef, useState } from 'react'
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
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
  onRegenerate?: (feedback: string) => void
}

export default function WorkoutModal({ plan, visible, onClose, onSaveToHistory, onRegenerate }: WorkoutModalProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const planRef = useRef(plan)

  useEffect(() => {
    if (planRef.current !== plan) {
      setLoading(false)
      setShowFeedback(false)
      setFeedback('')
      planRef.current = plan
    }
  }, [plan])

  function handleClose() {
    if (loading) return
    setShowFeedback(false)
    setFeedback('')
    setLoading(false)
    onClose()
  }

  function handleSave() {
    onSaveToHistory?.(plan)
    setShowFeedback(false)
    setFeedback('')
    setLoading(false)
  }

  function handleRegenerate() {
    if (!feedback.trim() || loading) return
    setLoading(true)
    onRegenerate?.(feedback.trim())
  }

  return (
    <Modal transparent visible={visible} animationType="fade" onRequestClose={handleClose}>
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <Pressable style={styles.container} onPress={() => {}}>
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Header plan={plan} onClose={handleClose} />
            <WorkoutContent plan={plan} />
            
            {showFeedback ? (
              <FeedbackSection
                feedback={feedback}
                onFeedbackChange={setFeedback}
                onBack={() => setShowFeedback(false)}
                onRegenerate={handleRegenerate}
                regenerating={loading}
              />
            ) : (
              <ActionButtons onSave={handleSave} onModify={() => setShowFeedback(true)} disabled={loading} />
            )}
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

function ActionButtons({ onSave, onModify, disabled }: { onSave: () => void; onModify: () => void; disabled?: boolean }) {
  return (
    <View style={styles.buttonRow}>
      <Pressable
        style={({ pressed }) => [
          styles.modifyBtn,
          pressed && styles.modifyBtnPressed,
          disabled && styles.btnDisabled,
        ]}
        onPress={onModify}
        disabled={disabled}
      >
        <Text style={styles.modifyBtnText} numberOfLines={1}>Modificar treino</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.saveBtn,
          pressed && styles.saveBtnPressed,
        ]}
        onPress={onSave}
      >
        <Text style={styles.saveBtnText} numberOfLines={1}>Salvar treino</Text>
      </Pressable>
    </View>
  )
}

function FeedbackSection({
  feedback,
  onFeedbackChange,
  onBack,
  onRegenerate,
  regenerating,
}: {
  feedback: string
  onFeedbackChange: (v: string) => void
  onBack: () => void
  onRegenerate: () => void
  regenerating: boolean
}) {
  return (
    <View style={styles.feedbackSection}>
      <Text style={styles.feedbackTitle}>O que voce gostaria de mudar?</Text>
      <Text style={styles.feedbackHint}>
        Descreva o que nao ficou bom e a IA vai gerar um novo treino levando em conta seu feedback.
      </Text>

      <TextInput
        value={feedback}
        onChangeText={onFeedbackChange}
        placeholder="Ex: Quero menos exercicios de perna, mais foco em bracos..."
        placeholderTextColor={colors.textDim}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        style={styles.feedbackInput}
        editable={!regenerating}
      />

      {regenerating ? (
        <View style={styles.regeneratingBox}>
          <ActivityIndicator color={colors.accent} size="small" />
          <Text style={styles.regeneratingText}>Gerando novo treino...</Text>
        </View>
      ) : (
        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.backBtn,
              pressed && styles.backBtnPressed,
            ]}
            onPress={onBack}
          >
            <Text style={styles.backBtnText} numberOfLines={1}>Voltar</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.regenerateBtn,
              pressed && styles.regenerateBtnPressed,
              !feedback.trim() && styles.regenerateBtnDisabled,
            ]}
            onPress={onRegenerate}
            disabled={!feedback.trim()}
          >
            <Text style={styles.regenerateBtnText} numberOfLines={1}>Gerar novo treino</Text>
          </Pressable>
        </View>
      )}
    </View>
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

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },

  modifyBtn: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modifyBtnPressed: {
    backgroundColor: colors.surface,
  },
  modifyBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  saveBtn: {
    flex: 1,
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
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  feedbackSection: {
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 20,
  },
  feedbackTitle: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
  },
  feedbackHint: {
    color: colors.textDim,
    fontSize: 12,
    lineHeight: 16,
  },
  feedbackInput: {
    width: '100%',
    minHeight: 88,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.surface2,
    color: colors.text,
    fontSize: 13,
    lineHeight: 18,
  },

  backBtn: {
    flex: 1,
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius,
    paddingVertical: 14,
    alignItems: 'center',
  },
  backBtnPressed: {
    backgroundColor: colors.surface,
  },
  backBtnText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  regenerateBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radius,
    paddingVertical: 14,
    alignItems: 'center',
  },
  regenerateBtnPressed: {
    backgroundColor: colors.accentHover,
    transform: [{ translateY: -1 }],
  },
  regenerateBtnDisabled: {
    opacity: 0.4,
  },
  regenerateBtnText: {
    color: colors.bg,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },

  btnDisabled: {
    opacity: 0.4,
  },
  regeneratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    backgroundColor: colors.surface2,
    borderRadius: radius,
    borderWidth: 1,
    borderColor: colors.border,
  },
  regeneratingText: {
    color: colors.textDim,
    fontSize: 13,
    fontWeight: '500',
  },
})
