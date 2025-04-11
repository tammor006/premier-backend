const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      console.log("Auth Header:", req.headers.authorization);
      console.log(process.env.CLOUDINARY_CLOUD_NAME)
      // ✅ Extract token correctly
      const token = req.headers.authorization.split(" ")[1];

      // ✅ Use full token for verification
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Decoded JWT:", decoded);

      // ✅ Find user from DB
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};
const admin = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect,admin };
