require('dotenv').config();
const router = require('./routes/product.route')

const express = require('express');

const app = express();
app.use(require('cookie-parser')());
app.use(express.json());
app.use("/api",router);


module.exports = app;