const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const auth = require('../middleware/auth');

// @route   GET /api/items
// @desc    Get all items
// @access  Public
router.get('/', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// @route   GET /api/items/:id
// @desc    Get single item
// @access  Public
router.get('/:id', getItem, (req, res) => {
    res.json(res.item);
});

// @route   POST /api/items
// @desc    Create an item
// @access  Private
router.post('/', auth, async (req, res) => {
    const item = new Item({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    });

    try {
        const newItem = await item.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   PUT /api/items/:id
// @desc    Update an item
// @access  Private
router.put('/:id', auth, getItem, async (req, res) => {
    if (req.body.name != null) {
        res.item.name = req.body.name;
    }
    if (req.body.description != null) {
        res.item.description = req.body.description;
    }
    if (req.body.price != null) {
        res.item.price = req.body.price;
    }

    try {
        const updatedItem = await res.item.save();
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// @route   DELETE /api/items/:id
// @desc    Delete an item
// @access  Private
router.delete('/:id', auth, getItem, async (req, res) => {
    try {
        await res.item.remove();
        res.json({ message: 'Deleted item' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Middleware function to get item by ID
async function getItem(req, res, next) {
    let item;
    try {
        item = await Item.findById(req.params.id);
        if (item == null) {
            return res.status(404).json({ message: 'Cannot find item' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.item = item;
    next();
}

module.exports = router;
