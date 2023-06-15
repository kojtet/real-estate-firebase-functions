// Desc: user controller
const { db } = require("../config/config");
const collection = db.collection("users");
const reportCollection = db.collection("reports");
const products = db.collection("products");

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
  const {role} = req.query;
  try {
    let items = [];
    if(role){
      const snapshot = await collection.where("role", "==", role).orderBy("name", "asc").get();
      snapshot.forEach((doc) => {
        items.push(doc.data());
      });
    }
    else{
      const snapshot = await collection.get();
      snapshot.forEach((doc) => {
        items.push(doc.data());
      });
    }

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

// like listing

exports.likeListing = async (req, res) => {
  const { id, userId} = req.params;
  const document = products.doc(id);
  const listing = await document.get();
  try {
    if (!listing.exists) {
      return res.status(404).json({ error: "Listing not found" });
      }
      await document.update({
          favouritedBy: admin.firestore.FieldValue.arrayUnion(userId)
      });
    await collection.doc(userId).collection("likes").add({listingId: id});
    await products.doc(id).update({favouritedBy: FieldValue.arrayUnion(userId)})
    res.status(200).send("Listing Liked");
  }
  catch (err) {
    res.status(500).send({ message: "Error Liking", error: err.message });
  }
};

// get liked listings
exports.getLikedListings = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await collection.doc(id).collection("likes").get();
    const items = [];
    snapshot.forEach((doc) => {
      items.push(doc.data());
    });
    res.status(200).send(items);
  } catch (err) {
    console.log(err);

  }
}

//add activity


//get user activities



