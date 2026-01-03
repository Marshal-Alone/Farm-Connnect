import express from 'express';
import { getDatabase, collections } from '../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// POST /api/diseases - Save a detection result
router.post('/', async (req, res) => {
    console.log('📋 [POST /api/diseases] Request received', { crop: req.body.crop, disease: req.body.disease, timestamp: new Date().toISOString() });
    try {
        const db = await getDatabase();
        const diseasesCollection = db.collection(collections.diseases);

        const {
            userId,
            crop,
            disease,
            confidence,
            severity,
            imageUrl,
            location,
            treatment,
            prevention
        } = req.body;

        const record = {
            userId: userId || null,
            crop,
            disease,
            confidence,
            severity,
            imageUrl: imageUrl || null,
            location: location || null,
            treatment: treatment || [],
            prevention: prevention || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await diseasesCollection.insertOne(record);

        console.log('✅ [POST /api/diseases] Success', { id: result.insertedId, timestamp: new Date().toISOString() });
        res.status(201).json({
            success: true,
            data: { _id: result.insertedId, ...record }
        });
    } catch (error) {
        console.error('Error saving disease detection:', error);
        res.status(500).json({ success: false, error: 'Failed to save detection' });
    }
});

// GET /api/diseases/user/:userId - Get detection history for a user
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const db = await getDatabase();
        const diseasesCollection = db.collection(collections.diseases);

        const detections = await diseasesCollection
            .find({ userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .toArray();

        const mappedDetections = detections.map(d => ({
            ...d,
            id: d._id.toString()
        }));

        res.json({
            success: true,
            data: mappedDetections
        });
    } catch (error) {
        console.error('Error fetching disease history:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch history' });
    }
});

export default router;
