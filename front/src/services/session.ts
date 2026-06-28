import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'token'

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
    return
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY)
}
