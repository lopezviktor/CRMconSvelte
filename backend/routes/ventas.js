// routes/ventas.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint para obtener todas las ventas junto con los detalles y nombres de los productos
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT v.idVenta, v.idCliente, v.fecha, dv.idProducto, dv.cantidad, dv.subtotal, p.nombre AS nombre_producto
            FROM ventas v
            JOIN detalles_venta dv ON v.idVenta = dv.idVenta
            JOIN productos p ON dv.idProducto = p.idProducto
        `);

        // Organizar las ventas por idVenta y calcular los totales
        const ventasMap = rows.reduce((ventas, row) => {
            if (!ventas[row.idVenta]) {
                ventas[row.idVenta] = {
                    idVenta: row.idVenta,
                    idCliente: row.idCliente,
                    fecha: row.fecha,
                    productos: [],
                    cantidad_total: 0,
                    precio_total: 0
                };
            }

            // Agregar el producto a la venta
            ventas[row.idVenta].productos.push({
                idProducto: row.idProducto,
                nombre: row.nombre_producto,
                cantidad: row.cantidad,
                subtotal: row.subtotal
            });

            // Actualizar los totales asegurando que son números
            ventas[row.idVenta].cantidad_total += Number(row.cantidad);
            ventas[row.idVenta].precio_total += Number(row.subtotal);

            return ventas;
        }, {});

        // Convertir el objeto en un array y calcular el precio medio
        const ventasArray = Object.values(ventasMap).map(venta => ({
            ...venta,
            precio_medio: venta.cantidad_total > 0 
                ? (venta.precio_total / venta.cantidad_total).toFixed(2) 
                : 0,
            precio_total: venta.precio_total.toFixed(2), // Asegura que precio_total esté formateado como número con decimales
        }));

        res.json(ventasArray);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener las ventas' });
    }
});

module.exports = router;