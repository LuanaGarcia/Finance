import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

const ALLOWED_THEMES = ['violet', 'ocean', 'forest', 'amber', 'rose', 'slate'];

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function getUserById(id) {
  return db
    .prepare('SELECT id, name, email, avatar, theme, sidebar_collapsed FROM users WHERE id = ?')
    .get(id);
}

function publicUser(user) {
  return {
    uid: String(user.id),
    id: user.id,
    email: user.email,
    name: user.name,
    avatar: user.avatar || null,
    theme: user.theme || 'violet',
    sidebarCollapsed: Boolean(user.sidebar_collapsed),
  };
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email.trim().toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'Este e-mail já está em uso.' });
  }

  const passwordHash = bcrypt.hashSync(password, 10);
  const result = db
    .prepare('INSERT INTO users (name, email, password_hash, theme, sidebar_collapsed) VALUES (?, ?, ?, ?, 0)')
    .run(name.trim(), email.trim().toLowerCase(), passwordHash, 'violet');

  const user = getUserById(result.lastInsertRowid);
  const token = signToken(user);

  return res.status(201).json({ token, user: publicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email?.trim() || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  const user = db
    .prepare(
      'SELECT id, name, email, avatar, theme, sidebar_collapsed, password_hash FROM users WHERE email = ?'
    )
    .get(email.trim().toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
  }

  const token = signToken(user);
  return res.json({ token, user: publicUser(user) });
});

router.get('/me', authRequired, (req, res) => {
  const user = getUserById(req.user.id);
  if (!user) {
    return res.status(401).json({ error: 'Usuário não encontrado.' });
  }
  return res.json({ user: publicUser(user) });
});

router.put('/profile', authRequired, (req, res) => {
  const existing = getUserById(req.user.id);
  if (!existing) {
    return res.status(401).json({ error: 'Usuário não encontrado.' });
  }

  const { name, avatar, theme, sidebarCollapsed } = req.body || {};

  let nextName = existing.name;
  let nextAvatar = existing.avatar;
  let nextTheme = existing.theme || 'violet';
  let nextSidebarCollapsed = existing.sidebar_collapsed ? 1 : 0;

  if (typeof name === 'string') {
    if (!name.trim()) {
      return res.status(400).json({ error: 'Informe um nome válido.' });
    }
    nextName = name.trim();
  }

  if (theme !== undefined) {
    if (!ALLOWED_THEMES.includes(theme)) {
      return res.status(400).json({ error: 'Tema inválido.' });
    }
    nextTheme = theme;
  }

  if (avatar !== undefined) {
    if (avatar === null || avatar === '') {
      nextAvatar = null;
    } else if (typeof avatar === 'string') {
      if (!avatar.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Avatar inválido.' });
      }
      if (avatar.length > 1_500_000) {
        return res.status(400).json({ error: 'Imagem muito grande. Use até ~1MB.' });
      }
      nextAvatar = avatar;
    } else {
      return res.status(400).json({ error: 'Avatar inválido.' });
    }
  }

  if (typeof sidebarCollapsed === 'boolean') {
    nextSidebarCollapsed = sidebarCollapsed ? 1 : 0;
  }

  db.prepare(
    'UPDATE users SET name = ?, avatar = ?, theme = ?, sidebar_collapsed = ? WHERE id = ?'
  ).run(nextName, nextAvatar, nextTheme, nextSidebarCollapsed, req.user.id);

  const user = getUserById(req.user.id);
  return res.json({ user: publicUser(user) });
});

export default router;
