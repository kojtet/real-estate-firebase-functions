const express = require('express');
const router = express.Router();
const Location = require('../controllers/locationsController');

router.get('/regions', Location.getRegions);

router.get('/cities', Location.getSchemeCities);

router.get('/cities/:id', Location.getCity);

router.post('/regions', Location.addRegion);

router.post('/cities', Location.addCity);

module.exports = router;