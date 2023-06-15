const { db } = require("../config/config");
const collection = db.collection("newsletter");
const allregions = db.collection("listingRegions")

// add new email to newsletter collection
exports.sendEmai = async (req, res) => {
    try {
        const newEmail = {
            ...req.body,
            dateCreated: new Date().toISOString(),
        };
        await collection.add(newEmail);
        return res.status(200).json({ message: "Email added to newsletter" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}


// add new email to newsletter collection
exports.addEmail = async (req, res) => {
    try {
        const newEmail = {
            email: req.body.email,
            dateCreated: new Date().toISOString(),
        };
        await collection.add(newEmail);
        return res.status(200).json({ message: "Email added to newsletter" });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}

// get all emails from newsletter collection
exports.getAllEmails = async (req, res) => {
    try {
        const data = await collection.get();
        let emails = [];
        data.forEach((doc) => {
            emails.push({
                email: doc.data().email,
                dateCreated: doc.data().dateCreated,
            });
        });
        return res.status(200).json(emails);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.code });
    }
}

//get listing regions

exports.getAllRegions = async (req,res) => {
    try{
        const data = await allregions.orderBy("name", "asc").get();
        let regions = [];
        data.forEach((doc) => {
            regions.push(doc.data())
        });
        return res.status(200).json(regions)
    }
    catch (err){
        return res.status(500).json({error: err.message})
    }
}