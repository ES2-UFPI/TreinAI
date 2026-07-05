import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'

import { colors, radius } from '@/styles/theme'
import type { Exercise, WorkoutDay, WorkoutPlan } from '@/domain/workout'

export type { WorkoutPlan }

const LEVEL_LABEL: Record<string, string> = {
  beginner: 'Iniciante',
  intermediate: 'Intermediário',
  advanced: 'Avançado',
}

interface WorkoutContentProps {
  plan: WorkoutPlan
}

export default function WorkoutContent({ plan }: WorkoutContentProps) {
  return (
    <>
      <Tags plan={plan} />
      <StatsGrid plan={plan} />
      <DaysList days={plan.days} />
    </>
  )
}

function Tags({ plan }: { plan: WorkoutPlan }) {
  const defaultTags = [
    plan.main_goal,
    plan.workout_type,
    plan.target_gender,
    plan.equipment_required,
  ].filter((t): t is string => !!t)

  return (
    <View style={styles.tagsRow}>
      {defaultTags.map((tag, i) => (
        <View key={i} style={styles.tag}>
          <Text style={styles.tagText}>{tag.toUpperCase()}</Text>
        </View>
      ))}
      {!!plan.training_level && (
        <View style={[styles.tag, styles.tagAccent]}>
          <Text style={[styles.tagText, styles.tagAccentText]}>
            {(LEVEL_LABEL[plan.training_level] ?? plan.training_level).toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  )
}

function StatsGrid({ plan }: { plan: WorkoutPlan }) {
  return (
    <View style={styles.statsGrid}>
      <StatCard value={plan.program_duration_weeks} label="Duração" unit="SEM" />
      <StatCard value={plan.days_per_week} label="Dias / Semana" unit="x" />
      <StatCard value={plan.time_per_workout} label="Tempo / Treino" />
    </View>
  )
}

function StatCard({
  value,
  label,
  unit,
}: {
  value: string | number | null | undefined
  label: string
  unit?: string
}) {
  if (value == null) return null

  return (
    <View style={styles.statCard}>
      <Text
        style={styles.statValue}
        adjustsFontSizeToFit
        minimumFontScale={0.4}
      >
        {String(value)}
        {unit && <Text style={styles.statUnit}> {unit}</Text>}
      </Text>

      <Text
        style={styles.statLabel}
        numberOfLines={2}
      >
        {label.toUpperCase()}
      </Text>
    </View>
  )
}

function DaysList({ days }: { days: WorkoutDay[] }) {
  if (!days?.length) {
    return (
      <View style={styles.exercisesSection}>
        <Text style={styles.emptyState}>Nenhum treino disponível.</Text>
      </View>
    )
  }

  return (
    <View style={styles.exercisesSection}>
      {days.map((d) => (
        <View key={d.day} style={styles.dayBlock}>
          <View style={styles.dayHeader}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayBadgeText}>DIA {d.day}</Text>
            </View>
            <Text style={styles.dayFocus}>{d.focus}</Text>
          </View>
          <View style={styles.exercisesList}>
            {d.exercises.map((ex, i) => (
              <ExerciseCard key={i} exercise={ex} index={i} />
            ))}
          </View>
        </View>
      ))}
    </View>
  )
}

function ExerciseCard({ exercise, index }: { exercise: Exercise; index: number }) {
  const { width } = useWindowDimensions()
  const isMobile = width < 480

  return (
    <View style={styles.exerciseCard}>
      <View style={styles.exerciseHeader}>
        <View style={styles.exerciseIndex}>
          <Text style={styles.exerciseIndexText}>{index + 1}</Text>
        </View>

        <View style={styles.exerciseInfo}>
          <Text style={styles.exerciseName} numberOfLines={2}>{exercise.name}</Text>
          {!!exercise.muscle_group && (
            <Text style={styles.exerciseMuscle} numberOfLines={1}>{exercise.muscle_group}</Text>
          )}
        </View>
      </View>

      <View style={styles.exerciseMetrics}>
        <Metric value={exercise.sets} label="Séries" isMobile={isMobile} />
        <Text style={styles.metricSeparator}>×</Text>
        <Metric value={exercise.reps} label="Reps" isMobile={isMobile} />
      </View>
    </View>
  )
}

function Metric({ value, label, isMobile }: { value: string | number; label: string; isMobile: boolean }) {
  return (
    <View style={[styles.metric, isMobile ? styles.metricMobile : styles.metricDesktop]}>
      <Text style={styles.metricValue} numberOfLines={isMobile ? undefined : 1}>{String(value)}</Text>
      <Text style={styles.metricLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagAccent: {
    backgroundColor: colors.accent,
    borderWidth: 0,
  },
  tagText: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  tagAccentText: {
    color: '#0a0a0a',
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: 0,
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius + 4,
    paddingHorizontal: 8,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  statValue: {
    color: colors.accent,
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 34,
    width: '100%',
    textAlign: 'center',
    flexShrink: 1,
  },

  statUnit: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.75,
  },

  statLabel: {
    color: colors.textDim,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
    textAlign: 'center',
  },

  exercisesSection: {
    gap: 20,
  },
  dayBlock: {
    gap: 10,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayBadge: {
    backgroundColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  dayBadgeText: {
    color: colors.bg,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  dayFocus: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  emptyState: {
    color: colors.textDim,
    fontSize: 14,
    fontStyle: 'italic',
  },
  exercisesList: {
    gap: 10,
  },
  exerciseCard: {
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius + 4,
    padding: 14,
    gap: 10,
    overflow: 'hidden',
  },
  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  exerciseIndex: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseIndexText: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '700',
  },
  exerciseInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
    marginTop: 2,
  },
  exerciseName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  exerciseMuscle: {
    color: colors.textDim,
    fontSize: 12,
  },
  exerciseMetrics: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    flexWrap: 'wrap',
  },
  metric: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  metricMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
    flexShrink: 1,
    minWidth: 0,
  },
  metricDesktop: {
    flexShrink: 0,
  },
  metricValue: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: '700',
  },
  metricLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  metricSeparator: {
    color: colors.textDim,
    fontSize: 15,
    fontWeight: '300',
    marginHorizontal: 4,
  },
})