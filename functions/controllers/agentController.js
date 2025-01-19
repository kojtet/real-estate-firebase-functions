const { db } = require("../config/config");
const collection = db.collection("users");

// Get All Agents
exports.getAgents = async (req, res) => {
  try {
    const snapshot = await collection.where("role", "==", "Agent").orderBy("email", "asc").get();
    const agents = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(agents);
  } catch (err) {
    console.error("Error fetching agents:", err);
    res.status(500).send({ message: "Error fetching agents", error: err.message });
  }
};

// Get Agent By ID
exports.getAgentById = async (req, res) => {
  const { id } = req.params;

  try {
    const agentDoc = await collection.doc(id).get();
    if (!agentDoc.exists) {
      return res.status(404).send({ message: "Agent not found." });
    }
    res.status(200).send({ id: agentDoc.id, ...agentDoc.data() });
  } catch (err) {
    console.error("Error fetching agent by ID:", err);
    res.status(500).send({ message: "Error fetching agent", error: err.message });
  }
};

// Create a New Agent
exports.createAgent = async (req, res) => {
  const { email, name, phone, agency, description } = req.body;

  if (!email || !name || !phone || !agency) {
    return res.status(400).send({ message: "All fields are required." });
  }

  try {
    const newAgent = {
      email,
      name,
      phone,
      agency,
      description: description || "",
      role: "Agent",
      createdAt: new Date(),
    };

    const agentRef = await collection.add(newAgent);
    res.status(201).send({ message: "Agent created successfully", id: agentRef.id });
  } catch (err) {
    console.error("Error creating agent:", err);
    res.status(500).send({ message: "Error creating agent", error: err.message });
  }
};

// Update Agent
exports.updateAgent = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    await collection.doc(id).update(updates);
    res.status(200).send({ message: "Agent updated successfully." });
  } catch (err) {
    console.error("Error updating agent:", err);
    res.status(500).send({ message: "Error updating agent", error: err.message });
  }
};

// Delete Agent
exports.deleteAgent = async (req, res) => {
  const { id } = req.params;

  try {
    await collection.doc(id).delete();
    res.status(200).send({ message: "Agent deleted successfully." });
  } catch (err) {
    console.error("Error deleting agent:", err);
    res.status(500).send({ message: "Error deleting agent", error: err.message });
  }
};
