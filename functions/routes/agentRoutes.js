const express = require('express');
const router = express.Router();
const Agent = require('../controllers/agentController');

router.get('/', Agent.getAgents);

router.get('/:id', Agent.getAgentById);

module.exports = router;
