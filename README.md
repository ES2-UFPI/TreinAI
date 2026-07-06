# TreinAI

Aplicativo de treinos personalizados com auxílio de Inteligência Artificial. Descreva seu objetivo, equipamentos disponíveis e rotina — a IA monta um plano completo para você.

## Funcionalidades

- **Geração de treinos com IA** — você descreve seu objetivo (ex: "emagrecer treino em casa 3x por semana") e a IA monta um plano completo com dias, foco, exercícios, séries, reps e tempo de descanso
- **Modalidade** — escolha entre treino com equipamento ou sem equipamento (bodyweight)
- **Modificar treino** — não gostou do plano? Escreva o que quer mudar e a IA gera um novo treino considerando seu feedback
- **Histórico** — todos os treinos salvos ficam acessíveis com data, contagem de exercícios e detalhamento completo
- **Dashboard** — tela inicial com acesso rápido à geração de treino, histórico e perfil
- **Tour guiado** — tutorial interativo para novos usuários conhecerem as funcionalidades

## Acesso

### Web
Acesse a versão web publicada no GitHub Pages:

> https://es2-ufpi.github.io/TreinAI/

### Mobile
Escaneie o QR code com o app **Expo Go** (disponível na Play Store / App Store) rodando o projeto localmente:

```bash
cd front
npm install
npx expo start
```

## Como usar

1. **Cadastre-se** — informe nome, email, senha, idade, peso, altura, objetivo e nível de experiência
2. **Gere um treino** — na dashboard, descreva seu objetivo e escolha a modalidade
3. **Revise o plano** — o treino aparece com todos os exercícios organizados por dia
4. **Modifique se preciso** — clique em "Modificar treino", escreva seu feedback e gere um novo plano
5. **Salve** — clique em "Salvar treino" para guardar no seu histórico
6. **Consulte** — acesse o histórico a qualquer momento para rever treinos anteriores

---

## Rodar localmente (para desenvolvedores)

### Pré-requisitos

- Python 3.13+
- [uv](https://docs.astral.sh/uv/) (gerenciador de pacotes Python)
- Node.js 24+
- PostgreSQL (ou usar a URL de um banco remoto)

### Backend

```bash
cd backend

# Instalar dependências
uv sync

# Configurar ambiente
cp .env.dev .env
# Edite .env com seus valores

# Rodar a API (disponível em http://127.0.0.1:8000)
uv run python main.py

# Documentação interativa: http://127.0.0.1:8000/docs
```

### Frontend

```bash
cd front

# Instalar dependências
npm install

# Criar arquivo de ambiente
cp .env.example .env
# EXPO_PUBLIC_API_URL já vem com http://127.0.0.1:8000 por padrão

# Rodar (escolha uma plataforma)
npx expo start        # QR code para Expo Go (mobile)
npm run web           # Navegador (http://localhost:8081)
```

### Variáveis de ambiente

**Backend** (`.env`):

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DATABASE_URL` | String de conexão PostgreSQL | — (obrigatória) |
| `GEMINI_API_KEY` | Chave da API do Google Gemini | — |
| `OLLAMA_API_KEY` | Chave da API para rodar modelos locais | — |
| `CORS_ORIGINS` | Origens permitidas (separadas por vírgula) | `*` |

**Frontend** (`.env`):

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `EXPO_PUBLIC_API_URL` | URL do backend | `http://127.0.0.1:8000` |

## Equipe

| Nome | GitHub |
|------|--------|
| Artur Sousa | [@focarica](https://github.com/focarica) |
| Thalysson Melo | [@thalyssonmelo](https://github.com/thalyssonmelo) | 
| Alan Nunes | [@alannunes73](https://github.com/alannunes73) |

---

*Engenharia de Software — UFPI — 2026.1*