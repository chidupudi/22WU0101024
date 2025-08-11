import axios from 'axios';

let authToken = null;

export async function initializeLogging(){
    try{
        const response = await axios.post('http://20.244.56.144/evaluation-service/auth',{
            email: "Rupesh.chidupudi_2026@woxsen.edu.in",
            name: "Rupesh Chidupudi",
            rollNo: "22WU0101024",
            accessCode: "UMXVQT",
            clientID: "ddf871ef-396f-46e8-8699-08b092196a24",
            clientSecret: "tFcAsMvURZsDZjvh"
        });
        authToken = response.data.access_token;
        console.log('Logging initialized successfully');
    } catch (error) {
        console.error('Error initializing logging:', error);
    }
}



export async function Log(stack, level, packageName, message) {
    if (!authToken) {
        console.error('Logging not initialized');
        return;
    }
    const truncatedMessage = message.substring(0, 200);
    try{
        await axios.post('http://20.244.56.144/evaluation-service/logs', {
            stack,
            level,
            packageName,
            message: truncatedMessage
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error logging message:', error);
    }
}
