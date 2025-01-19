const express = require("express");
const router = express.Router();
const Agency = require("../controllers/agencyController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all agencies
router.get("/", authMiddleware, Agency.getAgencies);

// Get agency by ID
router.get("/:id", authMiddleware, Agency.getAgencyById);

// Create a new agency
router.post("/", authMiddleware, Agency.createAgency);

// Update agency by ID
router.patch("/:id", authMiddleware, Agency.updateAgency);

// Delete agency by ID
router.delete("/:id", authMiddleware, Agency.deleteAgency);

module.exports = router;
