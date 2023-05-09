const { db } = require("../config/config");
const collection = db.collection("newsletter");

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

