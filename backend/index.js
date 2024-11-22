const app = require('./app');
const port = process.env.PORT || 3000;

// Inicia el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});