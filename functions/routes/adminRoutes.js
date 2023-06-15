const express = require('express');
const router = express.Router();
const Admin = require("../controllers/adminController")



router.route('/regions').get(Admin.getAllRegions);
router.route('/subscribe').post(Admin.addEmail);




module.exports = router;