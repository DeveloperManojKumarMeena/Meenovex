const ProductModel = require('../model/product.model');
const { uploadImage } = require('../services/imagekit.service');

const createProduct = async (req, res) => {
    try {
        const body = req.body;
        console.log(body)

        const imageFile = req.file;
        const userId = req.seller._id;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized. Seller ID is missing.' });
        }
        if (!imageFile) {
            return res.status(400).json({ error: 'Image file is required' });
        }
        const imageUrl = await uploadImage(imageFile);

        const newProduct = new ProductModel({
            title: body.title,
            description: body.description,
            price: {
                amount: body['price.amount'],
                currency: body['price.currency']
            },
            category: body.category,
            images: {
                url: imageUrl.url,
                thumbnailUrl: imageUrl.thumbnailUrl
            },

            seller: req.seller._id,
        });
        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });


    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

module.exports = {
    createProduct,
};