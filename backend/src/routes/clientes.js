const express = require('express');
const {
    getClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    getClienteById,
    clientesPorMes,
    dineroGastado,
} = require('../controllers/clientesController');
const router = express.Router();

router.get('/listar', getClientes); 
router.get('/registradosPorMes', clientesPorMes); 
router.get('/dineroGastado', dineroGastado); 
router.get('/:id', getClienteById); 
router.post('/anadir', addCliente); 
router.put('/editar/:id', updateCliente); 
router.delete('/eliminar/:id', deleteCliente); 

module.exports = router;