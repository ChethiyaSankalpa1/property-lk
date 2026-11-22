import { MongoClient } from 'mongodb';

// Never hardcode credentials here. Set MONGODB_URI in the hosting environment
// (e.g. Vercel Project Settings -> Environment Variables) or in a local .env file.
const MONGODB_URI = process.env.MONGODB_URI;

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. This project also works fully client-side without it.');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  const db = client.db('property_lk');

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
