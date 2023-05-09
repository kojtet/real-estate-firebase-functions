// Desc: user controller
const { db } = require("../config/config");
const collection = db.collection("users");
const reportCollection = db.collection("reports");

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

exports.addUserNotification = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await collection.doc(id).collection("notifications").add(data);
    res.status(200).send("Notification added successfully");
  } catch (err) {
    res.status(500).send({ message: "Error adding notification", error: err });
  }
};

// get user notifications
exports.getUserNotifications = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await collection.doc(id).collection("notifications").get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push(doc.data());
    });
    res.status(200).send(items);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// block user
exports.blockUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await collection.doc(id).collection("blocked").add(data);
    res.status(200).send("User Blocked");
  } catch (err) {
    res.status(500).send({ message: "Error Blocked", error: err });
  }
};

// unblock user
exports.unblockUser = async (req, res) => {
  const { id } = req.params;
  const { blockId } = req.body;
  try {
    await collection.doc(id).collection("blocked").doc(blockId).delete();
    res.status(200).send("User Unblocked");
  } catch (err) {
    res.status(500).send({ message: "Error Unblocking", error: err });
  }
};
  
//get block users
exports.getBlockedUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await collection.doc(id).collection("blocked").get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push(doc.data());
    });
    res.status(200).send(items);
  } catch (err) {
    console.log(err);
  }
};

// follow user
exports.followUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await collection.doc(id).collection("following").add(data);
    await collection.doc(data.followerId).collection("followers").add({
      followerId: id,
    });
    res.status(200).send("Agent Followed");
  } catch (err) {
    res.status(500).send({ message: "Error Following", error: err });
  }
};

// unfollow user
exports.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { followId } = req.body;
  try {
    await collection.doc(id).collection("following").where("followerId","==", followId).get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });

    await collection.doc(followId).collection("followers").where("followerId","==", id).get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        doc.ref.delete();
      });
    });
    res.status(200).send("Agent Unfollowed");
  } catch (err) {
    res.status(500).send({ message: "Error Unfollowing", error: err });
  }
};

//get user followers
exports.getUserFollowers = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await collection.doc(id).collection("followers").get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push(doc.data());
    });
    res.status(200).send(items);
  } catch (err) {
    console.log(err);
  }
};

// get user following
exports.getUserFollowing = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await collection.doc(id).collection("following").get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push(doc.data());
    });
    res.status(200).send(items);
  } catch (err) {
    console.log(err);
  }
};

// report user
exports.reportUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await collection.doc(id).collection("reports").add(data);
    await reportCollection.add({id,...data});
    res.status(200).send("User Reported");
  } catch (err) {
    res.status(500).send({ message: "Error Reporting", error: err });
  }
};


