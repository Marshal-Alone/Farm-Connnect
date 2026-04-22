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

/**
 * Initialize database collections and indexes
 * Call this once on application startup
 */
export async function initializeCollections() {
    try {
        const database = await getDatabase();

        // Create collections if they don't exist
        const collectionList = await database.listCollections().toArray();
        const existingCollections = new Set(collectionList.map(c => c.name));

        // Create farmer crops collection
        if (!existingCollections.has(collections.farmerCrops)) {
            await database.createCollection(collections.farmerCrops);
            console.log(`Created collection: ${collections.farmerCrops}`);
        }

        // Add indexes for farmerCrops
        const cropsCollection = database.collection(collections.farmerCrops);
        await cropsCollection.createIndex({ userId: 1 });
        await cropsCollection.createIndex({ status: 1 });
        await cropsCollection.createIndex({ createdAt: -1 });

        // Create crop actions collection
        if (!existingCollections.has(collections.cropActions)) {
            await database.createCollection(collections.cropActions);
            console.log(`Created collection: ${collections.cropActions}`);
        }

        // Add indexes for cropActions
        const actionsCollection = database.collection(collections.cropActions);
        await actionsCollection.createIndex({ userId: 1 });
        await actionsCollection.createIndex({ cropId: 1 });
        await actionsCollection.createIndex({ actionDate: -1 });
        await actionsCollection.createIndex({ userId: 1, actionDate: -1 });

        // Create crop recommendations collection with TTL
        if (!existingCollections.has(collections.cropRecommendations)) {
            await database.createCollection(collections.cropRecommendations);
            console.log(`Created collection: ${collections.cropRecommendations}`);
        }

        // Add indexes for cropRecommendations
        const recommendationsCollection = database.collection(collections.cropRecommendations);
        await recommendationsCollection.createIndex({ userId: 1 });
        await recommendationsCollection.createIndex({ createdAt: -1 });
        
        // TTL index: documents expire 24 hours after expiresAt
        try {
            await recommendationsCollection.createIndex(
                { expiresAt: 1 },
                { expireAfterSeconds: 0 } // Expire at the expiresAt timestamp
            );
            console.log('Created TTL index on cropRecommendations.expiresAt');
        } catch (error) {
            console.log('TTL index already exists or could not be created');
        }

        console.log('✅ Database collections and indexes initialized');
    } catch (error) {
        console.error('Error initializing database collections:', error);
        throw error;
    }
}

// Collections
export const collections = {
    users: 'users',
    machinery: 'machinery',
    schemes: 'schemes',
    bookings: 'bookings',
    diseases: 'diseases',
    messages: 'messages',
    conversations: 'conversations',
    farmerCrops: 'farmerCrops',
    cropActions: 'cropActions',
    cropRecommendations: 'cropRecommendations'
};
