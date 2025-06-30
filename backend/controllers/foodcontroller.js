const foodModel = require('../models/foodModel');
const fsPromises = require('fs').promises;
const path = require('path');

const addFood = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No image uploaded" });
        }

        const image_filename = req.file.filename;
        const { name, description, price, category } = req.body;

        if (!name || !description || !price || !category) {
            // Delete the uploaded file if validation fails
            await fsPromises.unlink(path.join(__dirname, '..', 'uploads', image_filename));
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const newFood = await foodModel.create({
            name,
            description,
            price,
            category,
            image: image_filename
        });

        res.status(201).json({
            success: true,
            message: "Food item successfully added to the menu!",
            data: newFood
        });

    } catch (error) {
        console.error(error);
        if (req.file) {
            await fsPromises.unlink(path.join(__dirname, '..', 'uploads', req.file.filename));
        }
        res.status(500).json({
            success: false,
            message: "Failed to add food item",
            error: error.message
        });
    }
};

const listFood = async (req, res) => {
    try {
        const foods = await foodModel.find({});
        res.json({
            success: true,
            count: foods.length,
            data: foods
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Unable to retrieve food items",
            error: error.message
        });
    }
};

const removeFood = async (req, res) => {
    try {
        const { id } = req.query;
        if (!id) {
            return res.status(400).json({ success: false, message: "Food ID is required" });
        }

        const food = await foodModel.findById(id);
        if (!food) {
            return res.status(404).json({ success: false, message: "Food item not found" });
        }

        await fsPromises.unlink(path.join(__dirname, '..', 'uploads', food.image));
        await foodModel.deleteOne({ _id: id });

        res.status(200).json({
            success: true,
            message: "Food item successfully removed"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to delete food item",
            error: error.message
        });
    }
};

module.exports = { addFood, listFood, removeFood };