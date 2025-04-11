const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// @desc    Create a new category
// @route   POST /api/categories
// @access  Private/Admin
exports.createCategory = async (req, res) => {
  try {
    const { name, areaSizes, propertyTypes } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: 'Category image is required' 
      });
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path);
    fs.unlinkSync(req.file.path); // Remove temp file

    const category = new Category({
      name,
      image: result.secure_url,
      areaSizes: JSON.parse(areaSizes),
      propertyTypes: JSON.parse(propertyTypes)
    });

    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create category',
      error: error.message 
    });
  }
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate('areaSizes', 'name')
      .populate('propertyTypes', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch categories',
      error: error.message 
    });
  }
};

// @desc    Get single category by ID
// @route   GET /api/categories/:id
// @access  Public
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id)
      .populate('areaSizes', 'name')
      .populate('propertyTypes', 'name');

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch category',
      error: error.message 
    });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
exports.updateCategory = async (req, res) => {
  try {
    const { name, areaSizes, propertyTypes } = req.body;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        success: false,
        message: 'Category not found' 
      });
    }

    let imageUrl = category.image;
    if (req.file) {
      // Upload new image
      const result = await cloudinary.uploader.upload(req.file.path);
      fs.unlinkSync(req.file.path); // Remove temp file
      imageUrl = result.secure_url;
    }

    category.name = name || category.name;
    category.image = imageUrl;
    category.areaSizes = areaSizes ? JSON.parse(areaSizes) : category.areaSizes;
    category.propertyTypes = propertyTypes ? JSON.parse(propertyTypes) : category.propertyTypes;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update category',
      error: error.message 
    });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Optional: Delete image from Cloudinary
    // const publicId = category.image.split('/').pop().split('.')[0];
    // await cloudinary.uploader.destroy(publicId);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete category',
      error: error.message 
    });
  }
};
exports.getPublicCategories = async (req, res) => {
    try {
      const categories = await Category.find()
        .populate('propertyTypes', 'name')
        .populate('areaSizes', 'name');
      
      res.status(200).json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories', error: error.message });
    }
  };