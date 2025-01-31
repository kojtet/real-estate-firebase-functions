const express = require("express");
const User = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// User Authentication Routes
router.route("/signup").post(User.signup);
router.route("/signin").post(User.signin);

// User Management Routes
router.route("/")
  .get(authMiddleware, User.getUsers);

router.route("/:id")
  .get(authMiddleware, User.getUserById)
  .delete(authMiddleware, User.deleteUser)
  .patch(authMiddleware, User.updateUser);

// User Notifications
router.route("/:id/notifications")
  .post(authMiddleware, User.addUserNotification)
  .get(authMiddleware, User.getUserNotifications);

// Block/Unblock Users
// router.route("/:id/block").post(authMiddleware, User.blockUser);
router.route("/:id/unblock").delete(authMiddleware, User.unblockUser);
router.route("/:id/blocked").get(authMiddleware, User.getBlockedUsers);

// Follow/Unfollow Users
// router.route("/:id/follow").post(authMiddleware, User.followUser);
// router.route("/:id/unfollow").delete(authMiddleware, User.unfollowUser);
// router.route("/:id/followers").get(authMiddleware, User.getUserFollowers);
// router.route("/:id/following").get(authMiddleware, User.getUserFollowing);

// // Report User
// router.route("/:id/reportUser").post(authMiddleware, User.reportUser);

// // Liked Listings
// router.route("/like/:userId/:id").post(authMiddleware, User.likeListing);
// router.route("/liked/:id").get(authMiddleware, User.getLikedListings);

module.exports = router;
