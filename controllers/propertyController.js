// /controllers/propertyController.js
const Property = require('../models/property');
// const Category = require('../models/category');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
console.log(process.env.CLOUDINARY_CLOUD_NAME)
// Configure Cloudinary (or your preferred image storage)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.getPropertyTypesByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId)
      .populate('propertyTypes');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category.propertyTypes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.getAreaSizesByCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId)
      .populate('areaSizes');
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category.areaSizes);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
exports.changeStatus = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Property not found" });

    property.status = "approved";
    await property.save();

    res.json({ message: "Property approved successfully", property });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
// Create Property
exports.createProperty = async (req, res) => {
  try {
    console.log("Incoming request body:", req.body);
    console.log("Files received:", req.files);
    
    // Verify required fields
    const requiredFields = ['name', 'description', 'price', 'address',];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Verify files were uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required" });
    }

    // Process images
    const imageUrls = [];
    for (const file of req.files) {
      console.log(`Processing file: ${file.originalname}`);
      // If using Cloudinary:
      const result = await cloudinary.uploader.upload(file.path);
      imageUrls.push(result.secure_url);
      fs.unlinkSync(file.path); // Clean up temp file
    }

    // Create property
    const newProperty = new Property({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      points: JSON.parse(req.body.points),
      address: req.body.address,
      images: imageUrls,
      location: {
        type: "Point",
        coordinates: JSON.parse(req.body.location),
      },
      category: req.body.category,
      propertyTypes: JSON.parse(req.body.propertyTypes),
      areaSizes: JSON.parse(req.body.areaSizes),
      status: req.user.role === 'admin' ? 'approved' : 'pending',
    });

    await newProperty.save();
    
    res.status(201).json({ 
      message: "Property created successfully", 
      property: newProperty 
    });
  } catch (error) {
    console.error("Detailed error:", error);
    res.status(500).json({ 
      message: "Failed to create property",
      error: error.message,
      stack: error.stack 
    });
  }
};
  

// Get All Properties
exports.getAllProperties = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5; // Adjust items per page
      const skip = (page - 1) * limit;
  
      const total = await Property.countDocuments();
      const properties = await Property.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        properties,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
      });
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Server error" });
    }
  };

// Get Property by ID
exports.getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch property', error });
  }
};

// Update Property
exports.updateProperty = async (req, res) => {
  try {
    console.log("Incoming update request body:", req.body);
    console.log("Files received for update:", req.files);
    
    const { id } = req.params;

    // Verify required fields
    const requiredFields = ['name', 'description', 'price', 'address'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    // Find the existing property
    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Process existing images (handle deletions from frontend)
    let existingImages = [];
    if (req.body.existingImages) {
      try {
        existingImages = JSON.parse(req.body.existingImages);
      } catch (e) {
        console.error("Error parsing existingImages:", e);
        return res.status(400).json({ message: "Invalid existingImages format" });
      }
    }

    // Process new images
    const newImageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        console.log(`Processing new file: ${file.originalname}`);
        try {
          const result = await cloudinary.uploader.upload(file.path);
          newImageUrls.push(result.secure_url);
          fs.unlinkSync(file.path); // Clean up temp file
        } catch (uploadError) {
          console.error(`Failed to upload image ${file.originalname}:`, uploadError);
          // Continue with other images if one fails
        }
      }
    }

    // Combine images (existing kept + new uploaded)
    const allImages = [...existingImages, ...newImageUrls];

    // Prepare updates
    const updatedData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      points: req.body.points ? JSON.parse(req.body.points) : property.points,
      address: req.body.address,
      area: req.body.area || property.area,
      images: allImages,
      location: req.body.location 
        ? { 
            type: "Point",
            coordinates: JSON.parse(req.body.location)
          } 
        : property.location,
      category: req.body.category || property.category,
      propertyTypes: req.body.propertyTypes 
        ? JSON.parse(req.body.propertyTypes) 
        : property.propertyTypes,
      areaSizes: req.body.areaSizes 
        ? JSON.parse(req.body.areaSizes) 
        : property.areaSizes,
      // Preserve status unless explicitly changed
      status: req.body.status || property.status,
      // Add updatedAt timestamp
      updatedAt: new Date()
    };

    // Update the property
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    // Verify update was successful
    if (!updatedProperty) {
      return res.status(500).json({ message: "Property update failed" });
    }

    console.log("Property updated successfully:", updatedProperty);
    
    res.status(200).json({ 
      message: "Property updated successfully", 
      property: updatedProperty 
    });
  } catch (error) {
    console.error("Detailed update error:", error);
    res.status(500).json({ 
      message: "Failed to update property",
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};


// Delete Property
exports.deleteProperty = async (req, res) => {
  try {
    const deletedProperty = await Property.findByIdAndDelete(req.params.id);
    if (!deletedProperty) return res.status(404).json({ message: 'Property not found' });

    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete property', error });
  }
};
exports.getPublicProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'approved' })
      .populate('category', 'name')
      .populate('propertyTypes', 'name')
      .populate('areaSizes', 'name');
    
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties', error: error.message });
  }
};

// Get property by ID (public endpoint)
exports.getPublicPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('category', 'name')
      .populate('propertyTypes', 'name')
      .populate('areaSizes', 'name');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ message: 'Failed to fetch property', error: error.message });
  }
};
