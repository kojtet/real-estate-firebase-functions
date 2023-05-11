const express = require('express');
const router = express.Router();
const Category = require('../controllers/categoriesController')

router.route('/').get(Category.getAllCategories);

module.exports = router;