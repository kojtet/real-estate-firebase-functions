const { db } = require("../config/config");
const collection = db.collection("users");

//get all agencies

exports.getAgencies = async (req, res) => {
    try{
         const snapshot = await collection.where("role", "==", "Agency").get();
         const items = [];
         snapshot.forEach((doc) => {
                items.push(doc.data());
            });
            res.status(200).send(items);
    }catch(err){
         console.log(err);
    }
}

exports.getAgencyById = async (req, res) => {
    const { id } = req.params;
    try{
         const snapshot = await collection.doc(id).get();
         const item = snapshot.data();
         res.status(200).send(item);
    }catch(err){
         console.log(err);
    }
}
