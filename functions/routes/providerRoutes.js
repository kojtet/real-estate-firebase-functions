const express = require('express');
const router = express.Router();
const Provider = require('../controllers/providerController');

router.get('/', Provider.getProviders);

router.get('/:id', Provider.getProviderById);

module.exports = router;