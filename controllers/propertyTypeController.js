const PropertyType = require('../models/propertyType');
exports.getAllPropertyTypes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [propertyTypes, total] = await Promise.all([
    PropertyType.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    PropertyType.countDocuments()
  ]);

  res.json({
    success: true,
    count: propertyTypes.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: propertyTypes
  });
};
exports.createPropertyType = async (req, res) => {
  const { name} = req.body;
  const propertyType = await PropertyType.create({
    name,
  });

  res.status(201).json({
    success: true,
    data: propertyType
  });
};
exports.updatePropertyType = async (req, res) => {
  const { name} = req.body;
  let updateData = { name};
  const propertyType = await PropertyType.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true, runValidators: true }
  );

  if (!propertyType) {
    return res.status(404).json({
      success: false,
      message: 'Property type not found'
    });
  }

  res.json({
    success: true,
    data: propertyType
  });
};
exports.deletePropertyType = async (req, res) => {
  const propertyType = await PropertyType.findByIdAndDelete(req.params.id);

  if (!propertyType) {
    return res.status(404).json({
      success: false,
      message: 'Property type not found'
    });
  }

  res.json({
    success: true,
    data: {}
  });
};