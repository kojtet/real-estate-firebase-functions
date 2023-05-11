const { db } = require("../config/config");
const cityCollection = db.collection("cities");
const regionCollection = db.collection("regions");

// get all regions
exports.getRegions = async (req, res) => {
    try {
        const regions = await regionCollection.get();
        const regionsList = [];
        regions.forEach((region) => {
            regionsList.push(region.data());
        });
        return res.status(200).json(regionsList);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// get scheme cities
exports.getSchemeCities = async (req, res) => {
    try {
        const cities = await cityCollection.get();
        const citiesList = [];
        cities.forEach((city) => {
            citiesList.push(city.data());
        });
        return res.status(200).json(citiesList);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// get city
exports.getCity = async (req, res) => {
    const { id } = req.params;
    try {
        const city = await cityCollection.doc(id).get();
        return res.status(200).json(city.data());
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// add operational region
exports.addRegion = async (req, res) => {
    const data = req.body;
    try {
        await regionCollection.add(data);
        return res.status(200).json({ message: "Region added successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// add city
exports.addCity = async (req, res) => {
    const data = req.body;
    try {
        await cityCollection.add(data);
        return res.status(200).json({ message: "City added successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
