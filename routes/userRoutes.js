const express = require("express");
const { getAllUsers, updateUser,deleteUser } = require("../controllers/userController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getAllUsers);
router.delete('/:id', protect, admin, deleteUser);
router.put("/:id", protect, updateUser);

module.exports = router;