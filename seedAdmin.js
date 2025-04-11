require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User"); // Adjust path if needed

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@example.com" });
    if (adminExists) {
      console.log("Admin already exists");
      mongoose.connection.close();
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const adminUser = new User({
      name: "Admin User",
      email: "admin123@example.com",
      password: "admin124",
      phone:"033333333333",
      role: "admin",
      address:"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
      cnic:"1111111111111111111111111",
      gender:"male",
      createdBy: null,
      updatedBy: null
    });

    await adminUser.save();
    console.log("Admin user added successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting admin user:", error);
  }
};

seedAdmin();
