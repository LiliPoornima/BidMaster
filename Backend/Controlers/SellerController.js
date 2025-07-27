const SellerItem = require('../Model/SellerItem');
const path = require('path');
const fs = require('fs');

// ✅ Create Item
exports.createItem = async (req, res) => {
    try {
        const {
            name, description, price, startingPrice, biddingEndTime,
            condition, provenance, dimensions, weight, material, maker, year, username
        } = req.body;

        const image = req.files['image'] ? req.files['image'][0].filename : null;
        const additionalImages = req.files['additionalImages']
            ? req.files['additionalImages'].map(file => file.filename)
            : [];

        if (!name || !description || !price || !image || !username) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const item = new SellerItem({
            name,
            description,
            price,
            startingPrice: startingPrice || price,
            biddingEndTime,
            condition,
            provenance,
            dimensions,
            weight,
            material,
            maker,
            year,
            image,
            additionalImages,
            username
        });

        const savedItem = await item.save();
        res.status(201).json({ message: 'Item created successfully', item: savedItem });

    } catch (error) {
        console.error('Create Item Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Get All Items
exports.getItems = async (req, res) => {
    try {
        const items = await SellerItem.find();
        res.json({ items });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Get Item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await SellerItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Get Items by Seller ID
exports.getItemsBySeller = async (req, res) => {
    try {
        const { username } = req.params;
        const item = await SellerItem.find({ username });

        res.json({ item });
    } catch (error) {
        console.error('Get Items By Seller Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ Delete Item
exports.deleteItem = async (req, res) => {
    try {
        const item = await SellerItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Delete images from filesystem
        const imagePaths = [
            path.join(__dirname, '../uploads', item.image),
            ...item.additionalImages.map(img => path.join(__dirname, '../uploads', img))
        ];

        imagePaths.forEach(filePath => {
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        });

        await SellerItem.findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
