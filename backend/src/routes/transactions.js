import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

function mapTransaction(row) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    type: row.type,
    description: row.description,
    amount: row.amount,
    category: row.category,
    account: row.account,
    date: row.date,
    createdAt: row.created_at,
  };
}

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC, id DESC')
    .all(req.user.id);
  res.json(rows.map(mapTransaction));
});

router.post('/', (req, res) => {
  const { type, description, amount, category, account, date } = req.body || {};

  if (!['income', 'expense'].includes(type) || !description?.trim() || amount === undefined || !category || !account || !date) {
    return res.status(400).json({ error: 'Dados da transação incompletos.' });
  }

  const result = db
    .prepare(
      `INSERT INTO transactions (user_id, type, description, amount, category, account, date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(req.user.id, type, description.trim(), Number(amount), category, account, date);

  const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(mapTransaction(row));
});

router.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Transação não encontrada.' });
  }

  const { type, description, amount, category, account, date } = req.body || {};
  const nextType = type && ['income', 'expense'].includes(type) ? type : existing.type;

  db.prepare(
    `UPDATE transactions
     SET type = ?, description = ?, amount = ?, category = ?, account = ?, date = ?
     WHERE id = ?`
  ).run(
    nextType,
    description?.trim() || existing.description,
    amount !== undefined ? Number(amount) : existing.amount,
    category || existing.category,
    account || existing.account,
    date || existing.date,
    existing.id
  );

  const row = db.prepare('SELECT * FROM transactions WHERE id = ?').get(existing.id);
  res.json(mapTransaction(row));
});

router.delete('/:id', (req, res) => {
  const result = db
    .prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Transação não encontrada.' });
  }
  res.status(204).send();
});

export default router;
