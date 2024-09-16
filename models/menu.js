const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    taste: {
        type: String,
        enum: ['spicy','sweet','sour','bitter','salty'],
        required: true,
    },
    isDrink: {
        type: Boolean,
        default: false,
    },
    ingredients: {
        type: [String],
        required: true,
        default: [],
    },
    numSales: {
        type: Number,
        default: 0,
    },
    });

module.exports = mongoose.model('Menu', menuSchema); // export the model Menu