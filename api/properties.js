import { connectToDatabase } from './db.js';

// Without MONGODB_URI the app still works: the client falls back to the bundled
// /listings.json. Reads return an empty list and writes return 503, so an
// unconfigured database is reported as a deliberate state instead of a 500.
const DB_CONFIGURED = Boolean(process.env.MONGODB_URI);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  // Lets the browser read the header that reports whether a database is attached.
  res.setHeader('Access-Control-Expose-Headers', 'X-DB-Configured');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (!DB_CONFIGURED) {
    res.setHeader('X-DB-Configured', 'false');
    if (req.method === 'GET') {
      return res.status(200).json([]);
    }
    return res.status(503).json({
      error: 'Database backend is not configured. Changes are stored locally in the browser.',
      code: 'DB_NOT_CONFIGURED'
    });
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('properties');

    // 1. GET ALL PROPERTIES
    if (req.method === 'GET') {
      const properties = await collection.find({}).sort({ createdAt: -1 }).toArray();
      // Clean Mongo _id for frontend compatibility
      const cleaned = properties.map(p => {
        const { _id, ...rest } = p;
        return { ...rest, id: rest.id || _id.toString() };
      });
      return res.status(200).json(cleaned);
    }

    // 2. ADD PROPERTY (POST)
    if (req.method === 'POST') {
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

      await collection.updateOne(
        { id },
        { $set: newProperty },
        { upsert: true }
      );

      return res.status(201).json(newProperty);
    }

    // 3. UPDATE PROPERTY (PUT / PATCH)
    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { id, ...updates } = req.body;
      if (!id) {
        return res.status(400).json({ error: 'Property id is required for update' });
      }

      const updatedData = {
        ...updates,
        updatedAt: new Date().toISOString()
      };

      if (updates.price !== undefined) {
        updatedData.price = Number(updates.price) || 0;
      }

      await collection.updateOne(
        { id },
        { $set: updatedData }
      );

      return res.status(200).json({ success: true, id, updatedData });
    }

    // 4. DELETE PROPERTY (DELETE)
    if (req.method === 'DELETE') {
      const id = req.query?.id || req.body?.id;
      if (!id) {
        return res.status(400).json({ error: 'Property id is required for deletion' });
      }

      await collection.deleteOne({
        $or: [
          { id: id },
          { referenceId: id },
          { id: String(id) }
        ]
      });
      return res.status(200).json({ success: true, id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('MongoDB API Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Database Error' });
  }
}
