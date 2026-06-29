export interface Exercise {
  name: string
  sets: number
  reps: string
  rest_seconds?: number
  muscle_group?: string
  notes?: string
}

export interface WorkoutPlan {
  title: string
  description?: string
  main_goal: string
  workout_type: string
  training_level: string
  program_duration_weeks: number
  days_per_week: number
  time_per_workout: string
  equipment_required: string
  target_gender: string
  exercises: Exercise[]
}
