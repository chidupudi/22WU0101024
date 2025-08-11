const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { Log } = require('../utils/logger');

// POST /shorturls - Create short URL
router.post('/', async (req, res, next) => {
    await Log("backend", "info", "route", "URL creation route accessed");
    next();
}, urlController.createShortUrl);

// GET /shorturls/:shortcode - Get statistics
router.get('/:shortcode', async (req, res, next) => {
    await Log("backend", "info", "route", `Stats route: ${req.params.shortcode}`);
    next();
}, urlController.getStatistics);

module.exports = router;