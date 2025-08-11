const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeLogging, Log } = require('./src/utils/logger');

// Import routes
const urlRoutes = require('./src/routes/urlRoutes');
const redirectRoutes = require('./src/routes/redirectRoutes');

const app = express();
const PORT =  8080;

// Initialize logging first
async function startServer() {
    try {
        // Initialize logging middleware
        const success = await initializeLogging();
        
        if (!success) {
            console.error('Failed to initialize logging');
            process.exit(1);
        }

        await Log("backend", "info", "config", "Server initialization started");

        // Middleware
        app.use(cors({
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        // Logging middleware for all requests
        app.use(async (req, res, next) => {
            await Log("backend", "info", "middleware", `${req.method} ${req.path}`);
            next();
        });

        // Health check endpoint - MUST be before redirect routes
        app.get('/health', async (req, res) => {
            await Log("backend", "info", "handler", "Health check requested");
            res.json({ status: 'OK', timestamp: new Date().toISOString() });
        });

        // Routes
        app.use('/shorturls', urlRoutes);
        app.use('/', redirectRoutes);

        // Error handling middleware
        app.use(async (err, req, res, next) => {
            await Log("backend", "error", "middleware", `Error: ${err.message}`);
            res.status(500).json({ error: 'Internal server error' });
        });

        // 404 handler
        app.use(async (req, res) => {
            await Log("backend", "warn", "handler", `404 - Route not found: ${req.path}`);
            res.status(404).json({ error: 'Route not found' });
        });

        // Start server
        app.listen(PORT, async () => {
            await Log("backend", "info", "config", `Server started on port ${PORT}`);
            console.log(`✅ Server running on http://localhost:${PORT}`);
            console.log(`✅ Health check: http://localhost:${PORT}/health`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();