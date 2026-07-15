import mongoDB from "./mongoDB";
import { setServers } from "node:dns"

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) return;
    setServers(["1.1.1.1", "8.8.8.8"])
    try {
        await mongoDB.connect();
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Service temporarily unavailable, please try again later.');
    }
}