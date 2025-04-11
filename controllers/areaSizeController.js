const AreaSize = require('../models/areaSize');
exports.getAllAreaSizes = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [areaSizes, total] = await Promise.all([
    AreaSize.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    AreaSize.countDocuments()
  ]);

  res.json({
    success: true,
    count: areaSizes.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: page,
    data: areaSizes
  });
};

// @desc    Create new area size
// @route   POST /api/area-sizes
// @access  Private/Admin
exports.createAreaSize = async (req, res) => {
  const { name } = req.body;

  const areaSize = await AreaSize.create({
    name,
  });

  res.status(201).json({
    success: true,
    data: areaSize
  });
};

// @desc    Update area size
// @route   PUT /api/area-sizes/:id
// @access  Private/Admin
exports.updateAreaSize = async (req, res) => {
  const { name } = req.body;

  const areaSize = await AreaSize.findByIdAndUpdate(
    req.params.id,
    { name },
    { new: true, runValidators: true }
  );

  if (!areaSize) {
    return res.status(404).json({
      success: false,
      message: 'Area size not found'
    });
  }

  res.json({
    success: true,
    data: areaSize
  });
};

// @desc    Delete area size
// @route   DELETE /api/area-sizes/:id
// @access  Private/Admin
exports.deleteAreaSize = async (req, res) => {
  const areaSize = await AreaSize.findByIdAndDelete(req.params.id);

  if (!areaSize) {
    return res.status(404).json({
      success: false,
      message: 'Area size not found'
    });
  }

  res.json({
    success: true,
    data: {}
  });
};