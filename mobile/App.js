import React, { useEffect, useState } from 'react'
import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { useFonts, Exo_900Black } from '@expo-google-fonts/exo'

import LoginScreen from './src/screens/LoginScreen'
import RegisterScreen from './src/screens/RegisterScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { colors } from './src/styles/theme'
import { getToken } from './src/services/session'

export default function App() {
  const [fontsLoaded] = useFonts({
    Exo_900Black,
  })
  const [screen, setScreen] = useState('login')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    getToken()
      .then((token) => setScreen(token ? 'profile' : 'login'))
      .finally(() => setCheckingSession(false))
  }, [])

  if (checkingSession || !fontsLoaded) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    )
  }

  return (
    <>
      <StatusBar style="light" />
      {screen === 'login' && (
        <LoginScreen
          onRegister={() => setScreen('register')}
          onLoggedIn={() => setScreen('profile')}
        />
      )}
      {screen === 'register' && (
        <RegisterScreen
          onLogin={() => setScreen('login')}
          onRegistered={() => setScreen('login')}
        />
      )}
      {screen === 'profile' && (
        <ProfileScreen
          onLogout={() => setScreen('login')}
          onUnauthorized={() => setScreen('login')}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
})
