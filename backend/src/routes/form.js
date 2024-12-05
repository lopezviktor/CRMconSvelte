const express = require('express');
const { guardarContacto } = require('../controllers/formController');
const router = express.Router();

// Ruta para guardar los datos del formulario de contacto
router.post('/enviar', guardarContacto);

module.exports = router;