const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Config via environment variables with sensible defaults
const {
  DB_HOST = 'localhost',
  DB_USER = 'viva_user',
  DB_PASSWORD = '3114587981_Jh',
  DB_NAME = 'viva_colombia',
  DB_PORT = 3307
} = process.env;

const schemaPath = path.join(__dirname, '..', 'database.sql');

let pool = null;
let isReady = false;

const ready = (async () => {
  try {
    // Try to create a pool using the configured database
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      multipleStatements: true
    });

    await pool.query('SELECT 1');
    isReady = true;
    console.log(`Conexión exitosa a MySQL://${DB_HOST}:${DB_PORT}/${DB_NAME}`);
  } catch (err) {
    console.error('No se pudo conectar a la base de datos especificada:', err && err.message ? err.message : err);
    // Try to connect without database and run the schema SQL to create it
    try {
      const tmpConn = await mysql.createConnection({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        port: DB_PORT,
        multipleStatements: true
      });
      console.log('Conectado al servidor MySQL. Ejecutando schema SQL para crear la base de datos...');
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await tmpConn.query(sql);
      await tmpConn.end();

      // recreate pool pointing to the newly created database
      pool = mysql.createPool({
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
      });
      await pool.query('SELECT 1');
      isReady = true;
      console.log('Base de datos inicializada e importada correctamente.');
    } catch (err2) {
      console.error('Error inicializando la base de datos:', err2 && err2.message ? err2.message : err2);
      pool = null;
    }
  }
})();

module.exports = {
  ready,
  isReady: () => isReady,
  query: async (...args) => {
    await ready;
    if (!pool) throw new Error('Pool de base de datos no inicializado');
    return pool.query(...args);
  },
  execute: async (...args) => {
    await ready;
    if (!pool) throw new Error('Pool de base de datos no inicializado');
    return pool.execute(...args);
  }
};
