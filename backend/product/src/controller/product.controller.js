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

const getProducts = async (req, res) => {
    try {
        const { q, category, minPrice, maxPrice, page = 1, limit = 10, sort } = req.query;

        const filter = {};

        if (q) {
            filter.$text = { $search: q };
        }

        if (category) {
            filter.category = category;
        }

        if (minPrice || maxPrice) {
            filter['price.amount'] = {};
            if (minPrice) filter['price.amount'].$gte = Number(minPrice);
            if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
        }

        const sortOptions = {};
        switch (sort) {
            case 'price_asc':
                sortOptions['price.amount'] = 1;
                break;
            case 'price_desc':
                sortOptions['price.amount'] = -1;
                break;
            case 'title_asc':
                sortOptions.title = 1;
                break;
            case 'title_desc':
                sortOptions.title = -1;
                break;
            case 'oldest':
                sortOptions.createdAt = 1;
                break;
            case 'newest':
            default:
                sortOptions.createdAt = -1;
                break;
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const lim = Math.max(1, parseInt(limit, 10) || 10);
        const skip = (pageNum - 1) * lim;

        const productsQuery = ProductModel.find(filter).sort(sortOptions).skip(skip).limit(lim);

        if (q) {
            productsQuery.select({ score: { $meta: 'textScore' } }).sort({ score: { $meta: 'textScore' } });
        }

        const [products, total] = await Promise.all([
            productsQuery.exec(),
            ProductModel.countDocuments(filter)
        ]);

        const totalPages = Math.ceil(total / lim);

        res.json({ page: pageNum, limit: lim, total, totalPages, products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};

const getProductById = async (req, res) => {
    try {
        const productId = req.params.id;

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ product });
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
};

const updateProduct = async (req, res) => {
    // Implementation for updating a product
    const productId = req.params.id;
    const body = req.body;
    const imageFile = req.file;
    try {        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.seller.toString() !== req.seller._id.toString()) {
            return res.status(403).json({ error: 'Forbidden. You can only update your own products.' });
        }   
        if (imageFile) {
            const imageUrl = await uploadImage(imageFile);
            product.images = {
                url: imageUrl.url,
                thumbnailUrl: imageUrl.thumbnailUrl
            };
        }
        Object.assign(product, body);
        await product.save();
        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
};

const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await ProductModel.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.seller.toString() !== req.seller._id.toString()) {
            return res.status(403).json({ error: 'Forbidden. You can only delete your own products.' });
        }
        await product.remove();
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    updateProduct,
    getProductById
};