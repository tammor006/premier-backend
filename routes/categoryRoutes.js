const express = require('express');
const { 
  createCategory, 
  getAllCategories, 
  getCategoryById, 
  updateCategory, 
  deleteCategory 
} = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/', protect, admin, upload.single('image'), createCategory);
router.get('/',protect,admin, getAllCategories);
router.get('/:id',protect,admin, getCategoryById);
router.put('/:id', protect, admin, upload.single('image'), updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

module.exports = router;