const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');
const { Log } = require('../utils/logger');

// Reserved paths that should not be treated as shortcodes
const reservedPaths = ['health', 'api', 'admin', 'public', 'static', 'assets', 'favicon.ico'];

// Middleware to filter out reserved paths
router.use('/:shortcode', async (req, res, next) => {
    const { shortcode } = req.params;
    
    // Skip reserved paths
    if (reservedPaths.includes(shortcode.toLowerCase())) {
        await Log("backend", "warn", "route", `Reserved path blocked: ${shortcode}`);
        return res.status(404).json({ error: 'Route not found' });
    }
    
    // Only allow valid shortcode patterns (alphanumeric, 3+ chars)
    if (!/^[a-zA-Z0-9]{3,}$/.test(shortcode)) {
        await Log("backend", "warn", "route", `Invalid shortcode format: ${shortcode}`);
        return res.status(404).json({ error: 'Invalid shortcode format' });
    }
    
    await Log("backend", "info", "route", `Redirect route: ${shortcode}`);
    next();
});

// GET /:shortcode - Handle redirection
router.get('/:shortcode', urlController.handleRedirect);

module.exports = router;