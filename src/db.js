const mysql = require('mysql2');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Reemplaza con tu nombre de usuario de MySQL
  password: '',  // Reemplaza con tu contraseña de MySQL
  database: 'mi_aplicacion_db',  // Reemplaza con el nombre real de tu base de datos
});

module.exports = db;
