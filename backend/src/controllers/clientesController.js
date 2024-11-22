const db = require('../../db');

// Obtener todos los clientes
const getClientes = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
}; 

// Obtener un cliente por su id
const getClienteById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json ({message: 'ID del cliente obligatorio'});
    }
    try {
        const [rows] = await db.query('SELECT * FROM clientes WHERE idCliente = ?' , [id]);

        if (rows.length === 0) {
            return res.status(400).json ({message: 'Cliente no encontrado'});

        }
        res.json(rows[0]); //devolvemos el unico resultado ya que solo hay un cliente con ese id
    }catch (error) {
        console.log('Error al obtener el cliente por su ID', error);
        res.status(500).json ({message: 'Error al obtener el cliente'})
    }
};

// Agregar un cliente
const addCliente = async (req, res) => {
    const { nombre, apellidos, email, telefono, ciudad } = req.body;

    // Validación de campos
    if (!nombre || !apellidos || !email || !telefono || !ciudad) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    try {
        const query = `
        INSERT INTO clientes (nombre, apellidos, email, telefono, ciudad)
        VALUES (?, ?, ?, ?, ?)
        `;
        const values = [nombre, apellidos, email, telefono, ciudad];
        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'Cliente agregado correctamente.',
            cliente: {
                idCliente: result.insertId,
                nombre,
                apellidos,
                email,
                telefono,
                ciudad
            }
        });
    } catch (error) {
        console.error('Error al agregar cliente:', error);
        res.status(500).json({ message: 'Error al agregar el cliente.' });
    }
};

// Editar un cliente
const updateCliente = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, email, telefono, ciudad } = req.body;

    // Validación
    if (!id || !nombre || !apellidos || !email || !telefono || !ciudad) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const query = `
            UPDATE clientes
            SET nombre = ?, apellidos = ?, email = ?, telefono = ?, ciudad = ?
            WHERE idCliente = ?
        `;
        const values = [nombre, apellidos, email, telefono, ciudad, id];
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        res.json({ message: 'Cliente actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar cliente:', error);
        res.status(500).json({ message: 'Error al actualizar el cliente.' });
    }
};

// Eliminar un cliente
const deleteCliente = async (req, res) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: 'ID de cliente es obligatorio.' });
    }

    try {
        const query = `DELETE FROM clientes WHERE idCliente = ?`;
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Cliente no encontrado.' });
        }

        res.json({ message: 'Cliente eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar cliente:', error);
        res.status(500).json({ message: 'Error al eliminar el cliente.' });
    }
};

module.exports = {
    getClientes,
    addCliente,
    updateCliente,
    deleteCliente,
    getClienteById,
};