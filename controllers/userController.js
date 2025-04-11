const User = require("../models/User");

// @desc   Get all users
// @route  GET /api/users
const getAllUsers = async (req, res) => {
  try {
    
    const users = await User.find().populate("createdBy updatedBy", "name email");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// @desc   Update user
// @route  PUT /api/users/:id
const updateUser = async (req, res) => {
  try {
    const { name, email,phone, gender,cnic,address} = req.body;
    const userId = req.params.id;
    const updatedBy = req.user.id;

    let user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.email=email ||user.email;
    user.address=address || user.address;
    user.cnic=cnic || user.cnic;
    user.updatedBy = updatedBy;
    user.updatedAt = Date.now();

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user from the database
    await user.deleteOne();

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllUsers,updateUser,deleteUser};