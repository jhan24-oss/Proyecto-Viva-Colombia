const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Reservar destino
router.post('/destino', async (req, res) => {
  const { usuario_id, destino, fecha, categoria, aerolinea, total_cop, metodo_pago } = req.body;
  await db.query(
    'INSERT INTO reservas_destinos (usuario_id, destino, fecha, categoria, aerolinea, total_cop, metodo_pago) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [usuario_id, destino, fecha, categoria, aerolinea, total_cop, metodo_pago]
  );
  res.json({ ok: true, mensaje: 'Reserva de destino creada' });
});

// Reservar alojamiento
router.post('/alojamiento', async (req, res) => {
  const { usuario_id, alojamiento, ubicacion, check_in, check_out, huespedes, total_cop, metodo_pago } = req.body;
  await db.query(
    'INSERT INTO reservas_alojamientos (usuario_id, alojamiento, ubicacion, check_in, check_out, huespedes, total_cop, metodo_pago) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [usuario_id, alojamiento, ubicacion, check_in, check_out, huespedes, total_cop, metodo_pago]
  );
  res.json({ ok: true, mensaje: 'Reserva de alojamiento creada' });
});

// Listar reservas de destino
router.get('/destinos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT r.*, u.nombre AS usuario_nombre, u.email AS usuario_email FROM reservas_destinos r LEFT JOIN usuarios u ON u.id = r.usuario_id ORDER BY r.created_at DESC');
    res.json({ ok: true, reservas: rows });
  } catch (err) {
    console.error('Error listando reservas destinos', err);
    res.status(500).json({ error: 'Error listando reservas destinos' });
  }
});

// Listar reservas de alojamiento
router.get('/alojamientos', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT r.*, u.nombre AS usuario_nombre, u.email AS usuario_email FROM reservas_alojamientos r LEFT JOIN usuarios u ON u.id = r.usuario_id ORDER BY r.created_at DESC');
    res.json({ ok: true, reservas: rows });
  } catch (err) {
    console.error('Error listando reservas alojamientos', err);
    res.status(500).json({ error: 'Error listando reservas alojamientos' });
  }
});

module.exports = router;
