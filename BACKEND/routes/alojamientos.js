const express = require('express');
const router = express.Router();
const pool = require('../db');

// Reservar alojamiento
router.post('/alojamiento', async (req, res) => {
  try {
    const { alojamiento_id, usuario_id, check_in, check_out, huespedes, total_cop, metodo_pago } = req.body;
    if (!alojamiento_id || !usuario_id || !check_in || !check_out || !metodo_pago) {
      return res.status(400).json({ error: 'Faltan datos' });
    }

    await pool.execute(
      'INSERT INTO alojamientos_reservas (alojamiento_id, usuario_id, check_in, check_out, huespedes, total_cop, metodo_pago) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [alojamiento_id, usuario_id, check_in, check_out, huespedes || 1, total_cop || 0, metodo_pago]
    );

    res.json({ ok: true, message: 'Reserva de alojamiento creada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al guardar la reserva de alojamiento' });
  }
});

module.exports = router;
