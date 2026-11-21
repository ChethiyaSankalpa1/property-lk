import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://chethiyasankalpa456_db_user:FVz2OxSzcN5ExIZz@cluster0.hwhei7q.mongodb.net/property_lk?retryWrites=true&w=majority";

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
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
