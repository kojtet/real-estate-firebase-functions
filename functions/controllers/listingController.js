const { db } = require("../config/config");
const collection = db.collection("products");
const admin = require("firebase-admin");

// Get all listings
exports.getAllListings = async (req, res) => {
  const { category, price, featured, featuredSales, region, city, suburb } = req.query;
  try {
    let query = collection.orderBy("dateCreated", "desc");

    if (category) query = query.where("category", "==", category);
    if (region) query = query.where("region", "==", region);
    if (city) query = query.where("city", "==", city);
    if (suburb) query = query.where("keywords", "array-contains", suburb);
    if (price) query = query.where("price", "<=", parseFloat(price)).orderBy("price");
    if (featured) query = query.where("featured", "==", "Yes").where("typeOfPurchase", "==", "For Rent");
    if (featuredSales) query = query.where("featured", "==", "Yes").where("typeOfPurchase", "==", "For Sale");

    const snapshot = await query.get();
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(listings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get a single listing
exports.getListing = async (req, res) => {
  try {
    const listing = await collection.doc(req.params.id).get();
    if (!listing.exists) return res.status(404).json({ error: "Listing not found" });
    res.status(200).json({ id: listing.id, ...listing.data() });
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ error: err.message });
  }
};

// Create a listing
exports.createListing = async (req, res) => {
  try {
    const newListing = {
      ...req.body,
      favouritedBy: [],
      keywords: [req.body.address, req.body.title, req.body.category, req.body.city],
      location: req.body.location || { latitude: 0, longitude: 0 },
      dateCreated: new Date().toISOString(),
    };

    const listing = await collection.add(newListing);
    res.status(201).json({ message: `Listing ${listing.id} created successfully`, id: listing.id });
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ error: err.message });
  }
};

// Update a listing
exports.updateListing = async (req, res) => {
  try {
    const document = collection.doc(req.params.id);
    const listing = await document.get();
    if (!listing.exists) return res.status(404).json({ error: "Listing not found" });

    await document.update(req.body);
    res.status(200).json({ message: "Listing updated successfully" });
  } catch (err) {
    console.error("Error updating listing:", err);
    res.status(500).json({ error: err.message });
  }
};

// Delete a listing
exports.deleteListing = async (req, res) => {
  try {
    const document = collection.doc(req.params.id);
    const listing = await document.get();
    if (!listing.exists) return res.status(404).json({ error: "Listing not found" });

    await document.delete();
    res.status(200).json({ message: "Listing deleted successfully" });
  } catch (err) {
    console.error("Error deleting listing:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get all listings by a user
exports.getUserListings = async (req, res) => {
  try {
    const snapshot = await collection.where("createdBy", "==", req.params.id).get();
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching user listings:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get featured listings
exports.getFeaturedListings = async (req, res) => {
  try {
    const snapshot = await collection.where("featured", "==", "Yes").get();
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(listings);
  } catch (err) {
    console.error("Error fetching featured listings:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get similar listings
exports.getSimilarListings = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, typeOfPurchase } = req.query;
    const snapshot = await collection
      .where("category", "==", category)
      .where("typeOfPurchase", "==", typeOfPurchase)
      .where(admin.firestore.FieldPath.documentId(), "!=", id)
      .get();

    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(listings);
  } catch (err) {
    console.error("Error fetching similar listings:", err);
    res.status(500).json({ error: err.message });
  }
};

// Get liked listings
exports.getLikedListings = async (req, res) => {
  try {
    const snapshot = await collection.where("favouritedBy", "array-contains", req.params.id).get();
    const listings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(listings);
  } catch (err) {
    console.error("Error fetching liked listings:", err);
    res.status(500).json({ error: err.message });
  }
};

// Add liked listing
exports.addLikedListing = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const document = collection.doc(id);
    const listing = await document.get();
    if (!listing.exists) return res.status(404).json({ error: "Listing not found" });

    await document.update({
      favouritedBy: admin.firestore.FieldValue.arrayUnion(userId),
    });
    res.status(200).json({ message: "Listing liked successfully" });
  } catch (err) {
    console.error("Error liking listing:", err);
    res.status(500).json({ error: err.message });
  }
};
