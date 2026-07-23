import { Router } from 'express';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();
router.use(authRequired);

function mapCategory(row) {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    name: row.name,
    type: row.type,
    createdAt: row.created_at,
  };
}

router.get('/', (req, res) => {
  const rows = db
    .prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC')
    .all(req.user.id);
  res.json(rows.map(mapCategory));
});

router.post('/', (req, res) => {
  const { name, type } = req.body || {};
  if (!name?.trim() || !['income', 'expense'].includes(type)) {
    return res.status(400).json({ error: 'Nome e tipo válidos são obrigatórios.' });
  }

  const result = db
    .prepare('INSERT INTO categories (user_id, name, type) VALUES (?, ?, ?)')
    .run(req.user.id, name.trim(), type);

  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(mapCategory(row));
});

router.put('/:id', (req, res) => {
  const existing = db
    .prepare('SELECT * FROM categories WHERE id = ? AND user_id = ?')
    .get(req.params.id, req.user.id);

  if (!existing) {
    return res.status(404).json({ error: 'Categoria não encontrada.' });
  }

  const { name, type } = req.body || {};
  const nextType = type && ['income', 'expense'].includes(type) ? type : existing.type;

  db.prepare('UPDATE categories SET name = ?, type = ? WHERE id = ?').run(
    name?.trim() || existing.name,
    nextType,
    existing.id
  );

  const row = db.prepare('SELECT * FROM categories WHERE id = ?').get(existing.id);
  res.json(mapCategory(row));
});

router.delete('/:id', (req, res) => {
  const result = db
    .prepare('DELETE FROM categories WHERE id = ? AND user_id = ?')
    .run(req.params.id, req.user.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Categoria não encontrada.' });
  }
  res.status(204).send();
});

export default router;
