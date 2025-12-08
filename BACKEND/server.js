const express = require('express');
const cors = require('cors');

const usuariosRoutes = require('./routes/usuarios');
const reservasRoutes = require('./routes/reservas');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Viva Colombia funcionando' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
