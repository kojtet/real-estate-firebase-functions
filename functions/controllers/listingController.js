const { db } = require("../config/config");
const collection = db.collection("products");

// Get all listings
exports.getAllListings = async (req, res) => {
    
    const { category, price} = req.query
    try {
        let listings = [];
        if(category && price){   
            listings = await collection
            .where("category", "==", category)
            .where("price", "<=", price)
            .orderBy("price")
            .orderBy("dateCreated", "desc")
            .get();

        }else if(category && !price){
            listings = await collection
            .where("category", "==", category)
            .orderBy("dateCreated", "desc")
            .get();
            
        }else if(!category && price){
            listings = await collection
            .where("price", "<=", price)
            .orderBy("price")
            .get();
        }else{
            listings = await collection.orderBy("dateCreated", "desc").get();
        }
        let allListings = [];
        listings.forEach((doc) => {
        allListings.push(doc.data());
        });
        return res.status(200).json({
            parms: req.query,
            data: allListings,
           
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
};


// Get a single listing
exports.getListing = async (req, res) => {
    try {
        const listing = await collection.doc(req.params.id).get();
        if (!listing.exists) {
        return res.status(404).json({ error: "Listing not found" });
        }
        return res.status(200).json(listing.data());
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}


// Create a listing
exports.createListing = async (req, res) => {
    try {
        const newListing = {
        address: req.body.address,
        city: req.body.city,
        category: req.body.category,
        closeToPublicTransport: req.body.closeToPublicTransport,
        createdBy: req.body.createdBy,
        detailDescription: req.body.detailDescription,
        favouritedBy: [],
        images: req.body.images,
        keywords: req.body.keywords,
        location: req.body.location,
        price: req.body.price,
        numberOfBaths: req.body.numberOfBaths,
        numberOfRooms: req.body.numberOfRooms,
        typeOfPurchase: req.body.typeOfPurchase,
        videoUrl: req.body.videoUrl,
        yearBuilt: req.body.yearBuilt,
        parking: req.body.parking,
        region: req.body.region,
        squareFeet: req.body.squareFeet,
        status: req.body.status,
        title: req.body.title,
        cityView: req.body.cityView,
        swimmingPool: req.body.swimmingPool,
        ghanaWater: req.body.ghanaWater,
        petFriendly: req.body.petFriendly,
        furnished: req.body.furnished,
        security: req.body.security,
        gated: req.body.gated,
        landscape: req.body.landscape,
        registered: req.body.registered,
        currency: req.body.currency,
        rentFrequency: req.body.rentFrequency,
        plots: req.body.plots,
        wasteManagement: req.body.wasteManagement,
        dateCreated: new Date().toISOString(),
        };
        const listing = await collection.add(newListing);
        return res.status(201).json({ message: `Listing ${listing.id} created successfully` });
    } catch (err) {
        console.log(err);
        return res.status(500).json( err.message );
    }
}

// Update a listing
exports.updateListing = async (req, res) => {
    try {
        const document = collection.doc(req.params.id);
        const listing = await document.get();
        if (!listing.exists) {
        return res.status(404).json({ error: "Listing not found" });
        }
        await document.update(req.body);
        return res.status(200).json({ message: "Listing updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}

// Delete a listing
exports.deleteListing = async (req, res) => {
    try {
        const document = collection.doc(req.params.id);
        const listing = await document.get();
        if (!listing.exists) {
        return res.status(404).json({ error: "Listing not found" });
        }
        await document.delete();
        return res.status(200).json({ message: "Listing deleted successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}

// search listings by keywords
exports.searchListings = async (req, res) => {
    try {
        const {searchTerm} = req.params;
        const listings = await collection
        .where('keywords', 'array-contains', searchTerm)
        .get();
        let allListings = [];
        listings.forEach((doc) => {
        allListings.push(doc.data());
        });
        return res.status(200).json(allListings);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}

// Get all listings by a user
exports.getUserListings = async (req, res) => {
    try {
        const listings = await collection.where("createdBy", "==", req.params.id).get();
        let allListings = [];
        listings.forEach((doc) => {
        allListings.push(doc.data());
        });
        return res.status(200).json(allListings);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.message });
    }
}

// get similar listings
exports.getSimilarListings = async (req, res) => {
    try {
        const {category, id} = req.params;
        const listings = await collection
        .where("category", "==", category)
        .where("id", "!=", id)
        .limit(4)
        .get();
        let allListings = [];
        listings.forEach((doc) => {
        allListings.push(doc.data());
        });
        return res.status(200).json(allListings);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.getLikedListings = async (req, res) => {   
    try {
        const {id} = req.params;
        const listings = await collection
        .where("favouritedBy", "array-contains", id)
        .get();
        let allListings = [];
        listings.forEach((doc) => {
        allListings.push(doc.data());
        });
        return res.status(200).json(allListings);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

exports.addlikedListing = async (req, res) => {
    try {
        const {id, userId} = req.params;
        const document = collection.doc(id);
        const listing = await document.get();
        if (!listing.exists) {
        return res.status(404).json({ error: "Listing not found" });
        }
        await document.update({
            favouritedBy: admin.firestore.FieldValue.arrayUnion(userId)
        });
        return res.status(200).json({ message: "Listing updated successfully" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}