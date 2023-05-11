const { db } = require("../config/config");
const collection = db.collection("categories");

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await collection.get();
        let allCategories = [];
        categories.forEach((doc) => {
        allCategories.push(doc.data());
        });
        return res.status(200).json({
            data: allCategories,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}