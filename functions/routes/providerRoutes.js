const express = require('express');
const router = express.Router();
const Provider = require('../controllers/providerController');

router.get('/', Provider.getProviders);

router.get('/:id', Provider.getProviderById);

router.post('/:id/portfolios', Provider.addPortfolio);

router.get('/:id/portfolios', Provider.getPortfolios);

router.get('/:id/portfolios/:portfolioId', Provider.getPortfolioById);

router.patch('/:id/portfolios/:portfolioId', Provider.updatePortfolio);

module.exports = router;