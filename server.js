const dotenv= require("dotenv");
dotenv.config();
const express = require("express");
const connectDB = require("./db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const areaSizeRoutes = require('./routes/areaSizeRoutes');
const propertyTypeRoutes = require('./routes/propertyTypeRoutes');

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://premiermarketing.vercel.app/", // Allow frontend
    credentials: true, // Allow cookies (if needed)
  }));
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/properties", propertyRoutes);
app.use('/api/area-sizes', areaSizeRoutes);
app.use('/api/property-types', propertyTypeRoutes);
connectDB();
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));