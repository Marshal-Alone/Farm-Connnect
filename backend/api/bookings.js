import express from 'express';
import { getDatabase, collections } from '../config/database.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

// Helper function to generate booking number
function generateBookingNumber() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `BK-${timestamp}-${random}`.toUpperCase();
}

// Helper function to calculate total days
function calculateDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum 1 day
}

// POST /api/bookings - Create new booking
router.post('/', async (req, res) => {
    console.log('📋 [POST /api/bookings] Request received', { machineryId: req.body.machineryId, renterId: req.body.renterId, startDate: req.body.startDate, endDate: req.body.endDate, timestamp: new Date().toISOString() });
    try {
        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);
        const machineryCollection = db.collection(collections.machinery);

        const {
            machineryId,
            renterId,
            renterName,
            renterPhone,
            renterEmail,
            startDate,
            endDate,
            deliveryRequired,
            deliveryAddress,
            purpose,
            specialRequirements,
            paymentMode = 'demo'
        } = req.body;

        // Validate required fields
        if (!machineryId || !renterId || !startDate || !endDate) {
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

        if (!machinery.available) {
            return res.status(400).json({
                success: false,
                error: 'Machinery is not available'
            });
        }

        // Check date availability
        const requestStart = new Date(startDate);
        const requestEnd = new Date(endDate);

        const isBooked = machinery.bookedDates.some(booking => {
            const bookingStart = new Date(booking.startDate);
            const bookingEnd = new Date(booking.endDate);
            return (requestStart <= bookingEnd && requestEnd >= bookingStart);
        });

        if (isBooked) {
            return res.status(400).json({
                success: false,
                error: 'Machinery is already booked for selected dates'
            });
        }

        // Calculate pricing
        const totalDays = calculateDays(startDate, endDate);
        const totalAmount = machinery.pricePerDay * totalDays;
        const deliveryCharge = deliveryRequired && machinery.deliveryAvailable
            ? (machinery.deliveryChargePerKm || 0) * 10 // Assume 10km for now
            : 0;
        const securityDeposit = machinery.securityDeposit || 0;
        const discount = 0; // Can add discount logic later
        const finalAmount = totalAmount + deliveryCharge + securityDeposit - discount;

        // Create booking
        const bookingData = {
            bookingNumber: generateBookingNumber(),
            machineryId: machineryId,
            machineryName: machinery.name,
            machineryType: machinery.type,
            ownerId: machinery.ownerId,
            ownerName: machinery.ownerName,
            renterId,
            renterName,
            renterPhone,
            renterEmail,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            totalDays,
            pricePerDay: machinery.pricePerDay,
            totalAmount,
            deliveryCharge,
            securityDeposit,
            discount,
            finalAmount,
            deliveryRequired: deliveryRequired || false,
            deliveryAddress: deliveryAddress || null,
            pickupRequired: false,
            status: 'pending', // Always start as pending for owner approval
            paymentStatus: paymentMode === 'demo' ? 'paid' : 'pending',
            paymentMode,
            paidAmount: paymentMode === 'demo' ? finalAmount : 0,
            pendingAmount: paymentMode === 'demo' ? 0 : finalAmount,
            purpose: purpose || null,
            specialRequirements: specialRequirements || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            reviewSubmitted: false
        };

        // Note: Removed auto-confirmation - owner must approve all bookings

        const result = await bookingsCollection.insertOne(bookingData);

        // Update machinery booked dates
        await machineryCollection.updateOne(
            { _id: new ObjectId(machineryId) },
            {
                $push: {
                    bookedDates: {
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        bookingId: result.insertedId.toString()
                    }
                },
                $inc: { totalBookings: 1 }
            }
        );

        console.log('✅ [POST /api/bookings] Success', { bookingId: result.insertedId, bookingNumber: bookingData.bookingNumber, machineryId: machineryId, finalAmount: bookingData.finalAmount, timestamp: new Date().toISOString() });
        res.status(201).json({
            success: true,
            data: {
                _id: result.insertedId,
                ...bookingData
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, error: 'Failed to create booking' });
    }
});

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        // Validate userId
        if (!userId || userId === 'undefined' || userId === 'null') {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);

        const filter = { renterId: userId };
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const bookings = await bookingsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const total = await bookingsCollection.countDocuments(filter);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching user bookings:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
    }
});

// GET /api/bookings/owner/:ownerId - Get owner's booking requests
router.get('/owner/:ownerId', async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);

        const filter = { ownerId };
        if (status) {
            filter.status = status;
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const bookings = await bookingsCollection
            .find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .toArray();

        const total = await bookingsCollection.countDocuments(filter);

        res.json({
            success: true,
            data: bookings,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Error fetching owner bookings:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
    }
});

// GET /api/bookings/:id - Get single booking
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);

        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        res.json({
            success: true,
            data: booking
        });
    } catch (error) {
        console.error('Error fetching booking:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch booking' });
    }
});

// PUT /api/bookings/:id/status - Update booking status
router.put('/:id/status', async (req, res) => {
    console.log('📋 [PUT /api/bookings/:id/status] Request received', { bookingId: req.params.id, newStatus: req.body.status, timestamp: new Date().toISOString() });
    try {
        const { id } = req.params;
        const { status, reason } = req.body;

        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);

        const updateData = {
            status,
            updatedAt: new Date()
        };

        // Add timestamp based on status
        if (status === 'confirmed') {
            updateData.confirmedAt = new Date();
        } else if (status === 'in-progress') {
            updateData.startedAt = new Date();
        } else if (status === 'completed') {
            updateData.completedAt = new Date();
        } else if (status === 'cancelled') {
            updateData.cancelledAt = new Date();
            updateData.cancellationReason = reason;
        }

        const result = await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        console.log('✅ [PUT /api/bookings/:id/status] Success', { bookingId: id, newStatus: status, modifiedCount: result.modifiedCount, timestamp: new Date().toISOString() });
        res.json({
            success: true,
            message: 'Booking status updated successfully'
        });
    } catch (error) {
        console.error('Error updating booking status:', error);
        res.status(500).json({ success: false, error: 'Failed to update booking status' });
    }
});

// POST /api/bookings/:id/payment - Process payment
router.post('/:id/payment', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            paymentMode,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount
        } = req.body;

        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);

        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // For demo mode, just mark as paid
        if (paymentMode === 'demo') {
            await bookingsCollection.updateOne(
                { _id: new ObjectId(id) },
                {
                    $set: {
                        paymentStatus: 'paid',
                        paidAmount: booking.finalAmount,
                        pendingAmount: 0,
                        status: 'confirmed',
                        confirmedAt: new Date(),
                        updatedAt: new Date()
                    }
                }
            );

            return res.json({
                success: true,
                message: 'Payment processed successfully (Demo mode)'
            });
        }

        // For Razorpay, verify signature and update
        // TODO: Add Razorpay signature verification
        await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    paymentStatus: 'paid',
                    razorpayOrderId,
                    razorpayPaymentId,
                    razorpaySignature,
                    paidAmount: amount,
                    pendingAmount: booking.finalAmount - amount,
                    status: 'confirmed',
                    confirmedAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        res.json({
            success: true,
            message: 'Payment processed successfully'
        });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, error: 'Failed to process payment' });
    }
});

// DELETE /api/bookings/:id - Cancel booking
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, cancelledBy } = req.body;

        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);
        const machineryCollection = db.collection(collections.machinery);

        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Update booking status
        await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status: 'cancelled',
                    cancellationReason: reason,
                    cancelledBy,
                    cancelledAt: new Date(),
                    updatedAt: new Date()
                }
            }
        );

        // Remove from machinery booked dates
        await machineryCollection.updateOne(
            { _id: new ObjectId(booking.machineryId) },
            {
                $pull: {
                    bookedDates: { bookingId: id }
                }
            }
        );

        res.json({
            success: true,
            message: 'Booking cancelled successfully'
        });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ success: false, error: 'Failed to cancel booking' });
    }
});

export default router;
