const { db } = require("../config/config");
const collection = db.collection("categories");

// Get all categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await collection.orderBy("name","asc").get();
        let allCategories = [];
        categories.forEach((doc) => {
        allCategories.push(doc.data());
        });
        return res.status(200).send(allCategories)
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}