import mongoDB from "./mongoDB";

let isConnected = false;

export async function connectToDatabase() {
    if (isConnected) return;

    try {
        await mongoDB.connect();
        isConnected = true;
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection error:', error);
        throw new Error('Could not connect to MongoDB');
    }
}