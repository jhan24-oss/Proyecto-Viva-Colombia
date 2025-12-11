const express = require('express');
const cors = require('cors');
const path = require('path');

const usuariosRoutes = require('./routes/usuarios');
const reservasRoutes = require('./routes/reservas');
const contactRoutes = require('./routes/contact');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Servir frontend estático (incluye admin.html)
app.use(express.static(path.join(__dirname, '..', 'FRONTEND')));

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Viva Colombia funcionando' });
});

// Manejo global de errores no capturados para evitar que nodemon termine
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Middleware centralizado de errores para peticiones Express
app.use((err, req, res, next) => {
  console.error('Error en request:', err && err.stack ? err.stack : err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Esperar a que la DB esté lista antes de escuchar
(async () => {
  try {
    await db.ready;
    console.log('Inicialización de base de datos completada, arrancando servidor...');
    // Esperar a que la base de datos esté lista antes de arrancar

    // Iniciar servidor incluso si la DB no queda lista; las rutas deben manejar la falta de DB.
    (async () => {
      try {
        await db.ready; // espera a que intente inicializar/importar
      } catch (err) {
        // db.ready internamente captura errores; no forzamos exit
        console.error('Error durante la inicialización de la DB (continuando arranque):', err && err.stack ? err.stack : err);
      }

      const server = app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log('Estado DB disponible:', db.isReady());
      });

      // Endpoint simple para verificar estado en tiempo real
      app.get('/api/status', (req, res) => {
        res.json({ ok: true, dbReady: db.isReady() });
      });
    })();
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err && err.stack ? err.stack : err);
    process.exit(1);
  }
})();
