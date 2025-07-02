const foodModel = require('../models/foodModel');
const { cloudinary } = require('../config/cloudinary');

const addFood = async (req, res) => {
  try {
    let imagePath = null;
    let publicId = null;

    if (req.file) {
      imagePath = req.file.path;
      publicId = req.file.filename;
    }

    
    if (req.body.imageUrl) {
      imagePath = req.body.imageUrl;
      publicId = null; 
    }

    if (!imagePath) {
      return res.status(400).json({ success: false, message: 'Image is required (file or URL)' });
    }

    const food = await foodModel.create({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: imagePath,
      public_id: publicId
    });

    res.status(201).json({ 
      success: true, 
      message: 'Food added successfully',
      data: food
    });

  } catch (error) {
    console.error('Add Food Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding food',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find().sort({ createdAt: -1 });
    res.status(200).json({ 
      success: true, 
      count: foods.length,
      data: foods 
    });
  } catch (error) {
    console.error('List Food Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching foods'
    });
  }
};

const removeFood = async (req, res) => {
  try {
    const { id } = req.params; 

    const food = await foodModel.findByIdAndDelete(id);
    if (!food) {
      return res.status(404).json({ 
        success: false, 
        message: 'Food not found' 
      });
    }
    if (food.public_id) {
      await cloudinary.uploader.destroy(food.public_id)
        .catch(err => console.error('Cloudinary Deletion Error:', err));
    }

    res.status(200).json({ 
      success: true, 
      message: 'Food deleted successfully',
      deletedItem: food
    });

  } catch (error) {
    console.error('Remove Food Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting food'
    });
  }
};

module.exports = { addFood, listFood, removeFood };