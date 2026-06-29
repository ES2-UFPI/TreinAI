import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'token'
const USER_ID_KEY = 'userId'
const USER_NAME_KEY = 'userName'

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
    return
  }

  await SecureStore.deleteItemAsync(TOKEN_KEY)
  await SecureStore.deleteItemAsync(USER_ID_KEY)
  await SecureStore.deleteItemAsync(USER_NAME_KEY)
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
