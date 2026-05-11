require('dotenv').config();
const router = require('./routes/product.route')

const express = require('express');

const app = express();
app.use(express.json());
app.use("api/products",router);


module.exports = app;