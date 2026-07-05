export type Modality = 'bodyweight' | 'equipment'

export interface Exercise {
  name: string
  sets: number
  reps: string
  rest_seconds?: number
  muscle_group?: string
  notes?: string
}

export interface WorkoutDay {
  day: number
  focus: string
  exercises: Exercise[]
}

export interface WorkoutPlan {
  id?: number
  title: string
  description?: string
  main_goal: string
  workout_type: string
  training_level: string
  program_duration_weeks?: number | null
  days_per_week?: number | null
  time_per_workout?: string | null
  equipment_required?: string | null
  target_gender?: string | null
  days: WorkoutDay[]
}
