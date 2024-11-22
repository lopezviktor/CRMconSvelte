const express = require('express');
const { getClientes, addCliente, updateCliente, deleteCliente, getClienteById } = require('../controllers/clientesController');
const router = express.Router();

router.get('/listar', getClientes);
router.get('/:id', getClienteById);
router.post('/anadir', addCliente);
router.put('/editar/:id', updateCliente); 
router.delete('/eliminar/:id', deleteCliente); 

module.exports = router;