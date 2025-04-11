const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const propertySchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  points: { type: [String] },
  address: { type: String, required: true },
  images: { type: [String], required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: { type: [Number], required: true },
  },
  category: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    required: true
  },
  propertyTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PropertyType'
  }],
  areaSizes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AreaSize'
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["pending", "approved"],
    default: "pending",
  }
});

propertySchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Property', propertySchema);