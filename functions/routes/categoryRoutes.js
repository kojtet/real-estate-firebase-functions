const express = require("express");
const router = express.Router();
const Category = require("../controllers/categoriesController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all categories
router.get("/", authMiddleware, Category.getAllCategories);

// Get category by ID
router.get("/:id", authMiddleware, Category.getCategoryById);

// Create a new category
router.post("/", authMiddleware, Category.createCategory);

// Update category by ID
router.patch("/:id", authMiddleware, Category.updateCategory);

// Delete category by ID
router.delete("/:id", authMiddleware, Category.deleteCategory);

module.exports = router;
