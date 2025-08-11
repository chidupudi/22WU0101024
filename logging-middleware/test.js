const { Log, getAuthToken } = require('./index.js');

async function testLogging() {
    try {
        // Replace these with your actual credentials from registration
        await getAuthToken({
            email: "Rupesh.chidupudi_2026@woxsen.edu.in",
            name: "Rupesh Chidupudi",
            rollNo: "22WU0101024",
            accessCode: "UMXVQT",
            clientID: "ddf871ef-396f-46e8-8699-08b092196a24",
            clientSecret: "tFcAsMvURZsDZjvh"
        });
        
        console.log('Testing logging...');
        
        // Test with shorter messages (under 48 characters)
        await Log("backend", "info", "handler", "App started successfully");
        await Log("frontend", "debug", "component", "Component loaded");
        await Log("backend", "error", "db", "DB connection failed");
        
        console.log('All tests completed successfully!');
        
    } catch (error) {
        console.error('Test failed:', error.message);
    }
}

testLogging();