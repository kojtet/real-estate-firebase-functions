const express = require("express");
const User = require("../controllers/userController");

const router = express.Router();

router.route("/").get(User.getUsers);

router.route("/:id").get(User.getUserById)

router.route("/:id").delete(User.deleteUser);

router.route("/:id").patch(User.updateUser);


module.exports = router;
