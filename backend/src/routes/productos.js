const express = require('express');
const router = express.Router();
const { 
    getProductos, 
    getProductoById, 
    addProducto, 
    updateProducto, 
    deleteProducto, 
    incrementarStock, 
    decrementarStock,
    productosConBajoStock 
} = require('../controllers/productosController');

router.get('/listar', getProductos);
router.get('/listar/:id', getProductoById);
router.get('/bajo-stock', productosConBajoStock)
router.post('/anadir', addProducto);
router.put('/editar/:id', updateProducto);
router.delete('/eliminar/:id', deleteProducto);
router.patch('/:id/incrementar', incrementarStock);
router.patch('/:id/decrementar', decrementarStock);

module.exports = router;