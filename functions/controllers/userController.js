const { db, auth } = require("../config/config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const collection = db.collection("users");
const reportCollection = db.collection("reports");
const products = db.collection("products");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET; // Replace with a secure key stored in .env file

// Helper function to generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "7d" });
};

// Signup
exports.signup = async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).send({ message: "All fields are required." });
  }

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });

    await collection.doc(userRecord.uid).set({
      email,
      name,
      role,
      createdAt: new Date(),
    });

    res.status(201).send({ message: "User created successfully", userId: userRecord.uid });
  } catch (err) {
    res.status(500).send({ message: "Error creating user", error: err.message });
  }
};

// Signin
exports.signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: "Email and password are required." });
  }

  try {
    const userRecord = await auth.getUserByEmail(email);
    const userDoc = await collection.doc(userRecord.uid).get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found." });
    }

    const userData = userDoc.data();

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userRecord.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid email or password." });
    }

    // Generate JWT
    const token = generateToken(userRecord.uid);

    res.status(200).send({
      message: "Login successful",
      token,
      user: {
        id: userRecord.uid,
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    });
  } catch (err) {
    res.status(500).send({ message: "Error signing in", error: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    await collection.doc(id).update(data);
    res.status(200).send({ message: "User updated successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error updating user", error: err.message });
  }
};

// Get All Users
exports.getUsers = async (req, res) => {
  const { role } = req.query;
  try {
    const query = role
      ? collection.where("role", "==", role).orderBy("name", "asc")
      : collection;
    const snapshot = await query.get();
    const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ message: "Error fetching users", error: err.message });
  }
};

// Get User by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const userDoc = await collection.doc(id).get();
    if (!userDoc.exists) {
      return res.status(404).send({ message: "User not found." });
    }
    res.status(200).send({ id: userDoc.id, ...userDoc.data() });
  } catch (err) {
    res.status(500).send({ message: "Error fetching user", error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).delete();
    await auth.deleteUser(id);
    res.status(200).send({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error deleting user", error: err.message });
  }
};

// Add User Notification
exports.addUserNotification = async (req, res) => {
  const { id } = req.params;
  const data = req.body;
  try {
    await collection.doc(id).collection("notifications").add({
      ...data,
      createdAt: new Date(),
    });
    res.status(200).send({ message: "Notification added successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error adding notification", error: err.message });
  }
};

// Get User Notifications
exports.getUserNotifications = async (req, res) => {
  const { id } = req.params;
  try {
    const snapshot = await collection.doc(id).collection("notifications").get();
    const notifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(notifications);
  } catch (err) {
    res.status(500).send({ message: "Error fetching notifications", error: err.message });
  }
};

// Block User
exports.blockUser = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).update({ blocked: true });
    res.status(200).send({ message: "User blocked successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error blocking user", error: err.message });
  }
};

// Unblock User
exports.unblockUser = async (req, res) => {
  const { id } = req.params;
  try {
    await collection.doc(id).update({ blocked: false });
    res.status(200).send({ message: "User unblocked successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error unblocking user", error: err.message });
  }
};

// Follow User
exports.followUser = async (req, res) => {
  const { id } = req.params;
  const { followId } = req.body;
  try {
    await collection.doc(id).collection("following").doc(followId).set({
      userId: followId,
      followedAt: new Date(),
    });
    res.status(200).send({ message: "User followed successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error following user", error: err.message });
  }
};

// Unfollow User
exports.unfollowUser = async (req, res) => {
  const { id } = req.params;
  const { followId } = req.body;
  try {
    await collection.doc(id).collection("following").doc(followId).delete();
    res.status(200).send({ message: "User unfollowed successfully." });
  } catch (err) {
    res.status(500).send({ message: "Error unfollowing user", error: err.message });
  }
};

// Get Blocked Users
exports.getBlockedUsers = async (req, res) => {
  try {
    const snapshot = await collection.where("blocked", "==", true).get();
    const blockedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).send(blockedUsers);
  } catch (err) {
    res.status(500).send({ message: "Error fetching blocked users", error: err.message });
  }
};