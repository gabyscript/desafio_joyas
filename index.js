

const express = require('express');
const app = express();

app.listen(3000, console.log("Servidor activo"));

const { obtenerInventario, obtenerInventarioFiltrado, prepararHATEOAS, reportarConsulta } = require('./consultas') 



app.get('/joyas/', async (req, res) => {
    
    const queryStrings = req.query;
    const joyas = await obtenerInventario(queryStrings);
    const HATEOAS = await prepararHATEOAS(joyas);
    res.json(HATEOAS)
})

app.get('/joyas/:busqueda', reportarConsulta, async (req, res) => {
    const parametro = req.params;
    const queryString = req.query;
    const joyas = await obtenerInventarioFiltrado(queryString);
    res.json(joyas)
})

app.get("*", (req, res) => {
    res.status(404).send("Esta ruta no existe")
})    



