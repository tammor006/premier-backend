const express = require("express");
const { createProperty,getAllProperties,getPropertyById,updateProperty,deleteProperty,changeStatus,getPropertyTypesByCategory,getAreaSizesByCategory,getPublicProperties,getPublicPropertyById } = require("../controllers/propertyController");
const { protect, admin } = require("../middleware/authMiddleware");
const  upload  = require("../middleware/uploadMiddleware");
const categoryController = require('../controllers/categoryController');
const router = express.Router();
debugger
router.get('/public', getPublicProperties);
router.get('/public/:id', getPublicPropertyById);
router.get('/categories/public', categoryController.getPublicCategories);
router.post('/',upload.array("images"), protect, createProperty); // Create Property
router.get('/', protect, getAllProperties); // Get All Properties
router.get('/:id', protect, getPropertyById); // Get Property by ID
router.put('/:id', upload.array("images"), protect, updateProperty); // Update Property
router.delete('/:id',protect, deleteProperty); // Delete Property
router.patch("/:id/approve", protect, admin,changeStatus);
router.get('/categories/:categoryId/property-types', protect, getPropertyTypesByCategory);
router.get('/categories/:categoryId/area-sizes', protect, getAreaSizesByCategory);

module.exports = router;