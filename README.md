# MeuControle

Aplicativo de **finanças pessoais** com frontend e backend separados.

- **Frontend:** React 19 + Vite + Tailwind CSS  
- **Backend:** Node.js + Express + SQLite  
- **Auth:** JWT (Bearer token)

---

## Índice

1. [Como iniciar](#como-iniciar)
2. [Expor na rede local](#expor-na-rede-local)
3. [Arquitetura](#arquitetura)
4. [Estrutura de pastas](#estrutura-de-pastas)
5. [Funcionalidades](#funcionalidades)
6. [Fluxo de autenticação](#fluxo-de-autenticação)
7. [Cliente de API (frontend)](#cliente-de-api-frontend)
8. [Endpoints da API](#endpoints-da-api)
9. [Modelo de dados (SQLite)](#modelo-de-dados-sqlite)
10. [Temas e preferências](#temas-e-preferências)
11. [Variáveis de ambiente](#variáveis-de-ambiente)

---

## Como iniciar

### Pré-requisitos

- Node.js 18+ (recomendado 20+)
- npm

### 1. Backend

```bash
cd backend
npm install
npm run dev
# ou: npm start
```

A API sobe em:

- Local: `http://localhost:3001`
- Rede: `http://0.0.0.0:3001` (acessível pelo IP da máquina)

Banco SQLite criado automaticamente em:

```text
backend/data/finance.db
```

### 2. Frontend

Em **outro terminal**:

```bash
cd finance
npm install
npm run dev
```

App em:

- Local: `http://localhost:5173`
- Rede: o Vite mostra um endereço `Network` (ex.: `http://10.x.x.x:5173`)

### Scripts úteis

| Pasta | Comando | Descrição |
|-------|---------|-----------|
| `backend` | `npm run dev` | API com `--watch` |
| `backend` | `npm start` | API normal |
| `finance` | `npm run dev` | Dev server (com `--host`) |
| `finance` | `npm run build` | Build de produção (`dist/`) |
| `finance` | `npm run preview` | Preview do build |
| `finance` | `npm run lint` | ESLint |

---

## Expor na rede local

Para colegas na mesma rede acessarem:

1. Suba o **backend** e o **frontend**.
2. No terminal do Vite, use o link **Network** (não o `localhost`).
3. Se não abrir em outros PCs, libere no Firewall do Windows as portas **5173** e **3001**.

O frontend detecta o hostname automaticamente e chama a API em:

```text
http://<mesmo-ip-do-front>:3001/api
```

---

## Arquitetura

```text
┌─────────────────────────────┐
│  Browser (React / Vite)     │
│  finance/src                │
│  - páginas + componentes    │
│  - services/api.js          │
│  - themes.js                │
└──────────────┬──────────────┘
               │ HTTP JSON + JWT
               ▼
┌─────────────────────────────┐
│  API Express                │
│  backend/src                │
│  - routes/*                 │
│  - middleware/auth.js       │
└──────────────┬──────────────┘
               │ better-sqlite3
               ▼
┌─────────────────────────────┐
│  SQLite                     │
│  backend/data/finance.db    │
└─────────────────────────────┘
```

### Princípios

- Frontend **não** acessa o banco diretamente.
- Toda operação de dados passa pela API.
- Rotas protegidas exigem header `Authorization: Bearer <token>`.
- Preferências do usuário (tema, avatar, sidebar) ficam no banco.

---

## Estrutura de pastas

```text
Finance-main/
├── README.md
├── backend/
│   ├── package.json
│   ├── .env                 # PORT, JWT_SECRET, CORS_ORIGIN
│   ├── data/
│   │   └── finance.db       # banco local (gerado em runtime)
│   └── src/
│       ├── index.js         # sobe o servidor Express
│       ├── db.js            # schema SQLite + migrations leves
│       ├── middleware/
│       │   └── auth.js      # valida JWT
│       └── routes/
│           ├── auth.js      # login, register, me, profile
│           ├── accounts.js
│           ├── categories.js
│           ├── transactions.js
│           └── caixinhas.js
└── finance/
    ├── package.json
    ├── vite.config.js       # host + proxy /api
    ├── .env                 # VITE_API_URL (opcional)
    └── src/
        ├── main.jsx
        ├── App.jsx          # auth gate + rotas
        ├── index.css        # CSS variables dos temas
        ├── themes.js        # catálogo e applyTheme()
        ├── services/
        │   └── api.js       # todas as chamadas HTTP
        ├── components/
        │   ├── Layout.jsx   # header, avatar menu, outlet
        │   └── Sidebar.jsx  # navegação recolhível
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── Despesas.jsx     # lançar despesas e receitas
            ├── Transacoes.jsx
            ├── Contas.jsx
            ├── Categorias.jsx
            ├── Caixinhas.jsx
            └── Configuracoes.jsx
```

---

## Funcionalidades

### Login / Cadastro

- Criar conta (nome, e-mail, senha).
- Entrar com e-mail e senha.
- Sessão mantida via token JWT no `localStorage` (`finance_token`).

### Dashboard

- Resumo de saldo, receitas e despesas.
- Gráfico de despesas por categoria.
- Lista das últimas movimentações.
- Visão geral apenas (sem formulário de criação).

### Lançamentos (`/despesas`)

- Página dedicada para criar despesas e receitas.
- Totais de despesas e receitas.
- Lista de todos os lançamentos registrados (saídas em vermelho, entradas em verde).
- Formulário com tipo (despesa/receita), descrição, valor, data, conta e categoria.

### Transações (Extrato)

- Listagem filtrada por mês.
- Totais do período.
- Editar e excluir lançamentos.

### Contas e Cartões

- CRUD de contas (Corrente, Poupança, Cartão, Dinheiro).
- Saldo / limite por conta.

### Categorias

- Categorias de receita e despesa.
- CRUD completo.

### Caixinhas

- Metas de economia (nome, valor alvo, saldo atual).
- Guardar (depósito) e resgatar (saque).
- Só permite excluir se o saldo estiver zerado.

### Configurações / Perfil

- Alterar nome.
- Alterar / remover foto (avatar).
- Escolher tema visual.
- Preferências salvas no banco e restauradas no login.

### Layout

- Sidebar expansível / recolhida (só ícones).
- Estado da sidebar salvo por usuário.
- Menu do avatar: Configurações e Sair do Sistema.
- Logo no header.
- Itens do menu: Dashboard, Lançamentos, Transações, Contas, Caixinhas, Categorias.

---

## Fluxo de autenticação

1. `Login.jsx` chama `api.login` ou `api.register`.
2. API devolve `{ token, user }`.
3. Frontend salva o token com `setToken(token)`.
4. `App.jsx` guarda o usuário em estado e libera as rotas autenticadas.
5. Em reloads, `App.jsx` lê o token e chama `api.me()`.
6. Logout limpa o token (`clearToken`) e reseta o usuário.

Rotas do app autenticado (`App.jsx`):

| Rota | Página |
|------|--------|
| `/` | Dashboard |
| `/despesas` | Lançamentos (criar despesas/receitas) |
| `/transacoes` | Extrato |
| `/contas` | Contas |
| `/caixinhas` | Caixinhas |
| `/categorias` | Categorias |
| `/configuracoes` | Configurações |

---

## Cliente de API (frontend)

Arquivo: `finance/src/services/api.js`

### Helpers de token

| Função | Descrição |
|--------|-----------|
| `getToken()` | Lê JWT do `localStorage` |
| `setToken(token)` | Salva JWT |
| `clearToken()` | Remove JWT |
| `request(path, options)` | `fetch` com JSON + Bearer automático |

### Métodos `api`

#### Auth / perfil

| Método | Endpoint | Uso |
|--------|----------|-----|
| `api.register({ name, email, password })` | `POST /auth/register` | Cadastro |
| `api.login({ email, password })` | `POST /auth/login` | Login |
| `api.me()` | `GET /auth/me` | Usuário logado |
| `api.updateProfile(partial)` | `PUT /auth/profile` | Nome, avatar, tema, sidebar |

`updateProfile` aceita update **parcial**. Exemplos:

```js
api.updateProfile({ name: 'Novo Nome' })
api.updateProfile({ theme: 'ocean' })
api.updateProfile({ avatar: dataUrl })      // data:image/...
api.updateProfile({ avatar: null })         // remove foto
api.updateProfile({ sidebarCollapsed: true })
```

#### Contas

| Método | Endpoint |
|--------|----------|
| `api.getAccounts()` | `GET /accounts` |
| `api.createAccount({ name, type, balance })` | `POST /accounts` |
| `api.updateAccount(id, body)` | `PUT /accounts/:id` |
| `api.deleteAccount(id)` | `DELETE /accounts/:id` |

#### Categorias

| Método | Endpoint |
|--------|----------|
| `api.getCategories()` | `GET /categories` |
| `api.createCategory({ name, type })` | `POST /categories` |
| `api.updateCategory(id, body)` | `PUT /categories/:id` |
| `api.deleteCategory(id)` | `DELETE /categories/:id` |

`type`: `"income"` \| `"expense"`

#### Transações

| Método | Endpoint |
|--------|----------|
| `api.getTransactions()` | `GET /transactions` |
| `api.createTransaction({ type, description, amount, category, account, date })` | `POST /transactions` |
| `api.updateTransaction(id, body)` | `PUT /transactions/:id` |
| `api.deleteTransaction(id)` | `DELETE /transactions/:id` |

#### Caixinhas

| Método | Endpoint |
|--------|----------|
| `api.getCaixinhas()` | `GET /caixinhas` |
| `api.createCaixinha({ name, goalAmount })` | `POST /caixinhas` |
| `api.depositCaixinha(id, amount)` | `POST /caixinhas/:id/deposit` |
| `api.withdrawCaixinha(id, amount)` | `POST /caixinhas/:id/withdraw` |
| `api.deleteCaixinha(id)` | `DELETE /caixinhas/:id` |

### Onde cada página chama a API

| Página / componente | Chamadas principais |
|---------------------|---------------------|
| `Login.jsx` | `login`, `register` |
| `App.jsx` | `me` (boot) |
| `Dashboard.jsx` | `getTransactions` |
| `Despesas.jsx` | `getTransactions`, `getAccounts`, `getCategories`, `createTransaction` |
| `Transacoes.jsx` | `getTransactions`, `getAccounts`, `getCategories`, `updateTransaction`, `deleteTransaction` |
| `Contas.jsx` | `getAccounts`, `createAccount`, `updateAccount`, `deleteAccount` |
| `Categorias.jsx` | `getCategories`, `createCategory`, `updateCategory`, `deleteCategory` |
| `Caixinhas.jsx` | `getCaixinhas`, `createCaixinha`, `depositCaixinha`, `withdrawCaixinha`, `deleteCaixinha` |
| `Configuracoes.jsx` | `updateProfile` (nome, avatar, tema) |
| `Layout.jsx` | `updateProfile({ sidebarCollapsed })` |

### Temas (frontend)

Arquivo: `finance/src/themes.js`

| Função / export | Descrição |
|-----------------|-----------|
| `THEMES` | Lista de temas (id, nome, preview) |
| `THEME_VARS` | CSS variables por tema |
| `applyTheme(themeId)` | Aplica variáveis no `document.documentElement` |

Temas disponíveis: `violet`, `ocean`, `forest`, `amber`, `rose`, `slate`.

---

## Endpoints da API

Base: `http://localhost:3001/api`

### Público

| Método | Rota | Body |
|--------|------|------|
| `GET` | `/health` | — |
| `POST` | `/auth/register` | `{ name, email, password }` |
| `POST` | `/auth/login` | `{ email, password }` |

### Autenticado (Bearer JWT)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/auth/me` | Dados do usuário |
| `PUT` | `/auth/profile` | Atualiza preferências (parcial) |
| `GET/POST` | `/accounts` | Listar / criar |
| `PUT/DELETE` | `/accounts/:id` | Atualizar / excluir |
| `GET/POST` | `/categories` | Listar / criar |
| `PUT/DELETE` | `/categories/:id` | Atualizar / excluir |
| `GET/POST` | `/transactions` | Listar / criar |
| `PUT/DELETE` | `/transactions/:id` | Atualizar / excluir |
| `GET/POST` | `/caixinhas` | Listar / criar |
| `POST` | `/caixinhas/:id/deposit` | `{ amount }` |
| `POST` | `/caixinhas/:id/withdraw` | `{ amount }` |
| `DELETE` | `/caixinhas/:id` | Excluir (saldo deve ser 0) |

Todas as queries de dados são filtradas pelo `user_id` do token.

---

## Modelo de dados (SQLite)

Arquivo: `backend/src/db.js`

### `users`

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INTEGER PK | ID |
| `name` | TEXT | Nome |
| `email` | TEXT UNIQUE | E-mail |
| `password_hash` | TEXT | Senha (bcrypt) |
| `avatar` | TEXT | Data URL da foto (nullable) |
| `theme` | TEXT | Tema (`violet` padrão) |
| `sidebar_collapsed` | INTEGER | `0/1` preferência da sidebar |
| `created_at` | TEXT | Data de criação |

### `accounts`

`id`, `user_id`, `name`, `type`, `balance`, `created_at`

### `categories`

`id`, `user_id`, `name`, `type` (`income`/`expense`), `created_at`

### `transactions`

`id`, `user_id`, `type`, `description`, `amount`, `category`, `account`, `date`, `created_at`

### `caixinhas`

`id`, `user_id`, `name`, `goal_amount`, `current_amount`, `created_at`

---

## Temas e preferências

Preferências persistidas por usuário:

1. **Tema** → `users.theme`
2. **Avatar** → `users.avatar`
3. **Nome** → `users.name`
4. **Sidebar recolhida** → `users.sidebar_collapsed`

No login / `me`, o frontend aplica o tema com `applyTheme(user.theme)` e restaura a sidebar.

---

## Variáveis de ambiente

### Backend (`backend/.env`)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3001` | Porta da API |
| `JWT_SECRET` | (obrigatório em prod) | Segredo do JWT |
| `CORS_ORIGIN` | liberado em dev | Origem CORS (opcional) |

Exemplo:

```env
PORT=3001
JWT_SECRET=troque-este-segredo-em-producao
```

### Frontend (`finance/.env`)

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | URL base da API. Se vazio, usa `http://<hostname>:3001/api` |

Exemplo local explícito:

```env
VITE_API_URL=http://localhost:3001/api
```

---

## Observações

- O projeto **não usa mais Firebase**.
- Dados e preferências ficam em SQLite local (`backend/data/finance.db`).
- Para produção futura (ex.: AWS), o desenho atual (SPA + API REST + banco) já está preparado para migração (trocar SQLite por RDS/DynamoDB e hospedar front em S3/CloudFront).
