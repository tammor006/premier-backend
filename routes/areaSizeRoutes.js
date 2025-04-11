const express = require('express');
const {
  getAllAreaSizes,
  createAreaSize,
  updateAreaSize,
  deleteAreaSize
} = require('../controllers/areaSizeController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(getAllAreaSizes)
  .post(protect, admin, createAreaSize);

router.route('/:id')
  .put(protect, admin, updateAreaSize)
  .delete(protect, admin, deleteAreaSize);

module.exports = router;