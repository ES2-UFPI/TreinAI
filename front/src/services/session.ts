import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'token'
const USER_ID_KEY = 'userId'
const USER_NAME_KEY = 'userName'
const USER_LEVEL_KEY = 'userLevel'
const USER_PROFILE_KEY = 'userProfile'

export type StoredUserProfile = {
  id: string
  nome: string
  email: string
  idade: string
  peso: string
  altura: string
  objetivo: string
  nivel: string
}

function getStorage() {
  if (Platform.OS === 'web' && typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return globalThis.localStorage
  }

  return null
}

export async function getToken() {
  const storage = getStorage()
  if (storage) return storage.getItem(TOKEN_KEY)
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function setToken(token: string) {
  const storage = getStorage()
  if (storage) {
    storage.setItem(TOKEN_KEY, token)
    return
  }

  await SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function clearToken() {
  const storage = getStorage()
  if (storage) {
    storage.removeItem(TOKEN_KEY)
    storage.removeItem(USER_ID_KEY)
    storage.removeItem(USER_NAME_KEY)
    storage.removeItem(USER_LEVEL_KEY)
    storage.removeItem(USER_PROFILE_KEY)
    return
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY)
  await SecureStore.deleteItemAsync(USER_ID_KEY)
  await SecureStore.deleteItemAsync(USER_NAME_KEY)
  await SecureStore.deleteItemAsync(USER_LEVEL_KEY)
  await SecureStore.deleteItemAsync(USER_PROFILE_KEY)
}

export async function getUserId() {
  const storage = getStorage()
  if (storage) return storage.getItem(USER_ID_KEY)
  return SecureStore.getItemAsync(USER_ID_KEY)
}

export async function setUserId(userId: string) {
  const storage = getStorage()
  if (storage) {
    storage.setItem(USER_ID_KEY, userId)
    return
  }

  await SecureStore.setItemAsync(USER_ID_KEY, userId)
}

export async function getUserName() {
  const storage = getStorage()
  if (storage) return storage.getItem(USER_NAME_KEY)
  return SecureStore.getItemAsync(USER_NAME_KEY)
}

export async function setUserName(name: string) {
  const storage = getStorage()
  if (storage) {
    storage.setItem(USER_NAME_KEY, name)
    return
  }

  await SecureStore.setItemAsync(USER_NAME_KEY, name)
}

// Nível de treino do usuário, vem de UserRead.level no /login ("beginner" |
// "intermediate" | "advanced"). Guardamos o valor cru do backend e traduzimos
// na hora de exibir (ver levelFromBackend em services/api.ts).
export async function getUserLevel() {
  const storage = getStorage()
  if (storage) return storage.getItem(USER_LEVEL_KEY)
  return SecureStore.getItemAsync(USER_LEVEL_KEY)
}

export async function setUserLevel(level: string) {
  const storage = getStorage()
  if (storage) {
    storage.setItem(USER_LEVEL_KEY, level)
    return
  }

  await SecureStore.setItemAsync(USER_LEVEL_KEY, level)
}

export async function getUserProfile(): Promise<StoredUserProfile | null> {
  const storage = getStorage()
  let raw: string | null = null

  if (storage) {
    raw = storage.getItem(USER_PROFILE_KEY)
  } else {
    raw = await SecureStore.getItemAsync(USER_PROFILE_KEY)
  }

  if (raw) {
    try {
      return JSON.parse(raw) as StoredUserProfile
    } catch {
      return null
    }
  }

  const [id, nome, nivel] = await Promise.all([
    getUserId(),
    getUserName(),
    getUserLevel(),
  ])

  if (!id && !nome) return null

  return {
    id: id || '',
    nome: nome || '',
    email: '',
    idade: '',
    peso: '',
    altura: '',
    objetivo: '',
    nivel: nivel || '',
  }
}

export async function setUserProfile(profile: StoredUserProfile) {
  const storage = getStorage()
  const serialized = JSON.stringify(profile)

  if (storage) {
    storage.setItem(USER_PROFILE_KEY, serialized)
    storage.setItem(USER_ID_KEY, profile.id)
    storage.setItem(USER_NAME_KEY, profile.nome)
    return
  }

  await SecureStore.setItemAsync(USER_PROFILE_KEY, serialized)
  await SecureStore.setItemAsync(USER_ID_KEY, profile.id)
  await SecureStore.setItemAsync(USER_NAME_KEY, profile.nome)
}
