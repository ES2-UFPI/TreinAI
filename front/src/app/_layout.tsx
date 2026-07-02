import React, { useEffect } from 'react'
import { Stack, usePathname, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Exo_900Black } from '@expo-google-fonts/exo'
import * as SplashScreen from 'expo-splash-screen'

import { getToken } from '@/services/session'

SplashScreen.preventAutoHideAsync()

const AUTH_ROUTES = ['/login', '/register']

export default function RootLayout() {
  const router = useRouter()
  const pathname = usePathname()
  const [fontsLoaded] = useFonts({ Exo_900Black })

  useEffect(() => {
    if (!fontsLoaded) return

    getToken()
      .then((token) => {
        const isAuthRoute = AUTH_ROUTES.includes(pathname)

        if (!token && !isAuthRoute) {
          router.replace('/login')
          return
        }

        if (token && isAuthRoute) {
          router.replace('/')
        }
      })
      .finally(() => SplashScreen.hideAsync())
  }, [fontsLoaded, pathname, router])

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="workouts" />
        <Stack.Screen name="help" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="workout/[id]" />
      </Stack>
    </>
  )
}
