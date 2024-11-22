const express = require('express');
const { getVentas, addVenta, updateVenta, deleteVenta, getVentaById } = require('../controllers/ventasController');
const router = express.Router();

router.get('/', getVentas);
router.get('/:id', getVentaById); 
router.post('/anadir', addVenta);
router.put('/editar/:id', updateVenta); 
router.delete('/eliminar/:id', deleteVenta); 

module.exports = router;