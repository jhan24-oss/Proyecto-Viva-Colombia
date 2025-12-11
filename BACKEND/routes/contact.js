const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/', async (req, res) => {
  const { nombre, email, telefono, asunto, mensaje } = req.body;
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  await db.query(
    'INSERT INTO contactos (nombre, email, telefono, asunto, mensaje) VALUES (?, ?, ?, ?, ?)',
    [nombre, email, telefono || null, asunto || null, mensaje]
  );
  res.json({ ok: true, mensaje: 'Mensaje enviado con éxito' });
});

// Listar mensajes de contacto
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, nombre, email, telefono, asunto, mensaje, created_at FROM contactos ORDER BY created_at DESC');
    res.json({ ok: true, contactos: rows });
  } catch (err) {
    console.error('Error listando contactos', err);
    res.status(500).json({ error: 'Error listando contactos' });
  }
});

module.exports = router;
