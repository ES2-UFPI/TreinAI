import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import Alert from '../components/Alert'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Input from '../components/Input'
import { loginUser } from '../services/api'
import { setToken } from '../services/session'
import { colors } from '../styles/theme'

export default function LoginScreen({ onRegister, onLoggedIn }) {
  const [form, setForm] = useState({ email: '', senha: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const set = (key) => (value) => setForm({ ...form, [key]: value })

  async function handleSubmit() {
    setError('')

    if (!form.email.trim() || !form.senha) {
      setError('Informe email e senha para entrar.')
      return
    }

    setLoading(true)
    try {
      const data = await loginUser(form)
      await setToken(data.access_token)
      onLoggedIn()
    } catch (err) {
      setError(err.message || 'Email ou senha inválidos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="ENTRAR" subtitle="Bem-vindo de volta. Bora treinar!">
      <Alert type="error" message={error} />
      <Input
        label="Email"
        value={form.email}
        onChangeText={set('email')}
        placeholder="joao@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        label="Senha"
        value={form.senha}
        onChangeText={set('senha')}
        placeholder="Sua senha"
        secureTextEntry
      />
      <Button loading={loading} onPress={handleSubmit}>Entrar</Button>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Não tem conta? </Text>
        <Pressable onPress={onRegister}>
          <Text style={styles.link}>Cadastrar</Text>
        </Pressable>
      </View>
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 4,
  },
  footerText: {
    color: colors.textDim,
    fontSize: 13,
  },
  link: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
  },
})
