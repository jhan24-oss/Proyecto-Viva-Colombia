const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Registro
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  const hash = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hash]);
  res.json({ ok: true, mensaje: 'Usuario registrado' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Usuario no encontrado' });

  const usuario = rows[0];
  const match = await bcrypt.compare(password, usuario.password);
  if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

  res.json({ ok: true, mensaje: 'Sesión iniciada', usuario: { id: usuario.id, email: usuario.email } });
});

module.exports = router;
