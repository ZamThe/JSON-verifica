const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'mi_aplicacion_db',
});

// Middleware para verificar el token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send('Acceso denegado');

  try {
    const decoded = jwt.verify(token, 'secreto_jwt');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Token no válido');
  }
};

// Servicio de creación de usuarios
app.post('/usuarios', async (req, res) => {
  try {
    const { email, password, rol } = req.body;

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const usuario = { email, password: hashedPassword, rol };

    // Simulación de inserción en MySQL utilizando un pool de conexiones
    db.execute('INSERT INTO usuarios (email, password, rol) VALUES (?, ?, ?)', [email, hashedPassword, rol], (err, result) => {
      if (err) {
        console.error('Error al insertar usuario en MySQL:', err);
        res.status(500).send('Error en el servidor');
      } else {
        res.send('Usuario creado exitosamente');
      }
    });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Servicio de autenticación
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Simulación de búsqueda en MySQL
    db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Error al buscar usuario en MySQL:', err);
        res.status(500).send('Error en el servidor');
      } else {
        const usuario = results[0];

        if (usuario) {
          // Verificar la contraseña
          const match = await bcrypt.compare(password, usuario.password);

          if (match) {
            // Generar y enviar token
            const token = jwt.sign({ email, rol: usuario.rol }, 'secreto_jwt', {
              expiresIn: '1h',
            });
            res.json({ token });
          } else {
            res.status(401).send('Credenciales incorrectas');
          }
        } else {
          res.status(404).send('Usuario no encontrado');
        }
      }
    });
  } catch (error) {
    res.status(500).send('Error en el servidor');
  }
});

// Rutas protegidas
app.get('/inventarios', verifyToken, (req, res) => {
  const { rol } = req.user;

  if (rol === 'administrador') {
    res.send('<h1>Listado de inventarios para administradores</h1>');
  } else if (rol === 'docente') {
    res.send('<h1>Listado de inventarios para docentes</h1>');
  } else {
    res.status(403).send('Acceso denegado');
  }
});

// ...

// Ruta por defecto
app.get('/', (req, res) => {
  res.send('<h1>Bienvenido a la aplicación</h1>');
});

// ...

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en ejecución en el puerto ${PORT}`));

