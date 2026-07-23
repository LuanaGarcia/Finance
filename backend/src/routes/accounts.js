import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

function mapAccount(row) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    name: row.name,
    type: row.type,
    balance: row.balance,
    createdAt: row.created_at,
  };
}

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM accounts WHERE user_id = ? ORDER BY name ASC')
    .all(req.user.id);
  res.json(rows.map(mapAccount));
});

router.post('/', (req, res) => {
  const { name, type, balance } = req.body || {};
  if (!name?.trim() || !type) {
    return res.status(400).json({ error: 'Nome e tipo são obrigatórios.' });
  }

  const result = db
    .prepare('INSERT INTO accounts (user_id, name, type, balance) VALUES (?, ?, ?, ?)')
    .run(req.user.id, name.trim(), type, Number(balance) || 0);

  const row = db.prepare('SELECT * FROM accounts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(mapAccount(row));
});

router.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM accounts WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Conta não encontrada.' });
  }

  const { name, type, balance } = req.body || {};
  db.prepare('UPDATE accounts SET name = ?, type = ?, balance = ? WHERE id = ?').run(
    name?.trim() || existing.name,
    type || existing.type,
    balance !== undefined ? Number(balance) : existing.balance,
    existing.id
  );

  const row = db.prepare('SELECT * FROM accounts WHERE id = ?').get(existing.id);
  res.json(mapAccount(row));
});

router.delete('/:id', (req, res) => {
  const result = db
    .prepare('DELETE FROM accounts WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Conta não encontrada.' });
  }
  res.status(204).send();
});

export default router;
