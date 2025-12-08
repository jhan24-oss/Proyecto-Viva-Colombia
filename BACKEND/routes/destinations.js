const express = require('express');
const router = express.Router();
const pool = require('../db');

// Lista de destinos (para la sección "Destinos" del frontend)
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM destinos');
  res.json(rows);
});

// Crear destino (solo para administración)
router.post('/', async (req, res) => {
  const { name, city } = req.body;
  if (!name || !city) return res.status(400).json({ error: 'Faltan datos' });
  await pool.execute('INSERT INTO destinos (name, city) VALUES (?, ?)', [name, city]);
  res.json({ ok: true, message: 'Destino agregado' });
});

module.exports = router;
