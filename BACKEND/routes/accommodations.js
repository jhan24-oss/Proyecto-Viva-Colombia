const express = require('express');
const router = express.Router();
const pool = require('../db');

// Lista de alojamientos (Hoteles, Cabañas, Glamping)
router.get('/', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM alojamientos');
  res.json(rows);
});

// Crear alojamiento
router.post('/', async (req, res) => {
  const { name, location, price, type, description } = req.body;
  if (!name || !location || !price || !type) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  await pool.execute(
    'INSERT INTO alojamientos (name, location, price, type, description) VALUES (?, ?, ?, ?, ?)',
    [name, location, price, type, description || '']
  );
  res.json({ ok: true, message: 'Alojamiento agregado' });
});

module.exports = router;
