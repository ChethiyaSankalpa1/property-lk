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
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  // Lets the browser read the header that reports whether a database is attached.
  exposedHeaders: ['X-DB-Configured']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Never hardcode credentials here. Create a local .env file with MONGODB_URI=...
const MONGODB_URI = process.env.MONGODB_URI;

// Without MONGODB_URI the app is still fully usable: the client falls back to the
// bundled /listings.json. Requests are answered with an empty list (reads) or a
// 503 (writes) instead of a 500, so an unconfigured database is reported as a
// deliberate state rather than an internal failure.
const DB_CONFIGURED = Boolean(MONGODB_URI);

// Returns true when the response has already been sent because no database exists.
function rejectWithoutDatabase(res) {
  if (DB_CONFIGURED) return false;
  res.set('X-DB-Configured', 'false');
  res.status(503).json({
    error: 'Database backend is not configured. Changes are stored locally in the browser.',
    code: 'DB_NOT_CONFIGURED'
  });
  return true;
}

let dbClient = null;
let db = null;

async function initDb() {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not configured. Add it to your .env file to use the optional database backend.');
  }
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
  if (!DB_CONFIGURED) {
    // Nothing to read without a database. An empty list lets the client use its
    // /listings.json fallback and avoids logging a failed request on every poll.
    res.set('X-DB-Configured', 'false');
    return res.json([]);
  }
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
  if (rejectWithoutDatabase(res)) return;
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
  if (rejectWithoutDatabase(res)) return;
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
  if (rejectWithoutDatabase(res)) return;
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
