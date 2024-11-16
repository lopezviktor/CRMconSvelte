// index.js
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Importar y usar rutas
const clientesRouter = require('./routes/clientes');
const ventasRouter = require('./routes/ventas');

app.use('/api/clientes', clientesRouter);
app.use('/api/ventas', ventasRouter);

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});