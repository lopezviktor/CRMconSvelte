const db = require('../../db');

// Obtener todos los productos
const getProductos = async (req, res) => {
    try {
        const query = `
            SELECT 
                p.idProducto, 
                p.nombre, 
                p.precio, 
                p.stock, 
                c.nombre_categoria AS categoria
            FROM 
                productos p
            JOIN 
                categorias c 
            ON 
                p.id_categoria = c.id_categoria;
        `;
        const [productos] = await db.query(query);
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos.' });
    }
};

// Obtener un producto con id
const getProductoById = async (req, res) => {
    const { id } = req.params; 

    try {
        const query = `SELECT * FROM productos WHERE idProducto = ?`;
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Producto no encontrado.' });
        }

        res.json(result[0]);
    } catch (error) {
        console.error('Error al obtener producto por ID:', error);
        res.status(500).json({ message: 'Error al obtener el producto.' });
    }
};

// Añadir un nuevo producto
const addProducto = async (req, res) => {
    const { nombre, precio, id_categoria, stock  } = req.body;

    if (!nombre || !precio || !id_categoria || stock) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const query = `INSERT INTO productos (nombre, precio, id_categoria, stock) VALUES (?, ?, ?, ?)`;
        const [result] = await db.query(query, [nombre, precio, id_categoria, stock]);
        res.status(201).json({ message: 'Producto añadido.', id: result.insertId });
    } catch (error) {
        console.error('Error al añadir producto:', error);
        res.status(500).json({ message: 'Error al añadir producto.' });
    }
};

// Editar un producto
const updateProducto = async (req, res) => {
    const { id } = req.params;
    const { nombre, precio, id_categoria } = req.body;

    try {
        const query = `UPDATE productos SET nombre = ?, precio = ?, id_categoria = ? WHERE idProducto = ?`;
        await db.query(query, [nombre, precio, id_categoria, id]);
        res.json({ message: 'Producto actualizado.' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ message: 'Error al actualizar producto.' });
    }
};

// Eliminar un producto
const deleteProducto = async (req, res) => {
    const { id } = req.params;

    try {
        const query = `DELETE FROM productos WHERE idProducto = ?`;
        await db.query(query, [id]);
        res.json({ message: 'Producto eliminado.' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ message: 'Error al eliminar producto.' });
    }
};

// Incrementar el stock
const incrementarStock = async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
        return res.status(400).json({messaje: 'La cantidad debe ser mayor que 0.'})
    }
    try {
        const query = `UPDATE productos SET stock = stock + ? WHERE idProducto = ?`;
        await db.query(query, [cantidad, id]);
        res.json({ message: `Stock incrementado en ${cantidad}.` });
    } catch (error) {
        console.error('Error al incrementar stock:', error);
        res.status(500).json({ message: 'Error al incrementar stock.' });
    }
};

// Disminuir el stock
const decrementarStock = async (req, res) => {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || cantidad < 1) {
        return res.status(400).json({ message: 'La cantidad debe ser mayor a 0.' });
    }

    try {
        const query = `UPDATE productos SET stock = GREATEST(stock - ?, 0) WHERE idProducto = ?`;
        await db.query(query, [cantidad, id]);
        res.json({ message: `Stock decrementado en ${cantidad}.` });
    } catch (error) {
        console.error('Error al decrementar stock:', error);
        res.status(500).json({ message: 'Error al decrementar stock.' });
    }
}


module.exports = { getProductos, getProductoById, addProducto, updateProducto, deleteProducto, incrementarStock, decrementarStock };