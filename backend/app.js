const express = require('express');
const cors = require('cors');
const clientesRouter = require('./src/routes/clientes');
const ventasRouter = require('./src/routes/ventas');
const empleadosRouter = require('./src/routes/empleados');
const productosRouter = require('./src/routes/productos');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/productos', productosRouter);
// app.use('/api/empleados', empleadosRoutes);

module.exports = app;