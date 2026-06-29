import React, { useEffect } from 'react'
import { Stack, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Exo_900Black } from '@expo-google-fonts/exo'
import * as SplashScreen from 'expo-splash-screen'

import { getToken } from '@/services/session'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const router = useRouter()
  const [fontsLoaded] = useFonts({ Exo_900Black })

  useEffect(() => {
    if (!fontsLoaded) return
    getToken()
      .then((token) => router.replace(token ? '/' : '/login'))
      .finally(() => SplashScreen.hideAsync())
  }, [fontsLoaded, router])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="workout/[id]" />
      </Stack>
    </>
  )
}
