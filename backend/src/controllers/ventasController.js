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
    const { id } = req.params;

    try {
        const [result] = await db.query(`
            SELECT 
                v.idVenta, 
                v.fecha, 
                CONCAT(c.nombre, ' ', c.apellidos) AS cliente, 
                SUM(dv.cantidad * dv.subtotal / dv.cantidad) AS total
            FROM ventas v
            JOIN clientes c ON v.idCliente = c.idCliente
            JOIN detalles_venta dv ON v.idVenta = dv.idVenta
            WHERE v.idVenta = ?
            GROUP BY v.idVenta
        `, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Venta no encontrada.' });
        }

        // Obtener detalles de los productos vendidos en esta venta
        const [detalles] = await db.query(`
            SELECT 
                dv.idProducto, 
                p.nombre AS producto, 
                dv.cantidad, 
                dv.subtotal / dv.cantidad AS precioUnitario, 
                dv.subtotal
            FROM detalles_venta dv
            JOIN productos p ON dv.idProducto = p.idProducto
            WHERE dv.idVenta = ?
        `, [id]);

        res.json({
            ...result[0],
            productos: detalles,
        });
    } catch (error) {
        console.error('Error al obtener venta por ID:', error);
        res.status(500).json({ message: 'Error al obtener la venta.' });
    }
};
// Crear una nueva venta con detalles
const addVenta = async (req, res) => {
    const { idCliente, productos } = req.body;

    if (!idCliente || !productos || productos.length === 0) {
        return res.status(400).json({ message: 'Faltan datos de la venta.' });
    }

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Verificar stock de los productos
        for (const producto of productos) {
            const { idProducto, cantidad } = producto;
            const [result] = await connection.query(
                'SELECT stock FROM productos WHERE idProducto = ?',
                [idProducto]
            );
            if (result.length === 0) {
                throw new Error(`El producto con ID ${idProducto} no existe.`);
            }
            const stockDisponible = result[0].stock;
            if (cantidad > stockDisponible) {
                throw new Error(
                    `El stock disponible para el producto con ID ${idProducto} es ${stockDisponible}.`
                );
            }
        }
        // Insertar la venta en la tabla "ventas"
        const [ventaResult] = await connection.query(
            'INSERT INTO ventas (idCliente, fecha) VALUES (?, NOW())',
            [idCliente]
        );
        const idVenta = ventaResult.insertId;

        // Validar stock y registrar los productos en la tabla "detalles_venta"
        for (const producto of productos) {
            const { idProducto, cantidad, subtotal } = producto;

            if (!idProducto || !cantidad || !subtotal) {
                throw new Error('Datos incompletos en los productos.');
            }

            // Verificar si hay suficiente stock
            const [productoData] = await connection.query(
                'SELECT stock FROM productos WHERE idProducto = ?',
                [idProducto]
            );

            if (productoData.length === 0) {
                throw new Error(`Producto con ID ${idProducto} no encontrado.`);
            }

            if (productoData[0].stock < cantidad) {
                throw new Error(
                    `Stock insuficiente para el producto con ID ${idProducto}.`
                );
            }

            // Insertar en la tabla "detalles_venta"
            await connection.query(
                'INSERT INTO detalles_venta (idVenta, idProducto, cantidad, subtotal) VALUES (?, ?, ?, ?)',
                [idVenta, idProducto, cantidad, subtotal]
            );

            // Actualizar el stock del producto
            await connection.query(
                'UPDATE productos SET stock = stock - ? WHERE idProducto = ?',
                [cantidad, idProducto]
            );
        }

        await connection.commit();
        res.status(201).json({ message: 'Venta creada con éxito', idVenta });
    } catch (error) {
        await connection.rollback();
        console.error('Error al crear la venta:', error.message);
        res.status(500).json({ message: `Error al crear la venta: ${error.message}` });
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

    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        // Obtener los productos de la venta
        const [detalles] = await connection.query(
            'SELECT idProducto, cantidad FROM detalles_venta WHERE idVenta = ?',
            [id]
        );

        // Restablecer el stock de cada producto
        for (const detalle of detalles) {
            const { idProducto, cantidad } = detalle;
            await connection.query(
                'UPDATE productos SET stock = stock + ? WHERE idProducto = ?',
                [cantidad, idProducto]
            );
        }

        // Eliminar los detalles de la venta
        await connection.query('DELETE FROM detalles_venta WHERE idVenta = ?', [id]);

        // Eliminar la venta
        await connection.query('DELETE FROM ventas WHERE idVenta = ?', [id]);

        await connection.commit();
        res.status(200).json({ message: 'Venta eliminada correctamente.' });
    } catch (error) {
        await connection.rollback();
        console.error('Error al eliminar venta:', error);
        res.status(500).json({ message: 'Error al eliminar la venta.' });
    } finally {
        connection.release();
    }
};

// Obtener los productos mas vendidos
const getProductosMasVendidos = async (req, res) => {
    try {
        const query = `
            SELECT p.nombre, SUM(dv.cantidad) AS total_vendido
            FROM detalles_venta dv
            INNER JOIN productos p ON dv.idProducto = p.idProducto
            GROUP BY p.idProducto
            ORDER BY total_vendido DESC
            LIMIT 10;
        `;
        const [result] = await db.query(query);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener productos más vendidos:", error);
        res.status(500).json({ message: "Error al obtener productos más vendidos." });
    }
};

// Obtener ventas del día
const ventasDelDia = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT SUM(dv.cantidad * dv.precio) AS total
            FROM ventas v
            JOIN detalles_venta dv ON v.idVenta = dv.idVenta
            WHERE DATE(v.fecha) = CURDATE()
        `);
        res.json({ total: result[0].total || 0 });
    } catch (error) {
        console.error('Error al obtener las ventas del día:', error);
        res.status(500).json({ message: 'Error al obtener las ventas del día.' });
    }
};

// Ultimas ventas
const ultimasVentas = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT v.fecha, 
                   CONCAT(c.nombre, ' ', c.apellidos) AS cliente, 
                   SUM(dv.subtotal) AS total
            FROM ventas v
            JOIN clientes c ON v.idCliente = c.idCliente
            JOIN detalles_venta dv ON v.idVenta = dv.idVenta
            GROUP BY v.idVenta
            ORDER BY v.fecha DESC
            LIMIT 10
        `);
        res.json(result);
    } catch (error) {
        console.error('Error al obtener las últimas ventas:', error);
        res.status(500).json({ message: 'Error al obtener las últimas ventas.' });
    }
};

// Obtener cantidad total de ventas del mes
const cantidadVentasMes = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT COUNT(*) AS totalVentas
            FROM ventas
            WHERE MONTH(fecha) = MONTH(CURDATE()) AND YEAR(fecha) = YEAR(CURDATE())
        `);
        res.json(result[0]); // Devuelve el primer resultado
    } catch (error) {
        console.error("Error al obtener la cantidad de ventas del mes:", error);
        res.status(500).json({ message: "Error al obtener la cantidad de ventas del mes." });
    }
};

// Obtener cantidad total de productos vendidos este mes
const cantidadProductosVendidosMes = async (req, res) => {
    try {
        const [result] = await db.query(`
            SELECT SUM(dv.cantidad) AS totalProductosVendidos
            FROM detalles_venta dv
            INNER JOIN ventas v ON dv.idVenta = v.idVenta
            WHERE MONTH(v.fecha) = MONTH(CURDATE()) AND YEAR(v.fecha) = YEAR(CURDATE())
        `);
        res.json(result[0]); // Devuelve el primer resultado
    } catch (error) {
        console.error("Error al obtener la cantidad de productos vendidos este mes:", error);
        res.status(500).json({ message: "Error al obtener la cantidad de productos vendidos este mes." });
    }
};

module.exports = {
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
};