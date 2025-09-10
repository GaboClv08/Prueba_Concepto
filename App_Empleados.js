const express = require('express');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const puerto = 3000;

app.use(express.json());

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

// Endpoint para agregar un nuevo empleado
app.post('/api/insertar', async (req, res) => {
    try {
        // Ahora 'req.body' contendrá los datos enviados desde el HTML
        const { nombre, salario } = req.body;

        await sql.connect(configDB);
        const request = new sql.Request();

        request.input('Nombre', sql.VarChar(64), nombre);
        request.input('Salario', sql.Money, salario);

        // Ejecutamos el procedimiento almacenado
        const result = await request.execute('Nuevo_Empleado');
        const returnCode = result.returnValue;

        // Verificamos el valor de retorno para ver si la inserción fue exitosa
        if (returnCode === -1) {
            // El SP devolvió -1, lo que indica un nombre duplicado
            return res.status(409).json({ message: 'Ya existe un empleado con este nombre en la base de datos.' });
        }

        // Si el código de retorno no es -1, la operación fue exitosa
        return res.status(200).json({ message: 'Empleado agregado exitosamente a la base de datos.' });
    } catch (err) {
        console.error('Error al agregar empleado:', err);
        return res.status(500).json({ message: 'Error al agregar el empleado.' });
    } finally {
        sql.close();
    }
});

// Iniciar el servidor
app.listen(puerto, () => {
    console.log("Servidor de la API escuchando en http://localhost:${puerto}");
});
