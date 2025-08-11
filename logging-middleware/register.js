const axios = require('axios');

async function register() {
    try {
        const response = await axios.post('http://20.244.56.144/evaluation-service/register', {
            email: "Rupesh.chidupudi_2026@woxsen.edu.in", 
            name: "Rupesh Chidupudi", 
            mobileNo: "8008085560", 
            githubUsername: "chidupudi", 
            rollNo: "22WU0101024", 
            accessCode: "UMXVQT" 
        });
        
        console.log('Registration successful!');
        console.log('SAVE THESE CREDENTIALS:');
        console.log('Client ID:', response.data.clientID);
        console.log('Client Secret:', response.data.clientSecret);
        console.log('Email:', response.data.email);
        
        return response.data;
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
    }
}

// Run registration
register();