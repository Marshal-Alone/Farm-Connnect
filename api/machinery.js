import express from 'express';
import { getDatabase, collections } from '../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// GET /api/machinery - Get all machinery with filters
router.get('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);

        const {
            type,
            location,
            minPrice,
            maxPrice,
            minRating,
            available,
            search,
            sortBy = 'createdAt',
            sortOrder = 'desc',
            page = 1,
            limit = 12
        } = req.query;

        // Build filter query
        const filter = { isActive: true };

        if (type && type !== 'all') {
            filter.type = type;
        }

        if (location && location !== 'all') {
            filter['location.state'] = { $regex: location, $options: 'i' };
        }

        if (minPrice || maxPrice) {
            filter.pricePerDay = {};
            if (minPrice) filter.pricePerDay.$gte = parseFloat(minPrice);
            if (maxPrice) filter.pricePerDay.$lte = parseFloat(maxPrice);
        }

        if (minRating) {
            filter.rating = { $gte: parseFloat(minRating) };
        }

        if (available === 'true') {
            filter.available = true;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

        // Pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute query
        const machinery = await machineryCollection
            .find(filter)
            .sort(sort)
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        // Get total count for pagination
        const total = await machineryCollection.countDocuments(filter);

        res.json({
            success: true,
            data: machinery,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching machinery:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch machinery' });
    }
});

// GET /api/machinery/nearby - Get nearby machinery based on coordinates
router.get('/nearby', async (req, res) => {
    try {
        const { latitude, longitude, radius = 50 } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }

        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);

        // Find machinery within radius (in km)
        const machinery = await machineryCollection.find({
            isActive: true,
            available: true,
            'location.coordinates': {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [parseFloat(longitude), parseFloat(latitude)]
                    },
                    $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
                }
            }
        }).toArray();

        res.json({
            success: true,
            data: machinery
        });
    } catch (error) {
        console.error('Error fetching nearby machinery:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch nearby machinery' });
    }
});

// GET /api/machinery/:id - Get single machinery by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);

        const machinery = await machineryCollection.findOne({
            _id: new ObjectId(id),
            isActive: true
        });

        if (!machinery) {
            return res.status(404).json({
                success: false,
                error: 'Machinery not found'
            });
        }

        // Increment view count
        await machineryCollection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { views: 1 } }
        );

        res.json({
            success: true,
            data: machinery
        });
    } catch (error) {
        console.error('Error fetching machinery:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch machinery' });
    }
});

// POST /api/machinery - Create new machinery (owner only)
router.post('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);

        const machineryData = {
            ...req.body,
            rating: 0,
            totalReviews: 0,
            bookedDates: [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isActive: true,
            views: 0,
            totalBookings: 0
        };

        const result = await machineryCollection.insertOne(machineryData);

        res.status(201).json({
            success: true,
            data: {
                _id: result.insertedId,
                ...machineryData
            }
        });
    } catch (error) {
        console.error('Error creating machinery:', error);
        res.status(500).json({ success: false, error: 'Failed to create machinery' });
    }
});

// PUT /api/machinery/:id - Update machinery (owner only)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);

        const updateData = {
            ...req.body,
            updatedAt: new Date()
        };

        // Remove fields that shouldn't be updated directly
        delete updateData._id;
        delete updateData.rating;
        delete updateData.totalReviews;
        delete updateData.createdAt;
        delete updateData.views;
        delete updateData.totalBookings;

        const result = await machineryCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Machinery not found'
            });
        }

        res.json({
            success: true,
            message: 'Machinery updated successfully'
        });
    } catch (error) {
        console.error('Error updating machinery:', error);
        res.status(500).json({ success: false, error: 'Failed to update machinery' });
    }
});

// DELETE /api/machinery/:id - Delete machinery (soft delete)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);

        const result = await machineryCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    isActive: false,
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Machinery not found'
            });
        }

        res.json({
            success: true,
            message: 'Machinery deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting machinery:', error);
        res.status(500).json({ success: false, error: 'Failed to delete machinery' });
    }
});

// GET /api/machinery/:id/availability - Check availability for dates
router.get('/:id/availability', async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Start date and end date are required'
            });
        }

        const db = await getDatabase();
        const machineryCollection = db.collection(collections.machinery);

        const machinery = await machineryCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!machinery) {
            return res.status(404).json({
                success: false,
                error: 'Machinery not found'
            });
        }

        // Check if dates overlap with existing bookings
        const requestStart = new Date(startDate);
        const requestEnd = new Date(endDate);

        const isAvailable = !machinery.bookedDates.some(booking => {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);

            return (requestStart <= bookingEnd && requestEnd >= bookingStart);
        });

        res.json({
            success: true,
            available: isAvailable && machinery.available,
            bookedDates: machinery.bookedDates
        });
    } catch (error) {
        console.error('Error checking availability:', error);
        res.status(500).json({ success: false, error: 'Failed to check availability' });
    }
});

export default router;
