const express = require('express');
const upload = require('../middleware/multercofig.middleware');
const authSeller = require('../middleware/authseller.middleware');
const productController = require('../controller/product.controller');
const { createProductValidators } = require('../validators/product.validator');
const validate = require('../middleware/validation.middleware');

const router = express.Router();

//api/products/
// List & search products
router.get('/products', productController.getProducts);
router.post('/products', authSeller, upload.single('image'), createProductValidators, validate, productController.createProduct);

module.exports = router;