const express = require('express');
const {
  getAllPropertyTypes,
  createPropertyType,
  updatePropertyType,
  deletePropertyType
} = require('../controllers/propertyTypeController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getAllPropertyTypes)
  .post(protect, admin, createPropertyType);

router.route('/:id')
  .put(protect, admin, updatePropertyType)
  .delete(protect, admin, deletePropertyType);

module.exports = router;