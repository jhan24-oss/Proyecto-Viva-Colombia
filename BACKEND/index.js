const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const destinationsRoutes = require('./routes/destinations');
const accommodationsRoutes = require('./routes/accommodations');
const reservationsRoutes = require('./routes/reservations');
const contactRoutes = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ ok: true, message: 'Viva Colombia API' }));

app.use('/api/auth', authRoutes);
app.use('/api/destinations', destinationsRoutes);
app.use('/api/accommodations', accommodationsRoutes);
app.use('/api/reservations', reservationsRoutes);
app.use('/api/contact', contactRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
