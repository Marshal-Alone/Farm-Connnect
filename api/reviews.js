import express from 'express';
import { getDatabase, collections } from '../database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// POST /api/reviews - Submit a review
router.post('/', async (req, res) => {
    try {
        const db = await getDatabase();
        const reviewsCollection = db.collection(collections.reviews);
        const machineryCollection = db.collection(collections.machinery);
        const bookingsCollection = db.collection(collections.bookings);

        const {
            machineryId,
            bookingId,
            reviewerId,
            reviewerName,
            overallRating,
            conditionRating,
            performanceRating,
            valueForMoneyRating,
            ownerBehaviorRating,
            title,
            comment,
            pros,
            cons,
            images
        } = req.body;

        // Validate required fields
        if (!machineryId || !reviewerId || !overallRating || !comment) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Get machinery details
        const machinery = await machineryCollection.findOne({
            _id: new ObjectId(machineryId)
        });

        if (!machinery) {
            return res.status(404).json({
                success: false,
                error: 'Machinery not found'
            });
        }

        // Check if booking exists and is completed
        let isVerifiedBooking = false;
        if (bookingId) {
            const booking = await bookingsCollection.findOne({
                _id: new ObjectId(bookingId),
                renterId: reviewerId,
                machineryId: machineryId,
                status: 'completed'
            });
            isVerifiedBooking = !!booking;

            // Mark review as submitted in booking
            if (booking) {
                await bookingsCollection.updateOne(
                    { _id: new ObjectId(bookingId) },
                    {
                        $set: {
                            reviewSubmitted: true,
                            updatedAt: new Date()
                        }
                    }
                );
            }
        }

        // Create review
        const reviewData = {
            machineryId,
            machineryName: machinery.name,
            bookingId: bookingId || null,
            reviewerId,
            reviewerName,
            ownerId: machinery.ownerId,
            overallRating,
            conditionRating: conditionRating || overallRating,
            performanceRating: performanceRating || overallRating,
            valueForMoneyRating: valueForMoneyRating || overallRating,
            ownerBehaviorRating: ownerBehaviorRating || overallRating,
            title: title || null,
            comment,
            pros: pros || [],
            cons: cons || [],
            images: images || [],
            isVerifiedBooking,
            helpful: 0,
            helpfulBy: [],
            isApproved: true, // Auto-approve for now
            isFlagged: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await reviewsCollection.insertOne(reviewData);

        // Update machinery rating
        const allReviews = await reviewsCollection.find({
            machineryId,
            isApproved: true
        }).toArray();

        const totalReviews = allReviews.length;
        const avgRating = allReviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;

        await machineryCollection.updateOne(
            { _id: new ObjectId(machineryId) },
            {
                $set: {
                    rating: Math.round(avgRating * 10) / 10,
                    totalReviews,
                    updatedAt: new Date()
                }
            }
        );

        res.status(201).json({
            success: true,
            data: {
                _id: result.insertedId,
                ...reviewData
            }
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({ success: false, error: 'Failed to create review' });
    }
});

// GET /api/reviews/machinery/:machineryId - Get reviews for machinery
router.get('/machinery/:machineryId', async (req, res) => {
    try {
        const { machineryId } = req.params;
        const { page = 1, limit = 10, sortBy = 'createdAt' } = req.query;

        const db = await getDatabase();
        const reviewsCollection = db.collection(collections.reviews);

        const filter = {
            machineryId,
            isApproved: true
        };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const reviews = await reviewsCollection
            .find(filter)
            .sort({ [sortBy]: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const total = await reviewsCollection.countDocuments(filter);

        // Calculate rating statistics
        const allReviews = await reviewsCollection.find(filter).toArray();
        const stats = {
            totalReviews: allReviews.length,
            averageRating: allReviews.length > 0
                ? Math.round((allReviews.reduce((sum, r) => sum + r.overallRating, 0) / allReviews.length) * 10) / 10
                : 0,
            ratingDistribution: {
                5: allReviews.filter(r => Math.round(r.overallRating) === 5).length,
                4: allReviews.filter(r => Math.round(r.overallRating) === 4).length,
                3: allReviews.filter(r => Math.round(r.overallRating) === 3).length,
                2: allReviews.filter(r => Math.round(r.overallRating) === 2).length,
                1: allReviews.filter(r => Math.round(r.overallRating) === 1).length
            }
        };

        res.json({
            success: true,
            data: reviews,
            stats,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch reviews' });
    }
});

// PUT /api/reviews/:id - Update review
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const reviewsCollection = db.collection(collections.reviews);

        const updateData = {
            ...req.body,
            isEdited: true,
            editedAt: new Date(),
            updatedAt: new Date()
        };

        delete updateData._id;
        delete updateData.helpful;
        delete updateData.helpfulBy;
        delete updateData.createdAt;

        const result = await reviewsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review updated successfully'
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ success: false, error: 'Failed to update review' });
    }
});

// POST /api/reviews/:id/helpful - Mark review as helpful
router.post('/:id/helpful', async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;

        const db = await getDatabase();
        const reviewsCollection = db.collection(collections.reviews);

        const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        // Check if user already marked as helpful
        if (review.helpfulBy.includes(userId)) {
            // Remove helpful
            await reviewsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $pull: { helpfulBy: userId },
                    $inc: { helpful: -1 }
                }
            );
        } else {
            // Add helpful
            await reviewsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $push: { helpfulBy: userId },
                    $inc: { helpful: 1 }
                }
            );
        }

        res.json({
            success: true,
            message: 'Review helpful status updated'
        });
    } catch (error) {
        console.error('Error updating helpful status:', error);
        res.status(500).json({ success: false, error: 'Failed to update helpful status' });
    }
});

// POST /api/reviews/:id/response - Owner response to review
router.post('/:id/response', async (req, res) => {
    try {
        const { id } = req.params;
        const { comment, ownerId } = req.body;

        const db = await getDatabase();
        const reviewsCollection = db.collection(collections.reviews);

        const review = await reviewsCollection.findOne({ _id: new ObjectId(id) });

        if (!review) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        if (review.ownerId !== ownerId) {
            return res.status(403).json({
                success: false,
                error: 'Only the owner can respond to this review'
            });
        }

        await reviewsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    ownerResponse: {
                        comment,
                        respondedAt: new Date()
                    },
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'Response added successfully'
        });
    } catch (error) {
        console.error('Error adding response:', error);
        res.status(500).json({ success: false, error: 'Failed to add response' });
    }
});

// DELETE /api/reviews/:id - Delete review
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const reviewsCollection = db.collection(collections.reviews);

        const result = await reviewsCollection.deleteOne({
            _id: new ObjectId(id)
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ success: false, error: 'Failed to delete review' });
    }
});

export default router;
