const urlModel = require('../models/urlModel');
const { Log } = require('../utils/logger');

class UrlController {
    // Create short URL
    async createShortUrl(req, res) {
        try {
            await Log("backend", "info", "controller", "Create short URL request");

            const { url, validity, shortcode } = req.body;

            // Validation
            if (!url) {
                await Log("backend", "error", "controller", "Missing URL in request");
                return res.status(400).json({ error: 'URL is required' });
            }

            const validityMinutes = validity || 30;

            // Create URL
            const urlData = await urlModel.createUrl(url, shortcode, validityMinutes);
            
            await Log("backend", "info", "controller", `Short URL created: ${urlData.shortcode}`);

            res.status(201).json({
                shortLink: urlData.shortLink,
                expiry: urlData.expiry
            });

        } catch (error) {
            await Log("backend", "error", "controller", `Create URL error: ${error.message}`);
            
            if (error.message.includes('Invalid URL') || 
                error.message.includes('Invalid shortcode') || 
                error.message.includes('already exists')) {
                return res.status(400).json({ error: error.message });
            }
            
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Get URL statistics
    async getStatistics(req, res) {
        try {
            const { shortcode } = req.params;
            
            await Log("backend", "info", "controller", `Stats request for: ${shortcode}`);

            const stats = await urlModel.getStatistics(shortcode);
            
            if (!stats) {
                await Log("backend", "warn", "controller", `Stats not found: ${shortcode}`);
                return res.status(404).json({ error: 'Short URL not found' });
            }

            res.json({
                originalUrl: stats.url.originalUrl,
                shortcode: stats.url.shortcode,
                createdAt: stats.url.createdAt,
                expiry: stats.url.expiry,
                totalClicks: stats.totalClicks,
                clicks: stats.clicks
            });

        } catch (error) {
            await Log("backend", "error", "controller", `Stats error: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Handle redirection
    async handleRedirect(req, res) {
        try {
            const { shortcode } = req.params;
            
            await Log("backend", "info", "controller", `Redirect request: ${shortcode}`);

            // Get referrer and user agent
            const referrer = req.get('Referer') || '';
            const userAgent = req.get('User-Agent') || '';
            const ip = req.ip || req.connection.remoteAddress || '';

            // Record click and get original URL
            const originalUrl = await urlModel.recordClick(shortcode, referrer, userAgent, ip);

            if (!originalUrl) {
                const url = urlModel.getUrl(shortcode);
                if (!url) {
                    await Log("backend", "warn", "controller", `URL not found: ${shortcode}`);
                    return res.status(404).json({ error: 'Short URL not found' });
                } else {
                    await Log("backend", "warn", "controller", `Expired URL: ${shortcode}`);
                    return res.status(410).json({ error: 'Short URL has expired' });
                }
            }

            await Log("backend", "info", "controller", `Redirecting to: ${originalUrl.substring(0, 30)}`);

            // Redirect
            res.redirect(302, originalUrl);

        } catch (error) {
            await Log("backend", "error", "controller", `Redirect error: ${error.message}`);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

module.exports = new UrlController();