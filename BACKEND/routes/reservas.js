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

module.exports = router;
