const { db } = require("../config/config");
const collection = db.collection("categories");

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const snapshot = await collection.orderBy("name", "asc").get();
    const categories = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(categories);
  } catch (err) {
    console.error("Error fetching categories:", err);
    res.status(500).send({ message: "Error fetching categories", error: err.message });
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryDoc = await collection.doc(id).get();
    if (!categoryDoc.exists) {
      return res.status(404).send({ message: "Category not found." });
    }
    res.status(200).send({ id: categoryDoc.id, ...categoryDoc.data() });
  } catch (err) {
    console.error("Error fetching category by ID:", err);
    res.status(500).send({ message: "Error fetching category", error: err.message });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Name is required." });
  }

  try {
    const newCategory = {
      name,
      description: description || "",
      createdAt: new Date(),
    };

    const categoryRef = await collection.add(newCategory);
    res.status(201).send({ message: "Category created successfully", id: categoryRef.id });
  } catch (err) {
    console.error("Error creating category:", err);
    res.status(500).send({ message: "Error creating category", error: err.message });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    await collection.doc(id).update(updates);
    res.status(200).send({ message: "Category updated successfully." });
  } catch (err) {
    console.error("Error updating category:", err);
    res.status(500).send({ message: "Error updating category", error: err.message });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await collection.doc(id).delete();
    res.status(200).send({ message: "Category deleted successfully." });
  } catch (err) {
    console.error("Error deleting category:", err);
    res.status(500).send({ message: "Error deleting category", error: err.message });
  }
};
