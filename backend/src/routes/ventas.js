const express = require('express');
const { getVentas, addVenta, updateVenta, deleteVenta, getVentaById, getProductosMasVendidos } = require('../controllers/ventasController');
const router = express.Router();

router.get('/listar', getVentas);
router.get('/:id', getVentaById); 
router.post('/anadir', addVenta);
router.put('/editar/:id', updateVenta); 
router.delete('/eliminar/:id', deleteVenta); 
router.get('/reportes/mas-vendidos', getProductosMasVendidos);

module.exports = router;