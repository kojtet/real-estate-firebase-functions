const express = require('express');
const router = express.Router();
const Agency = require('../controllers/agencyController');

router.get('/', Agency.getAgencies);

router.get('/:id', Agency.getAgencyById);

module.exports = router;