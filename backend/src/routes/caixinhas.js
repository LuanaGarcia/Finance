import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

function mapCaixinha(row) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    name: row.name,
    goalAmount: row.goal_amount,
    currentAmount: row.current_amount,
    createdAt: row.created_at,
  };
}

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM caixinhas WHERE user_id = ? ORDER BY created_at DESC')
    .all(req.user.id);
  res.json(rows.map(mapCaixinha));
});

router.post('/', (req, res) => {
  const { name, goalAmount } = req.body || {};
  if (!name?.trim() || goalAmount === undefined) {
    return res.status(400).json({ error: 'Nome e meta são obrigatórios.' });
  }

  const result = db
    .prepare('INSERT INTO caixinhas (user_id, name, goal_amount, current_amount) VALUES (?, ?, ?, 0)')
    .run(req.user.id, name.trim(), Number(goalAmount));

  const row = db.prepare('SELECT * FROM caixinhas WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(mapCaixinha(row));
});

router.post('/:id/deposit', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM caixinhas WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Caixinha não encontrada.' });
  }

  const amount = Number(req.body?.amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Informe um valor válido.' });
  }

  const newBalance = existing.current_amount + amount;
  db.prepare('UPDATE caixinhas SET current_amount = ? WHERE id = ?').run(newBalance, existing.id);

  const row = db.prepare('SELECT * FROM caixinhas WHERE id = ?').get(existing.id);
  res.json(mapCaixinha(row));
});

router.post('/:id/withdraw', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM caixinhas WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Caixinha não encontrada.' });
  }

  const amount = Number(req.body?.amount);
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Informe um valor válido.' });
  }

  if (amount > existing.current_amount) {
    return res.status(400).json({ error: 'Saldo insuficiente na caixinha.' });
  }

  const newBalance = existing.current_amount - amount;
  db.prepare('UPDATE caixinhas SET current_amount = ? WHERE id = ?').run(newBalance, existing.id);

  const row = db.prepare('SELECT * FROM caixinhas WHERE id = ?').get(existing.id);
  res.json(mapCaixinha(row));
});

router.delete('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM caixinhas WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Caixinha não encontrada.' });
  }

  if (existing.current_amount > 0) {
    return res.status(400).json({ error: 'Resgate todo o dinheiro antes de excluir a caixinha.' });
  }

  db.prepare('DELETE FROM caixinhas WHERE id = ?').run(existing.id);
  res.status(204).send();
});

export default router;
