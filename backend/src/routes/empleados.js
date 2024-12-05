const express = require('express');
const { 
    getEmpleados, 
    addEmpleado, 
    updateEmpleado, 
    deleteEmpleado, 
    getEmpleadoById 
} = require('../controllers/empleadosController');
const router = express.Router();

router.get('/listar', getEmpleados);
router.get('/:id', getEmpleadoById);
router.post('/anadir', addEmpleado);
router.put('/editar/:id', updateEmpleado); 
router.delete('/eliminar/:id', deleteEmpleado); 

module.exports = router;