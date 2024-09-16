const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');

// post method to add a new menu
router.post('/', async (req,res) => {
    try {
        const data = req.body;
        const newMenu = new Menu(data);
        const response = await newMenu.save();
        console.log('data saved');
        res.status(200).send(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

// get method to fetch all menu
router.get('/', async (req,res) => {
    try {
        const menu = await Menu.find();
        res.status(200).send(menu);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

// get method to fetch menu by taste
router.get('/:taste', async (req,res) => {
    try {
        const taste = req.params.taste;
        const menu = await Menu.find({taste: taste});
        if (menu.length === 0) {
            res.status(404).json({message: 'No menu found'});
        }
        console.log('menu fetched');
        res.status(200).json(menu);
    }
    catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router; // export the router