import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vercel and local development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://chethiyasankalpa456_db_user:FVz2OxSzcN5ExIZz@cluster0.hwhei7q.mongodb.net/property_lk?retryWrites=true&w=majority";

let dbClient = null;
let db = null;

async function initDb() {
  if (!db) {
    dbClient = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    await dbClient.connect();
    db = dbClient.db('property_lk');
    console.log('Connected to MongoDB Atlas database successfully!');
  }
  return db;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// GET all properties
app.get('/api/properties', async (req, res) => {
  try {
    const database = await initDb();
    const properties = await database.collection('properties').find({}).sort({ createdAt: -1 }).toArray();
    const cleaned = properties.map(p => {
      const { _id, ...rest } = p;
      return { ...rest, id: rest.id || _id.toString() };
    });
    res.json(cleaned);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ error: err.message });
  }
});

// POST new property
app.post('/api/properties', async (req, res) => {
  try {
    const database = await initDb();
    const property = req.body;
    if (!property || !property.title) {
      return res.status(400).json({ error: 'Property title is required' });
    }

    const timestamp = Date.now();
    const id = property.id || `prop_${timestamp}`;
    const referenceId = property.referenceId || `PLK-${Math.floor(1000 + Math.random() * 9000)}`;

    const newProperty = {
      ...property,
      id,
      referenceId,
      createdAt: property.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFeatured: Boolean(property.isFeatured),
      isSold: Boolean(property.isSold),
      price: Number(property.price) || 0,
      hidePrice: Boolean(property.hidePrice),
      isNegotiable: Boolean(property.isNegotiable)
    };

    await database.collection('properties').updateOne(
      { id },
      { $set: newProperty },
      { upsert: true }
    );

    res.status(201).json(newProperty);
  } catch (err) {
    console.error('Error adding property:', err);
    res.status(500).json({ error: err.message });
  }
});

// PUT update property
app.put('/api/properties', async (req, res) => {
  try {
    const database = await initDb();
    const { id, ...updates } = req.body;
    if (!id) {
      return res.status(400).json({ error: 'Property id is required' });
    }

    const updatedData = {
      ...updates,
      updatedAt: new Date().toISOString()
    };

    if (updates.price !== undefined) {
      updatedData.price = Number(updates.price) || 0;
    }

    await database.collection('properties').updateOne(
      { id },
      { $set: updatedData }
    );

    res.json({ success: true, id, updatedData });
  } catch (err) {
    console.error('Error updating property:', err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE property
app.delete('/api/properties', async (req, res) => {
  try {
    const database = await initDb();
    const id = req.query?.id || req.body?.id;
    if (!id) {
      return res.status(400).json({ error: 'Property id is required' });
    }

    await database.collection('properties').deleteOne({
      $or: [
        { id: id },
        { referenceId: id },
        { id: String(id) }
      ]
    });
    res.json({ success: true, id });
  } catch (err) {
    console.error('Error deleting property:', err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`PROPERTY LK Backend Server running on port ${PORT}`);
});
