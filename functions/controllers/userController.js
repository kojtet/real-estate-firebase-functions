// Desc: user controller
const { db } = require("../config/config");
const collection = db.collection("users");

//update user
exports.updateUser = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    await collection.doc(id).update(data);
    res.status(200).send("User updated successfully");
  } catch (err) {
    res.status(500).send({ message: "Error updating user", error: err });
  }
};

//get all users
exports.getUsers = async (req, res) => {
  try {
    const snapshot = await collection.get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push(doc.data());
    });
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send(err);
  }
};

//get user by id
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await collection.doc(id).get();
    const item = snapshot.data();
    res.status(200).send(item);
  } catch (err) {
    res.statatus(500).send(err);
  }
};


//delete user
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    res.status(200).send("User deleted successfully");
  } catch (err) {
    res.status(500).send({ message: "Error deleting user", error: err });
  }
}