const express = require('express');
const router = express.Router();
const pool = require('../db');

// Reservar destino (flujo del modal #reserva)
router.post('/destino', async (req, res) => {
  const { destino, fecha, categoria, aerolinea, total_cop, metodo_pago, email_contacto } = req.body;
  if (!destino || !fecha || !categoria || !aerolinea || !metodo_pago) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  await pool.execute(
    'INSERT INTO reservas_destinos (destino, fecha, categoria, aerolinea, total_cop, metodo_pago, email_contacto) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [destino, fecha, categoria, aerolinea, total_cop || 0, metodo_pago, email_contacto || null]
  );
  res.json({ ok: true, message: 'Reserva de destino creada' });
});

// Reservar alojamiento (flujo del modal #reservaAlojamiento)
router.post('/alojamiento', async (req, res) => {
  const { alojamiento, ubicacion, precio_noche, check_in, check_out, noches, huespedes, total_cop, metodo_pago, email_contacto } = req.body;
  if (!alojamiento || !ubicacion || !check_in || !check_out || !metodo_pago) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  await pool.execute(
    'INSERT INTO reservas_alojamientos (alojamiento, ubicacion, precio_noche, check_in, check_out, noches, huespedes, total_cop, metodo_pago, email_contacto) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [alojamiento, ubicacion, precio_noche, check_in, check_out, noches || 0, huespedes || 1, total_cop || 0, metodo_pago, email_contacto || null]
  );
  res.json({ ok: true, message: 'Reserva de alojamiento creada' });
});

module.exports = router;
