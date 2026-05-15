const express = require('express');
const upload = require('../middleware/multercofig.middleware');
const { uploadImage } = require('../services/imagekit.service');
const authSeller = require('../middleware/authseller.middleware');

const router = express.Router();

//api/products/
router.post('/products', authSeller, upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        const sellerId = req.seller.id; // Assuming the seller's ID is stored in the token
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const result = await uploadImage(file);
        res.status(201).json({ message: 'File uploaded successfully', data: result });
    } catch (error) {
        console.error('Error uploading file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;