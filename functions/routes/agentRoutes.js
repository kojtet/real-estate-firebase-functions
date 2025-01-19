const express = require("express");
const router = express.Router();
const Agent = require("../controllers/agentController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all agents
router.get("/", authMiddleware, Agent.getAgents);

// Get agent by ID
router.get("/:id", authMiddleware, Agent.getAgentById);

// Create a new agent
router.post("/", authMiddleware, Agent.createAgent);

// Update agent by ID
router.patch("/:id", authMiddleware, Agent.updateAgent);

// Delete agent by ID
router.delete("/:id", authMiddleware, Agent.deleteAgent);

module.exports = router;
