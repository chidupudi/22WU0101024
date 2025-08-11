const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const { Log } = require('../utils/logger');

class UrlModel {
    constructor() {
        // In-memory storage (for demo purposes)
        this.urls = new Map(); // shortcode -> url data
        this.clicks = new Map(); // shortcode -> click array
    }

    // Generate random shortcode
    generateShortcode() {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 6; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // Check if shortcode exists
    shortcodeExists(shortcode) {
        return this.urls.has(shortcode);
    }

    // Validate URL format
    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    // Create new short URL
    async createUrl(originalUrl, customShortcode = null, validityMinutes = 30) {
        await Log("backend", "info", "model", `Creating URL: ${originalUrl.substring(0, 20)}...`);
        
        // Validation
        if (!this.isValidUrl(originalUrl)) {
            await Log("backend", "error", "model", "Invalid URL format provided");
            throw new Error('Invalid URL format');
        }

        let shortcode = customShortcode;
        
        // Generate shortcode if not provided
        if (!shortcode) {
            do {
                shortcode = this.generateShortcode();
            } while (this.shortcodeExists(shortcode));
        } else {
            // Validate custom shortcode
            if (!/^[a-zA-Z0-9]+$/.test(shortcode) || shortcode.length < 3) {
                await Log("backend", "error", "model", "Invalid shortcode format");
                throw new Error('Invalid shortcode format');
            }
            
            if (this.shortcodeExists(shortcode)) {
                await Log("backend", "error", "model", `Shortcode already exists: ${shortcode}`);
                throw new Error('Shortcode already exists');
            }
        }

        // Create URL data
        const now = moment();
        const expiry = moment().add(validityMinutes, 'minutes');
        
        const urlData = {
            id: uuidv4(),
            originalUrl,
            shortcode,
            shortLink: `http://localhost:8080/${shortcode}`,
            createdAt: now.toISOString(),
            expiry: expiry.toISOString(),
            validityMinutes,
            clickCount: 0
        };

        // Store URL and initialize clicks array
        this.urls.set(shortcode, urlData);
        this.clicks.set(shortcode, []);
        
        await Log("backend", "info", "model", `URL created successfully: ${shortcode}`);
        return urlData;
    }

    // Get URL by shortcode
    getUrl(shortcode) {
        return this.urls.get(shortcode);
    }

    // Record click
    async recordClick(shortcode, referrer = '', userAgent = '', ip = '') {
        await Log("backend", "info", "model", `Recording click for: ${shortcode}`);
        
        const url = this.urls.get(shortcode);
        if (!url) {
            await Log("backend", "warn", "model", `URL not found: ${shortcode}`);
            return null;
        }

        // Check if expired
        if (moment().isAfter(moment(url.expiry))) {
            await Log("backend", "warn", "model", `Expired URL accessed: ${shortcode}`);
            return null;
        }

        // Record click
        const clickData = {
            timestamp: moment().toISOString(),
            referrer: referrer || 'Direct',
            userAgent: userAgent || 'Unknown',
            ip: ip || '127.0.0.1',
            location: 'Hyderabad, IN' // Mock location
        };

        const clicks = this.clicks.get(shortcode);
        clicks.push(clickData);
        
        // Update click count
        url.clickCount++;
        
        await Log("backend", "info", "model", `Click recorded: ${shortcode} (${url.clickCount})`);
        return url.originalUrl;
    }

    // Get statistics
    async getStatistics(shortcode) {
        await Log("backend", "info", "model", `Getting stats for: ${shortcode}`);
        
        const url = this.urls.get(shortcode);
        if (!url) {
            await Log("backend", "warn", "model", `Stats not found: ${shortcode}`);
            return null;
        }

        const clicks = this.clicks.get(shortcode) || [];
        
        return {
            url,
            clicks,
            totalClicks: url.clickCount
        };
    }

    // Get all URLs (for debugging)
    getAllUrls() {
        return Array.from(this.urls.values());
    }
}

// Singleton instance
const urlModel = new UrlModel();
module.exports = urlModel;