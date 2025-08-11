import axios from 'axios';

let authToken = null;

export async function initializeLogging() {
    console.log('Starting authentication with proxy...');
    
    try {
        // Use relative URL - proxy will forward to http://20.244.56.144
        const response = await axios.post('/evaluation-service/auth', {
            email: "Rupesh.chidupudi_2026@woxsen.edu.in",
            name: "Rupesh Chidupudi",
            rollNo: "22WU0101024",
            accessCode: "UMXVQT",
            clientID: "ddf871ef-396f-46e8-8699-08b092196a24",
            clientSecret: "tFcAsMvURZsDZjvh"
        });
        
        console.log('Auth response:', response.data);
        authToken = response.data.access_token;
        console.log('Real-time logging initialized successfully!');
        return true;
    } catch (error) {
        console.error('Failed to initialize logging:', error);
        console.error('Error details:', error.response?.data);
        return false;
    }
}

export async function Log(stack, level, packageName, message) {
    if (!authToken) {
        console.error('Logging not initialized');
        return;
    }

    const truncatedMessage = message.substring(0, 47);

    try {
        // Use relative URL - proxy will forward to http://20.244.56.144
        const response = await axios.post('/evaluation-service/logs', {
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
        
        console.log(`✅ LOG SENT: [${stack}] [${level}] [${packageName}] ${truncatedMessage}`);
        return response.data;
    } catch (error) {
        console.error('❌ Logging failed:', error);
        console.error('Error details:', error.response?.data);
    }
}