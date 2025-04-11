const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  };
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone, gender,cnic,address,role} = req.body;
        const adminId = req.user ? req.user.id : null;
    
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });
    
        user = new User({
          name,
          email,
          password,
          phone,
          gender,
          address,
          cnic,
          role,
          createdBy: adminId, // Store who created this user
          updatedBy: adminId
        });
    
        await user.save();
        res.status(201).json({ message: "User created successfully", user });
      } catch (error) {
        res.status(500).json({ message: "Server error" });
      }
};

exports.login = async (req, res) => {
  debugger
  const { email, password } = req.body;
  try {
    debugger
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET, // ✅ Use environment secret
      { expiresIn: "1d" }
    );
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
