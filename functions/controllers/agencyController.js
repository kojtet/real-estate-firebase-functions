const { db } = require("../config/config");
const collection = db.collection("users");

// Get All Agencies
exports.getAgencies = async (req, res) => {
  try {
    const snapshot = await collection.where("role", "==", "Agency").get();
    const agencies = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(agencies);
  } catch (err) {
    console.error("Error fetching agencies:", err);
    res.status(500).send({ message: "Error fetching agencies", error: err.message });
  }
};

// Get Agency By ID
exports.getAgencyById = async (req, res) => {
  const { id } = req.params;

  try {
    const agencyDoc = await collection.doc(id).get();
    if (!agencyDoc.exists) {
      return res.status(404).send({ message: "Agency not found." });
    }
    res.status(200).send({ id: agencyDoc.id, ...agencyDoc.data() });
  } catch (err) {
    console.error("Error fetching agency by ID:", err);
    res.status(500).send({ message: "Error fetching agency", error: err.message });
  }
};

// Create a New Agency
exports.createAgency = async (req, res) => {
  const { email, name, address, phone, description } = req.body;

  if (!email || !name || !address || !phone) {
    return res.status(400).send({ message: "All fields are required." });
  }

  try {
    const newAgency = {
      email,
      name,
      address,
      phone,
      description: description || "",
      role: "Agency",
      createdAt: new Date(),
    };

    const agencyRef = await collection.add(newAgency);
    res.status(201).send({ message: "Agency created successfully", id: agencyRef.id });
  } catch (err) {
    console.error("Error creating agency:", err);
    res.status(500).send({ message: "Error creating agency", error: err.message });
  }
};

// Update Agency
exports.updateAgency = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    await collection.doc(id).update(updates);
    res.status(200).send({ message: "Agency updated successfully." });
  } catch (err) {
    console.error("Error updating agency:", err);
    res.status(500).send({ message: "Error updating agency", error: err.message });
  }
};

// Delete Agency
exports.deleteAgency = async (req, res) => {
  const { id } = req.params;

  try {
    await collection.doc(id).delete();
    res.status(200).send({ message: "Agency deleted successfully." });
  } catch (err) {
    console.error("Error deleting agency:", err);
    res.status(500).send({ message: "Error deleting agency", error: err.message });
  }
};
