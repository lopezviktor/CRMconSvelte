const express = require('express');
const router = express.Router();
const { getProductos, addProducto, updateProducto, deleteProducto } = require('../controllers/productosController');

router.get('/', getProductos);
router.post('/', addProducto);
router.put('/:id', updateProducto);
router.delete('/:id', deleteProducto);

module.exports = router;