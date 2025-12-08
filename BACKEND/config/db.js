const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'viva_user',       // tu usuario MySQL
  password: '3114587981_$Jh',       // tu contraseña MySQL
  database: 'viva_colombia'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a MySQL');
});

module.exports = connection.promise();
