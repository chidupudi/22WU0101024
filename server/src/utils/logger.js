const axios = require('axios');

let authToken = null;

async function initializeLogging() {
    try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/auth', {
            email: "Rupesh.chidupudi_2026@woxsen.edu.in",
            name: "Rupesh Chidupudi",
            rollNo: "22WU0101024",
            accessCode: "UMXVQT",
            clientID: "ddf871ef-396f-46e8-8699-08b092196a24",
            clientSecret: "tFcAsMvURZsDZjvh"
        });
        
        authToken = response.data.access_token;
        console.log('Backend logging initialized successfully');
        return true;
    } catch (error) {
        console.error('Failed to initialize backend logging:', error.message);
        return false;
    }
}

async function Log(stack, level, packageName, message) {
    if (!authToken) {
        console.error('Logging not initialized');
        return;
    }

    const truncatedMessage = message.substring(0, 47);

    try {
        await axios.post('http://20.244.56.144/evaluation-service/logs', {
            stack: stack,
            level: level,
            package: packageName,
            message: truncatedMessage
        }, {
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
        console.log(`✅ LOG: [${stack}] [${level}] [${packageName}] ${truncatedMessage}`);
    } catch (error) {
        console.error('Backend logging failed:', error.message);
    }
}

module.exports = { initializeLogging, Log };