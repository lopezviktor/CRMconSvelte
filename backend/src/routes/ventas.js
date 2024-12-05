const express = require('express');
const { 
    getVentas, 
    addVenta, 
    updateVenta, 
    deleteVenta, 
    getVentaById, 
    getProductosMasVendidos,
    ventasDelDia,
    ultimasVentas,
    cantidadVentasMes,
    cantidadProductosVendidosMes
} = require('../controllers/ventasController');
const router = express.Router();

router.post('/anadir', addVenta);
router.put('/editar/:id', updateVenta); 
router.delete('/eliminar/:id', deleteVenta); 
router.get('/reportes/mas-vendidos', getProductosMasVendidos);
router.get('/ventas-dia', ventasDelDia);
router.get('/ultimas-ventas', ultimasVentas);
router.get('/reportes/ventas-mes', cantidadVentasMes);
router.get('/reportes/productos-vendidos-mes', cantidadProductosVendidosMes);
router.get('/listar', getVentas);
router.get('/:id', getVentaById); 

/* OJO CON EL ORDEN, 
*   1.	Rutas específicas primero: Coloca las rutas con nombres fijos o parámetros más definidos antes.
*   2.	Rutas dinámicas al final: Las rutas como /:id deben ir al final, ya que son genéricas y pueden coincidir con cualquier cosa.
*/

module.exports = router;