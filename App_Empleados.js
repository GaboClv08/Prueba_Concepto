const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const puerto = 3000;

// Configuración de la conexión a la base de datos
const configDB = {
    user: 'Jafet', 
    password: '1234', 
    server: 'localhost', 
    database: 'Empleados', 
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

app.use(cors());

// Endpoint para obtener los datos de la base de datos
app.get('/api/datos', async (req, res) => {
    try {
        await sql.connect(configDB);
        const resultado = await sql.query`EXEC Empleados_lista`; 
        res.json(resultado.recordset);
    } catch (err) {
        console.error('Error al conectar a la base de datos:', err);
        res.status(500).send('Error al obtener los datos.');
    } finally {
        sql.close();
    }
});

// Iniciar el servidor
app.listen(puerto, () => {
    console.log("Servidor de la API escuchando en http://localhost:${puerto}");
});

