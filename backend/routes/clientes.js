// routes/clientes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint para obtener todos los clientes
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clientes');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los clientes' });
    }
});

router.post('/', async (req, res) => {
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
});

module.exports = router;