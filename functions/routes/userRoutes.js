const express = require("express");
const User = require("../controllers/userController");

const router = express.Router();

router.route("/").get(User.getUsers);

router.route("/:id").get(User.getUserById)

router.route("/:id").delete(User.deleteUser);

router.route("/:id").patch(User.updateUser);

router.route("/:id/notifications").post(User.addUserNotification);

router.route("/:id/notifications").get(User.getUserNotifications);

router.route("/:id/block").post(User.blockUser);

router.route("/:id/unblock").delete(User.unblockUser);

router.route("/:id/blocked").get(User.getBlockedUsers);

router.route("/:id/follow").post(User.followUser);

router.route("/:id/unfollow").delete(User.unfollowUser);

router.route("/:id/followers").get(User.getUserFollowers);

router.route("/:id/following").get(User.getUserFollowing);

router.route("/:id/reportUser").post(User.reportUser);

router.route("/like/:userId/:id").post(User.likeListing);

router.route("/liked/:id").get(User.getLikedListings);







module.exports = router;
