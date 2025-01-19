const { db } = require("../config/config");
const cityCollection = db.collection("cities");
const regionCollection = db.collection("regions");

// Get all regions
exports.getRegions = async (req, res) => {
  try {
    const snapshot = await regionCollection.get();
    const regions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all scheme cities
exports.getSchemeCities = async (req, res) => {
  try {
    const snapshot = await cityCollection.get();
    const cities = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(cities);
  } catch (error) {
    console.error("Error fetching scheme cities:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get a single city by ID
exports.getCity = async (req, res) => {
  const { id } = req.params;
  try {
    const cityDoc = await cityCollection.doc(id).get();
    if (!cityDoc.exists) {
      return res.status(404).json({ message: "City not found" });
    }
    res.status(200).json({ id: cityDoc.id, ...cityDoc.data() });
  } catch (error) {
    console.error("Error fetching city:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a new region
exports.addRegion = async (req, res) => {
  const data = req.body;
  try {
    const newRegion = await regionCollection.add(data);
    res.status(201).json({ message: "Region added successfully", id: newRegion.id });
  } catch (error) {
    console.error("Error adding region:", error);
    res.status(500).json({ error: error.message });
  }
};

// Add a new city
exports.addCity = async (req, res) => {
  const data = req.body;
  try {
    const newCity = await cityCollection.add(data);
    res.status(201).json({ message: "City added successfully", id: newCity.id });
  } catch (error) {
    console.error("Error adding city:", error);
    res.status(500).json({ error: error.message });
  }
};
