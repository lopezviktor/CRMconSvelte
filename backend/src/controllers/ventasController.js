const db = require('../../db');

// Obtener todas las ventas con detalles
const getVentas = async (req, res) => {
    try {
        const [ventasGenerales] = await db.query(`
            SELECT v.idVenta, v.fecha, c.nombre AS cliente, SUM(dv.subtotal) AS total
            FROM ventas v
            JOIN clientes c ON v.idCliente = c.idCliente
            JOIN detalles_venta dv ON v.idVenta = dv.idVenta
            GROUP BY v.idVenta
        `);

        // Obtener los detalles de las ventas
        const [detalles] = await db.query(`
            SELECT dv.idVenta, dv.idProducto, p.nombre AS producto, dv.cantidad, dv.subtotal
            FROM detalles_venta dv
            JOIN productos p ON dv.idProducto = p.idProducto
        `);

        // Combinar ventas generales con sus detalles
        const ventasConDetalles = ventasGenerales.map((venta) => ({
            ...venta,
            productos: detalles.filter((detalle) => detalle.idVenta === venta.idVenta),
        }));

        res.json(ventasConDetalles);
    } catch (error) {
        console.error('Error al obtener ventas con detalles:', error);
        res.status(500).json({ message: 'Error al obtener ventas con detalles.' });
    }
};

//Obtener una venta por su id
const getVentaById = async (req, res) => {
    const {id} = req.params;

    if (!id) {
        return res.status(400).json ({message: 'ID del cliente es obligatorio'});
    }
    try {
        const [rows] = await db.query('SELECT * FROM ventas WHERE idVenta = ?', [id]);
        if (venta.length === 0) {
            return res.status(400).json ({message: 'Venta no encontrada'});
        }
        // Obtener los detalles de la venta
        const [detalles] = await db.query(
            'SELECT dv.idProducto, dv.cantidad, dv.subtotal, p.nombre AS productoNombre FROM detalles_venta dv JOIN productos p ON dv.idProducto = p.idProducto WHERE dv.idVenta = ?',
            [id]
        );

        res.json({
            ...venta[0],
            detalles, // Añadimos los detalles de la venta
        });

    } catch (error) {
        console.error('Error al obtener venta por ID:', error);
        res.status(500).json({ message: 'Error al obtener la venta.' });
    }
}
// Crear una nueva venta con detalles
const addVenta = async (req, res) => {
    const { idCliente, productos } = req.body;

    if (!idCliente || !productos || productos.length === 0) {
        return res.status(400).json({ message: 'Faltan datos de la venta.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Insertar la venta en la tabla "ventas"
        const [ventaResult] = await connection.query(
            'INSERT INTO ventas (idCliente, fecha) VALUES (?, NOW())',
            [idCliente]
        );
        const idVenta = ventaResult.insertId;

        // Insertar los productos en la tabla "detalles_venta"
        for (const producto of productos) {
            const { idProducto, cantidad, subtotal } = producto;

            if (!idProducto || !cantidad || !subtotal) {
                throw new Error('Datos incompletos en los productos.');
            }

            await connection.query(
                'INSERT INTO detalles_venta (idVenta, idProducto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
                [idVenta, idProducto, cantidad, subtotal]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Venta creada con éxito', idVenta });
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la venta:', error);
        res.status(500).json({ message: 'Error al crear la venta.' });
    } finally {
        connection.release();
    }
};

//Editar un a venta
const updateVenta = async (req, res) => {
    const { id } = req.params; // Obtenemos el ID de la venta
    const { idCliente, fecha, productos } = req.body;

    if (!id || !idCliente || !fecha || !productos || productos.length === 0) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Actualizar la tabla ventas
        await db.query(`UPDATE ventas SET idCliente = ?, fecha = ? WHERE idVenta = ?`, [idCliente, fecha, id]);

        // Eliminar los detalles actuales de la venta
        await db.query(`DELETE FROM detalles_venta WHERE idVenta = ?`, [id]);

        // Insertar los nuevos detalles
        const detallesQuery = `
            INSERT INTO detalles_venta (idVenta, idProducto, cantidad, subtotal)
            VALUES ?
        `;
        const detallesValues = productos.map(producto => [
            id,
            producto.idProducto,
            producto.cantidad,
            producto.subtotal,
        ]);
        await db.query(detallesQuery, [detallesValues]);

        res.json({ message: 'Venta actualizada correctamente.' });
    } catch (error) {
        console.error('Error al actualizar venta:', error);
        res.status(500).json({ message: 'Error al actualizar la venta.' });
    }
};

//Eliminar una venta
const deleteVenta = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'ID de venta es obligatorio.' });
    }

    try {
        // Primero eliminamos los detalles de la venta
        await db.query(`DELETE FROM detalles_venta WHERE idVenta = ?`, [id]);

        // Luego eliminamos la venta
        const [result] = await db.query(`DELETE FROM ventas WHERE idVenta = ?`, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Venta no encontrada.' });
        }

        res.json({ message: 'Venta eliminada correctamente.' });
    } catch (error) {
        console.error('Error al eliminar venta:', error);
        res.status(500).json({ message: 'Error al eliminar la venta.' });
    }
};
module.exports = {
    getVentas,
    addVenta,
    updateVenta, 
    deleteVenta,
    getVentaById,
};