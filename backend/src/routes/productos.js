const express = require('express');
const router = express.Router();
const { 
    getProductos, 
    getProductoById, 
    addProducto, 
    updateProducto, 
    deleteProducto, incrementarStock, decrementarStock } = require('../controllers/productosController');

router.get('/listar', getProductos);
router.get('/listar/:id', getProductoById);
router.post('/anadir', addProducto);
router.put('/editar/:id', updateProducto);
router.delete('/eliminar/:id', deleteProducto);
router.patch('/:id/incrementar', incrementarStock);
router.patch('/:id/decrementar', decrementarStock);

module.exports = router;