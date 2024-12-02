const db = require('../../db');

// Obtener todos los empleados
const getEmpleados = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM empleados');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los empleados' });
    }
}; 

// Obtener un empleado por su id
const getEmpleadoById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json ({message: 'ID del empleado obligatorio'});
    }
    try {
        const [rows] = await db.query('SELECT * FROM empleados WHERE idEmpleado = ?' , [id]);

        if (rows.length === 0) {
            return res.status(400).json ({message: 'Empleado no encontrado'});

        }
        res.json(rows[0]); //devolvemos el unico resultado ya que solo hay un empleado con ese id
    }catch (error) {
        console.log('Error al obtener el empleado por su ID', error);
        res.status(500).json ({message: 'Error al obtener el empleado'})
    }
};

// Agregar un empleado
const addEmpleado = async (req, res) => {
    const { nombre, apellidos, email, telefono, ciudad, sueldo } = req.body;

    // Validación de campos
    if (!nombre || !apellidos || !email || !telefono || !ciudad || !sueldo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }
    try {
        const query = `
        INSERT INTO empleados (nombre, apellidos, email, telefono, ciudad, sueldo)
        VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [nombre, apellidos, email, telefono, ciudad, sueldo];
        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'Empleado agregado correctamente.',
            empleado: {
                idEmpleado: result.insertId,
                nombre,
                apellidos,
                email,
                telefono,
                ciudad,
                sueldo
            }
        });
    } catch (error) {
        console.error('Error al agregar empleado:', error);
        res.status(500).json({ message: 'Error al agregar el empleado.' });
    }
};

// Editar un empleado
const updateEmpleado = async (req, res) => {
    const { id } = req.params;
    const { nombre, apellidos, email, telefono, ciudad, sueldo } = req.body;

    // Validación
    if (!id || !nombre || !apellidos || !email || !telefono || !ciudad || !sueldo) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        const query = `
            UPDATE empleados
            SET nombre = ?, apellidos = ?, email = ?, telefono = ?, ciudad = ?, sueldo = ?
            WHERE idEmpleado = ?
        `;
        const values = [nombre, apellidos, email, telefono, ciudad, sueldo, id];
        const [result] = await db.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado.' });
        }

        res.json({ message: 'Empleado actualizado correctamente.' });
    } catch (error) {
        console.error('Error al actualizar empleado:', error);
        res.status(500).json({ message: 'Error al actualizar el empleado.' });
    }
};

// Eliminar un empleado
const deleteEmpleado = async (req, res) => {
    const { id } = req.params; 

    if (!id) {
        return res.status(400).json({ message: 'ID de empleado es obligatorio.' });
    }

    try {
        const query = `DELETE FROM empleados WHERE idEmpleado = ?`;
        const [result] = await db.query(query, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Empleado no encontrado.' });
        }

        res.json({ message: 'Empleado eliminado correctamente.' });
    } catch (error) {
        console.error('Error al eliminar empleado:', error);
        res.status(500).json({ message: 'Error al eliminar el empleado.' });
    }
};

module.exports = {
    getEmpleados,
    addEmpleado,
    updateEmpleado,
    deleteEmpleado,
    getEmpleadoById,
};