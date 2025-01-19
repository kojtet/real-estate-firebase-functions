const express = require("express");
const router = express.Router();
const Location = require("../controllers/locationsController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all regions
router.get("/regions", authMiddleware, Location.getRegions);

// Get all scheme cities
router.get("/cities", authMiddleware, Location.getSchemeCities);

// Get a single city by ID
router.get("/cities/:id", authMiddleware, Location.getCity);

// Add a new region
router.post("/regions", authMiddleware, Location.addRegion);

// Add a new city
router.post("/cities", authMiddleware, Location.addCity);

module.exports = router;
