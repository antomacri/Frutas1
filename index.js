const express = require("express");

const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

// Inicializamos  el Motor de plantillas elegido 
app.set('view engine', 'ejs')
//app.use(express.static('views'))