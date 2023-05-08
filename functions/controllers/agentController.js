const { db } = require("../config/config");
const collection = db.collection("users");

//get all agents

exports.getAgents = async (req, res) => {
    try{
         const snapshot = await collection.where("role", "==", "Agent").orderby("email").get();
         const items = [];
         snapshot.forEach((doc) => {
                items.push(doc.data());
            });
            res.status(200).send(items);
    }catch(err){
         console.log(err);
    }
};

exports.getAgentById = async (req, res) => {
    const { id } = req.params;
    try{
         const snapshot = await collection.doc(id).get();
         const item = snapshot.data();
         res.status(200).send(item);
    }catch(err){
         console.log(err);
    }
}


