const express = require('express');
const inventariosController = require('../controllers/inventariosController');
const authenticationMiddleware = require('../middleware/authenticationMiddleware');

const router = express.Router();

router.use(authenticationMiddleware.verifyToken);

// Rutas protegidas para inventarios
router.post('/', inventariosController.createInventario);
router.get('/', inventariosController.listInventarios);
router.put('/:id', inventariosController.editInventario);

module.exports = router;
