import React, { useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import Alert from '../components/Alert'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Input from '../components/Input'
import OptionSelect from '../components/OptionSelect'
import { registerUser } from '../services/api'
import { colors } from '../styles/theme'

const goals = [
  { label: 'Emagrecer', value: 'emagrecer' },
  { label: 'Ganhar Massa', value: 'ganhar_massa' },
  { label: 'Definição', value: 'definicao' },
  { label: 'Condicionamento', value: 'condicionamento' },
  { label: 'Saúde Geral', value: 'saude' },
]

const levels = [
  { label: 'Iniciante', value: 'iniciante' },
  { label: 'Intermediário', value: 'intermediario' },
  { label: 'Avançado', value: 'avancado' },
]

export default function RegisterScreen({ onLogin, onRegistered }) {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    idade: '',
    peso: '',
    altura: '',
    objetivo: '',
    nivel: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (key) => (value) => setForm({ ...form, [key]: value })

  async function handleSubmit() {
    setError('')
    setSuccess('')

    if (!form.nome || !form.email || !form.senha || !form.idade || !form.peso || !form.altura || !form.objetivo || !form.nivel) {
      setError('Preencha todos os campos.')
      return
    }

    if (form.senha.length < 6) {
      setError('Mínimo 6 caracteres.')
      return
    }

    const payload = {
      ...form,
      idade: form.idade ? parseInt(form.idade, 10) : null,
      peso: form.peso ? parseFloat(form.peso.replace(',', '.')) : null,
      altura: form.altura ? parseFloat(form.altura.replace(',', '.')) : null,
    }

    if (![payload.idade, payload.peso, payload.altura].every(Number.isFinite)) {
      setError('Idade, peso e altura precisam ser números.')
      return
    }

    setLoading(true)
    try {
      await registerUser(payload)
      setSuccess('Cadastro realizado com sucesso! Redirecionando...')
      setTimeout(onRegistered, 1000)
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="CADASTRO" subtitle="Crie sua conta e comece sua jornada fitness.">
      <Alert type="error" message={error} />
      <Alert type="success" message={success} />
      <Input label="Nome completo" placeholder="João Silva" value={form.nome} onChangeText={set('nome')} />
      <Input label="Email" placeholder="joao@email.com" value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
      <Input label="Senha" placeholder="Mínimo 6 caracteres" value={form.senha} onChangeText={set('senha')} secureTextEntry />
      <View style={styles.row}>
        <Input label="Idade" placeholder="25" value={form.idade} onChangeText={set('idade')} keyboardType="numeric" style={styles.rowInput} />
        <Input label="Peso (kg)" placeholder="75.5" value={form.peso} onChangeText={set('peso')} keyboardType="decimal-pad" style={styles.rowInput} />
      </View>
      <Input label="Altura (cm)" placeholder="175" value={form.altura} onChangeText={set('altura')} keyboardType="numeric" />
      <OptionSelect label="Objetivo" options={goals} value={form.objetivo} onChange={set('objetivo')} />
      <OptionSelect label="Nível" options={levels} value={form.nivel} onChange={set('nivel')} />
      <Button loading={loading} onPress={handleSubmit}>Criar conta</Button>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Já tem conta? </Text>
        <Pressable onPress={onLogin}>
          <Text style={styles.link}>Entrar</Text>
        </Pressable>
      </View>
    </AuthLayout>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowInput: {
    flex: 1,
  },
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
