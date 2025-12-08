const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../db');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  const hash = await bcrypt.hash(password, 10);
  await pool.execute(
    'INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)',
    [name, email, hash]
  );
  res.json({ ok: true, message: 'Usuario registrado' });
});

// Login (modal del frontend)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.execute('SELECT * FROM users WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Usuario no encontrado' });

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

  res.json({ ok: true, message: 'Sesión iniciada', user: { id: user.id, email: user.email } });
});

module.exports = router;
