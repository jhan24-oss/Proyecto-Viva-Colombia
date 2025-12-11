const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// Registro
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  console.log('POST /register payload:', { nombre, email });
  try {
    if (!nombre || !email || !password) {
      console.warn('Registro: faltan datos');
      return res.status(400).json({ error: 'Faltan datos' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)', [nombre, email, hash]);
    const usuarioId = result && result.insertId ? result.insertId : null;
    const response = { ok: true, mensaje: 'Usuario registrado', usuario: { id: usuarioId, nombre, email } };
    console.log('Registro result:', response);
    res.json(response);
  } catch (err) {
    console.error('Error en registro usuario:', err && err.stack ? err.stack : err);
    res.status(500).json({ error: 'Error registrando usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.query('SELECT * FROM usuarios WHERE email=?', [email]);
  if (!rows.length) return res.status(401).json({ error: 'Usuario no encontrado' });

  const usuario = rows[0];
  const match = await bcrypt.compare(password, usuario.password);
  if (!match) return res.status(401).json({ error: 'Credenciales inválidas' });

  res.json({ ok: true, mensaje: 'Sesión iniciada', usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } });
});

// Listar usuarios (sin password) - uso administrativo
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, email, estado, fecha_creacion FROM usuarios ORDER BY id DESC');
    res.json({ ok: true, usuarios: rows });
  } catch (err) {
    console.error('Error listando usuarios', err);
    res.status(500).json({ error: 'Error listando usuarios' });
  }
});

module.exports = router;
