const { db } = require("../config/config");
const collection = db.collection("users");

//get all providers
exports.getProviders = async (req, res) => {
    try{
         const snapshot = await collection.where("role", "==", "Service Provider").get();
         const items = [];
         snapshot.forEach((doc) => {
                items.push(doc.data());
            });
            res.status(200).send(items);
    }catch(err){
         console.log(err);
    }
}

exports.getProviderById = async (req, res) => {
    const { id } = req.params;
    try{
         const snapshot = await collection.doc(id).get();
         const item = snapshot.data();
         res.status(200).send(item);
    }catch(err){
         console.log(err);
    }
}

// add provider portfolio

exports.addPortfolio = async (req, res) => {
     const {id} = req.params;
     try{
          const newPortfolio = {
               serviceProviderId: id,
               title: req.body.title,
               images: req.body.images,
               description: req.body.description,
               dateCreated: new Date().toISOString()
          }
          const snapshot = await collection.doc(id).collection("portfolios").add(newPortfolio);
          res.status(201).json({
               message: `Portfolio added successfully`,
               id: snapshot.id,
               portfolio: newPortfolio
          });
     }catch(err){
          res.status(500).json({error: err.message});

     }
}

// get provider portfolios
exports.getPortfolios = async (req, res) => {
     const {id} = req.params;
     try{
          const snapshot = await collection.doc(id).collection("portfolios").get();
          const items = [];
          snapshot.forEach((doc) => {
               items.push(doc.data());
          });
          res.status(200).send(items);
     }catch(err){
          console.log(err);
     }
}

// get provider portfolio by id
exports.getPortfolioById = async (req, res) => {
     const {id} = req.params;
     const {portfolioId} = req.params;
     try{
          const snapshot = await collection.doc(id).collection("portfolios").doc(portfolioId).get();
          const item = snapshot.data();
          res.status(200).send(item);
     }catch(err){
          res.status(500).json({error: err.message});
     }
}

// update provider portfolio
exports.updatePortfolio = async (req, res) => {
     const {id} = req.params;
     const {portfolioId} = req.params;
     try{
          const document = collection.doc(id).collection("portfolios").doc(portfolioId);
          const snapshot = await document.get();
          if(!snapshot.exists){
               return res.status(404).json({error: "Portfolio not found"});
          }
          await document.update(req.body);
          return res.status(200).json({message: "Portfolio updated successfully"});
     }catch(err){
          console.log(err);
          return res.status(500).json({error: err.code});
     }
}