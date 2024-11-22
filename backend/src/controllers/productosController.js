const db = require('../../db');

// Obtener todos los productos
const getProductos = async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ message: 'Error al obtener productos.' });
    }
};

// Añadir un nuevo producto
const addProducto = async (req, res) => {
    const { nombre, precio, id_categoria } = req.body;

    if (!nombre || !precio || !id_categoria) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const query = `INSERT INTO productos (nombre, precio, id_categoria) VALUES (?, ?, ?)`;
        const [result] = await db.query(query, [nombre, precio, id_categoria]);
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

module.exports = { getProductos, addProducto, updateProducto, deleteProducto };