const express = require('express');
const cors = require('cors');
const clientesRoutes = require('./src/routes/clientes');
const ventasRoutes = require('./src/routes/ventas');
const empleadosRoutes = require('./src/routes/empleados');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRoutes);
app.use('/api/ventas', ventasRoutes);
// app.use('/api/empleados', empleadosRoutes);

module.exports = app;