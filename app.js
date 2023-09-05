const express = require('express');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3008;
const partialJsonPath = path.join(__dirname, process.env.PARTIAL_JSON_PATH);

// incluyo funciones declaradas en mongodb.js
const { connectToMongodb, disconnectToMongodb} = require('./src/mongodb')
//Middleware
app.use((req, res, next) => {
    res.header("Content-Type", "application/json; charset=utf-8");
    next();
});
app.get('/', (req, res) => { res.status(200).end('¡Bienvenido a la API de frutas!'); } );

//Endpoints
app.get('/frutas', async (req, res) => {
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db = client.db('frutas')
    const frutas = await db.collection('frutas').find().toArray()
    await disconnectToMongodb()
    res.json(frutas)
});
// ```
app.get('/frutas/:id', async (req, res) => {
    const frutaID = parseInt(req.params.id) || 0
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db = client.db('frutas')
    const fruta = await db.collection('frutas').findOne({ id: frutaID})
    await disconnectToMongodb()
    !fruta ? res.status(404).send('No encontre la fruta con el id '+ frutaID): res.json(fruta)
});

app.get('/frutas/nombre/:nombre', async (req, res) => {
    const nombreFruta = req.params.nombre
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const regex = new RegExp(nombreFruta.toLowerCase(), 'i');
    const db = client.db('frutas')
    const frutas = await db.collection('frutas').find({ nombre: regex}).toArray()
    await disconnectToMongodb()
    frutas.length == 0 ? res.status(404).send('No encontre la fruta con el nombre '+ nombreFruta): res.json(frutas)
})

app.get('/frutas/precio/:precio', async (req, res) => {
    const precioFruta = parseInt(req.params.precio) || 0
    const client = await connectToMongodb();
    if (!client) {
        res.status(500).send('Error al conectarse a MongoDB')
        return;
    }
    const db = client.db('frutas') 
    // gte: mayor o igual a
    const frutas = await db.collection('frutas').find({ importe: { $gte: precioFruta } }).toArray()
    await disconnectToMongodb()
    frutas.length == 0 ? res.status(404).send('No encontre la fruta con el precio '+ precioFruta): res.json(frutas)

})


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor web en http://localhost:${port}`);
});