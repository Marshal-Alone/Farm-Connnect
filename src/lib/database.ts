import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = "mongodb+srv://trylaptop2025:trylaptop2025@cluster0.q8qtgtu.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db: any = null;

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
  farms: 'farms',
  machinery: 'machinery',
  schemes: 'schemes',
  bookings: 'bookings',
  diseases: 'diseases',
  predictions: 'predictions'
};