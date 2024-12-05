const db = require('../../db');

// Guardar datos de contacto
const guardarContacto = async (req, res) => {
    const { nombre, email, telefono, mensaje } = req.body;

    // Validación de campos
    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
    }

    try {
        // Insertar los datos de contacto en la base de datos
        const query = `
            INSERT INTO contactos (nombre, email, telefono, mensaje)
            VALUES (?, ?, ?, ?)
        `;
        const values = [nombre, email, telefono, mensaje];
        const [result] = await db.query(query, values);

        res.status(201).json({
            message: 'Formulario de contacto guardado correctamente.',
            contacto: {
                idContacto: result.insertId,
                nombre,
                email,
                telefono,
                mensaje
            }
        });
    } catch (error) {
        console.error('Error al guardar el formulario de contacto:', error);
        res.status(500).json({ message: 'Error al guardar los datos del formulario de contacto.' });
    }
};

module.exports = {
    guardarContacto
};