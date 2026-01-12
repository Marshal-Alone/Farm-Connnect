import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const uri = process.env.MONGO_URI || "mongodb+srv://trylaptop2024:trylaptop2024@cluster0.q8qtgtu.mongodb.net/?appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db = null;

export async function connectToDatabase() {
    if (db) return db;

    try {
        await client.connect();
        db = client.db("FarmConnect");
        console.log("Successfully connected to MongoDB!");
        return db;
    } catch (error) {
        console.error("Failed to connect to MongoDB:", error);
        throw error;
    }
}

export async function getDatabase() {
    if (!db) {
        await connectToDatabase();
    }
    return db;
}

// Collections
export const collections = {
    users: 'users',
    machinery: 'machinery',
    schemes: 'schemes',
    bookings: 'bookings',
    diseases: 'diseases',
    messages: 'messages',
    conversations: 'conversations'
};
