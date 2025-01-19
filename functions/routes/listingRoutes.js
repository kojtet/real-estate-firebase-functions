const express = require("express");
const router = express.Router();
const Listing = require("../controllers/listingController");
const authMiddleware = require("../middleware/authMiddleware");

// Get all listings
router.get("/", authMiddleware, Listing.getAllListings);

// Get featured listings
router.get("/featured", authMiddleware, Listing.getFeaturedListings);

// Get a single listing
router.get("/:id", authMiddleware, Listing.getListing);

// Create a new listing
router.post("/", authMiddleware, Listing.createListing);

// Update a listing
router.patch("/:id", authMiddleware, Listing.updateListing);

// Delete a listing
router.delete("/:id", authMiddleware, Listing.deleteListing);

// Get listings by user
router.get("/user/:id", authMiddleware, Listing.getUserListings);

// Get similar listings
router.get("/similar/:id", authMiddleware, Listing.getSimilarListings);

module.exports = router;
