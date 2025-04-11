const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  areaSizes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AreaSize'
  }],
  propertyTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyType'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;