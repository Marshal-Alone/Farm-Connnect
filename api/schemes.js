import express from 'express';
import { getDatabase, collections } from '../database.js';

const router = express.Router();

// GET /api/schemes - List all schemes with optional filters
router.get('/', async (req, res) => {
    console.log('📋 [GET /api/schemes] Request received', { query: req.query, timestamp: new Date().toISOString() });
    try {
        const { category, state, search } = req.query;
        const db = await getDatabase();
        const schemesCollection = db.collection(collections.schemes);

        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (state && state !== 'all') {
            query.state = { $in: [state, 'All States'] };
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { nameHindi: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const schemes = await schemesCollection
            .find(query)
            .sort({ priority: -1, createdAt: -1 })
            .toArray();

        const mappedSchemes = schemes.map(s => ({
            ...s,
            id: s._id.toString()
        }));

        console.log(`✅ [GET /api/schemes] Success, found ${schemes.length} schemes`);
        res.json({
            success: true,
            data: mappedSchemes
        });
    } catch (error) {
        console.error('Error fetching schemes:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch schemes' });
    }
});

// GET /api/schemes/:id - Get scheme details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const schemesCollection = db.collection(collections.schemes);
        const { ObjectId } = await import('mongodb');

        const scheme = await schemesCollection.findOne({ _id: new ObjectId(id) });

        if (!scheme) {
            return res.status(404).json({ success: false, error: 'Scheme not found' });
        }

        res.json({
            success: true,
            data: scheme
        });
    } catch (error) {
        console.error('Error fetching scheme details:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch scheme details' });
    }
});

export default router;
