import { getToken } from '@/services/session'
import type { WorkoutPlan } from '@/domain/workout'

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000'

export const levelToBackend: Record<string, string> = {
  iniciante: 'beginner',
  intermediario: 'intermediate',
  avancado: 'advanced',
}

// Exportado para uso fora deste arquivo (ex.: traduzir o nivel salvo na
// sessao para exibir no dashboard) sem duplicar o mapeamento.
export const levelFromBackend: Record<string, string> = {
  beginner: 'iniciante',
  intermediate: 'intermediario',
  advanced: 'avancado',
}

function normalizeUser(user: any) {
  if (!user) return user
  const level = user.nivel || user.level || ''

  return {
    id: user.id,
    nome: user.nome || user.name || '',
    email: user.email || '',
    idade: user.idade ?? user.age ?? '',
    peso: user.peso ?? user.weight ?? '',
    altura: user.altura ?? user.height ?? '',
    objetivo: user.objetivo || user.goal || '',
    nivel: levelFromBackend[level] || level,
  }
}

function toRegisterPayload(data: any) {
  return {
    name: data.nome,
    email: data.email,
    password: data.senha,
    age: data.idade,
    weight: data.peso,
    height: data.altura,
    goal: data.objetivo,
    level: levelToBackend[data.nivel] || data.nivel,
  }
}

function toProfilePayload(data: any) {
  return {
    age: data.idade,
    weight: data.peso,
    height: data.altura,
    goal: data.objetivo,
    level: levelToBackend[data.nivel] || data.nivel,
  }
}

async function request(path: string, options: RequestInit = {}) {
  const token = await getToken()
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...((options.headers as Record<string, string>) || {}),
    },
  })

  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.detail || 'Nao foi possivel concluir a solicitacao.')
  }

  return data
}

export async function loginUser(data: any) {
  return request('/login', {
    method: 'POST',
    body: JSON.stringify({ email: data.email, password: data.senha }),
  })
}

export async function registerUser(data: any) {
  const response = await request('/users', {
    method: 'POST',
    body: JSON.stringify(toRegisterPayload(data)),
  })

  return normalizeUser(response)
}

export async function getMe() {
  return normalizeUser(await request('/users/me'))
}

export async function updateProfile(data: any) {
  const response = await request('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(toProfilePayload(data)),
  })

  return normalizeUser(response)
}

export type WorkoutHistoryItem = {
  id: number
  title: string
  created_at: string
}

export async function getWorkoutHistory(userId: number): Promise<WorkoutHistoryItem[]> {
  return request(`/workouts/history?user_id=${userId}`)
}

export async function buscarDetalheTreino(id: number): Promise<WorkoutPlan> {
  return request(`/workouts/${id}`)
}

export async function generateWorkout(userId: number, query: string): Promise<WorkoutPlan> {
  return request('/workouts/generate', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, query }),
  })
}
