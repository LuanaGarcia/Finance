# Finance Backend

API REST com Express + SQLite (JWT).

## Como rodar

```bash
cd backend
npm install
npm run dev
```

API em `http://localhost:3001`.

## Endpoints

- `POST /api/auth/register` — cadastrar
- `POST /api/auth/login` — login
- `GET /api/auth/me` — usuário autenticado
- `GET|POST /api/accounts` / `PUT|DELETE /api/accounts/:id`
- `GET|POST /api/categories` / `PUT|DELETE /api/categories/:id`
- `GET|POST /api/transactions` / `PUT|DELETE /api/transactions/:id`
- `GET|POST /api/caixinhas`
- `POST /api/caixinhas/:id/deposit`
- `POST /api/caixinhas/:id/withdraw`
- `DELETE /api/caixinhas/:id`

Banco local em `data/finance.db`.
