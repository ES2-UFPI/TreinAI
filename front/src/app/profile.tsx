import React, { useEffect, useState } from 'react'
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import Alert from '@/components/Alert'
import BottomNav from '@/components/BottomNav'
import Button from '@/components/Button'
import Input from '@/components/Input'
import OptionSelect from '@/components/OptionSelect'
import { getMe, levelToBackend, updateProfile } from '@/services/api'
import {
  clearToken,
  getToken,
  getUserProfile,
  setUserLevel,
  setUserProfile,
  type StoredUserProfile,
} from '@/services/session'
import { colors, radius } from '@/styles/theme'

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

const levelLabels: Record<string, string> = {
  iniciante: 'iniciante',
  intermediario: 'intermediário',
  avancado: 'avançado',
}

export default function ProfileScreen() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState({ idade: '', peso: '', altura: '', objetivo: '', nivel: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const set = (key: string) => (value: string) => setForm({ ...form, [key]: value })

  function applyProfile(profile: StoredUserProfile) {
    setUser(profile)
    setForm({
      idade: profile.idade || '',
      peso: profile.peso || '',
      altura: profile.altura || '',
      objetivo: profile.objetivo || '',
      nivel: profile.nivel || '',
    })
  }

  useEffect(() => {
    async function load() {
      const token = await getToken()
      if (!token) {
        router.replace('/login')
        return
      }

      const stored = await getUserProfile()
      if (stored) {
        applyProfile(stored)
      }

      try {
        const data = await getMe()
        applyProfile({
          id: String(data.id),
          nome: data.nome || stored?.nome || '',
          email: data.email || stored?.email || '',
          idade: data.idade != null ? String(data.idade) : stored?.idade || '',
          peso: data.peso != null ? String(data.peso) : stored?.peso || '',
          altura: data.altura != null ? String(data.altura) : stored?.altura || '',
          objetivo: data.objetivo || stored?.objetivo || '',
          nivel: data.nivel || stored?.nivel || '',
        })
      } catch {
        if (!stored) {
          setError('Não foi possível carregar todos os dados do perfil.')
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [router])

  async function handleLogout() {
    await clearToken()
    router.replace('/login')
  }

  async function handleSubmit() {
    setError('')
    setSuccess('')

    const payload = {
      idade: form.idade ? parseInt(form.idade, 10) : null,
      peso: form.peso ? parseFloat(form.peso.replace(',', '.')) : null,
      altura: form.altura ? parseFloat(form.altura.replace(',', '.')) : null,
      objetivo: form.objetivo || null,
      nivel: form.nivel || null,
    }

    if (![payload.idade, payload.peso, payload.altura].every(Number.isFinite)) {
      setError('Idade, peso e altura precisam ser números.')
      return
    }

    setSaving(true)
    try {
      const updated: StoredUserProfile = {
        id: user?.id ? String(user.id) : '',
        nome: user?.nome || '',
        email: user?.email || '',
        idade: form.idade,
        peso: form.peso,
        altura: form.altura,
        objetivo: form.objetivo,
        nivel: form.nivel,
      }

      let saved = updated

      try {
        const data = await updateProfile(payload)
        saved = {
          id: String(data.id),
          nome: data.nome || updated.nome,
          email: data.email || updated.email,
          idade: data.idade != null ? String(data.idade) : updated.idade,
          peso: data.peso != null ? String(data.peso) : updated.peso,
          altura: data.altura != null ? String(data.altura) : updated.altura,
          objetivo: data.objetivo || updated.objetivo,
          nivel: data.nivel || updated.nivel,
        }
      } catch {
        // API indisponível: persiste localmente até o backend expor /users/me
      }

      applyProfile(saved)
      await setUserProfile(saved)
      await setUserLevel(levelToBackend[form.nivel] || form.nivel)
      setSuccess('Perfil atualizado com sucesso!')
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar perfil.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.accent} size="large" />
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.brand}>⚡ TreinAI</Text>
        <View style={styles.headerRight}>
          {user && <Text style={styles.greeting} numberOfLines={1}>Olá, {user.nome.split(' ')[0]}</Text>}
          <Button variant="secondary" style={styles.logoutButton} onPress={handleLogout}>Sair</Button>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.main, { paddingBottom: 110 + insets.bottom, paddingTop: insets.top > 0 ? 0 : 12 }]}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.nome?.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.identity}>
              <Text style={styles.name}>{user?.nome}</Text>
              <Text style={styles.email}>{user?.email}</Text>
            </View>
          </View>

          {user && (
            <View style={styles.stats}>
              {user.peso && <Stat value={user.peso} unit="kg" label="Peso" />}
              {user.altura && <Stat value={user.altura} unit="cm" label="Altura" />}
              {user.idade && <Stat value={user.idade} label="Anos" />}
              {user.nivel && <Stat value={levelLabels[user.nivel] || user.nivel} label="Nível" badge />}
            </View>
          )}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>Editar Perfil</Text>

          <View style={styles.form}>
            <Alert type="error" message={error} />
            <Alert type="success" message={success} />
            <View style={styles.row}>
              <Input label="Idade" placeholder="25" value={form.idade} onChangeText={set('idade')} keyboardType="numeric" style={styles.rowInput} />
              <Input label="Peso (kg)" placeholder="75.5" value={form.peso} onChangeText={set('peso')} keyboardType="decimal-pad" style={styles.rowInput} />
            </View>
            <Input label="Altura (cm)" placeholder="175" value={form.altura} onChangeText={set('altura')} keyboardType="numeric" />
            <OptionSelect label="Objetivo" options={goals} value={form.objetivo} onChange={set('objetivo')} />
            <OptionSelect label="Nível" options={levels} value={form.nivel} onChange={set('nivel')} />
            <Button loading={saving} onPress={handleSubmit}>Salvar alterações</Button>
          </View>
        </View>
      </ScrollView>
      <BottomNav />
    </View>
  )
}

function Stat({ value, unit, label, badge }: { value: any; unit?: string; label: string; badge?: boolean }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, badge && styles.statBadge]}>
        {value}
        {unit && <Text style={styles.statUnit}>{unit}</Text>}
      </Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  brand: {
    color: colors.accent,
    fontFamily: 'Exo_900Black',
    fontSize: 24,
    letterSpacing: 2,
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  greeting: {
    color: colors.textDim,
    fontSize: 14,
    maxWidth: 104,
  },
  logoutButton: {
    minHeight: 34,
    width: 74,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  main: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 60,
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    padding: 22,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 26,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderColor: colors.accent,
    borderWidth: 2,
    backgroundColor: colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.accent,
    fontSize: 28,
    fontWeight: '900',
  },
  identity: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    color: colors.textDim,
    fontSize: 13,
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 28,
  },
  stat: {
    minWidth: 88,
    flexGrow: 1,
    backgroundColor: colors.surface2,
    borderColor: colors.border,
    borderRadius: radius,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    color: colors.accent,
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1,
  },
  statUnit: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '500',
    opacity: 0.75,
  },
  statBadge: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  statLabel: {
    color: colors.textDim,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
  divider: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    marginBottom: 28,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  rowInput: {
    flex: 1,
  },
})
