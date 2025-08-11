const axios = require('axios');

// Store auth token globally
let authToken = null;

// Function to get auth token
async function getAuthToken(credentials) {
    try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
            email: credentials.email,
            name: credentials.name,
            rollNo: credentials.rollNo,
            accessCode: credentials.accessCode,
            clientID: credentials.clientID,
            clientSecret: credentials.clientSecret
        });
        
        authToken = response.data.access_token;
        console.log('Auth token obtained successfully');
        return authToken;
    } catch (error) {
        console.error('Failed to get auth token:', error.message);
        throw error;
    }
}

// Main logging function
async function Log(stack, level, packageName, message) {
    // Basic validation
    const validStacks = ['backend', 'frontend'];
    const validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
    const validPackages = [
        // Backend only
        'cache', 'controller', 'cron_job', 'db', 'domain', 'handler', 'repository', 'route', 'service',
        // Frontend only
        'api', 'component', 'hook', 'page', 'state', 'style',
        // Both
        'auth', 'config', 'middleware', 'utils'
    ];

    // Check if values are valid
    if (!validStacks.includes(stack)) {
        console.error('Invalid stack. Must be: backend or frontend');
        return;
    }
    
    if (!validLevels.includes(level)) {
        console.error('Invalid level. Must be: debug, info, warn, error, or fatal');
        return;
    }
    
    if (!validPackages.includes(packageName)) {
        console.error('Invalid package name');
        return;
    }

    // Check if we have auth token
    if (!authToken) {
        console.error('No auth token available. Please call getAuthToken first');
        return;
    }

    try {
        const response = await axios.post(
            'http://20.244.56.144/evaluation-service/logs',
            {
                stack: stack,
                level: level,
                package: packageName,
                message: message
            },
            {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Log sent successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to send log:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

// Export functions
module.exports = {
    Log,
    getAuthToken
};