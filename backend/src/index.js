import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import accountsRoutes from './routes/accounts.js';
import categoriesRoutes from './routes/categories.js';
import transactionsRoutes from './routes/transactions.js';
import caixinhasRoutes from './routes/caixinhas.js';
import './db.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: '2mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/caixinhas', caixinhasRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em http://localhost:${PORT}`);
  console.log(`API na rede: http://<seu-ip>:${PORT}`);
});
