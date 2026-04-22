import express from 'express';
import { getDatabase, collections } from '../config/database.js';
import { ObjectId } from 'mongodb';
import { authenticateToken } from './users.js';

const router = express.Router();

const ALLOWED_PAYMENT_MODES = new Set(['demo', 'razorpay', 'cash']);
const ALLOWED_STATUSES = new Set(['pending', 'confirmed', 'rejected', 'in-progress', 'completed', 'cancelled']);
const TRANSITIONS = {
    pending: new Set(['confirmed', 'rejected', 'cancelled']),
    confirmed: new Set(['in-progress', 'cancelled']),
    'in-progress': new Set(['completed', 'cancelled']),
    completed: new Set([]),
    rejected: new Set([]),
    cancelled: new Set([])
};

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

function toDateSafe(value) {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
}

function overlapCondition(start, end) {
    return {
        startDate: { $lte: end },
        endDate: { $gte: start }
    };
}

function assertObjectId(value) {
    return typeof value === 'string' && ObjectId.isValid(value);
}

// POST /api/bookings - Create new booking
router.post('/', authenticateToken, async (req, res) => {
    console.log('📋 [POST /api/bookings] Request received', { machineryId: req.body.machineryId, renterIdFromToken: req.user?.userId, startDate: req.body.startDate, endDate: req.body.endDate, timestamp: new Date().toISOString() });
    try {
        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);
        const machineryCollection = db.collection(collections.machinery);

        const {
            machineryId,
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
        if (!machineryId || !startDate || !endDate) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        if (!assertObjectId(machineryId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid machinery ID'
            });
        }

        const requestStart = toDateSafe(startDate);
        const requestEnd = toDateSafe(endDate);
        if (!requestStart || !requestEnd) {
            return res.status(400).json({
                success: false,
                error: 'Invalid startDate or endDate'
            });
        }
        if (requestEnd < requestStart) {
            return res.status(400).json({
                success: false,
                error: 'End date must be greater than or equal to start date'
            });
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (requestStart < today) {
            return res.status(400).json({
                success: false,
                error: 'Start date cannot be in the past'
            });
        }
        if (!ALLOWED_PAYMENT_MODES.has(paymentMode)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment mode'
            });
        }

        const renterId = req.user.userId;

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
        const bookingId = new ObjectId();
        const bookedSlot = {
            startDate: requestStart,
            endDate: requestEnd,
            bookingId: bookingId.toString()
        };

        // Reserve slot using atomic conditional update to avoid race overlap
        const reserveResult = await machineryCollection.updateOne(
            {
                _id: new ObjectId(machineryId),
                available: true,
                $or: [
                    { bookedDates: { $exists: false } },
                    { bookedDates: { $size: 0 } },
                    { bookedDates: { $not: { $elemMatch: overlapCondition(requestStart, requestEnd) } } }
                ]
            },
            {
                $push: { bookedDates: bookedSlot },
                $inc: { totalBookings: 1 }
            }
        );

        if (reserveResult.matchedCount === 0 || reserveResult.modifiedCount === 0) {
            return res.status(409).json({
                success: false,
                error: 'Machinery is already booked for selected dates'
            });
        }

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
            startDate: requestStart,
            endDate: requestEnd,
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
            paymentStatus: 'pending',
            paymentMode,
            paidAmount: 0,
            pendingAmount: finalAmount,
            purpose: purpose || null,
            specialRequirements: specialRequirements || null,
            createdAt: new Date(),
            updatedAt: new Date(),
            reviewSubmitted: false
        };

        // Note: owner approval + payment confirmation happen in subsequent steps

        try {
            await bookingsCollection.insertOne({
                _id: bookingId,
                ...bookingData
            });
        } catch (insertError) {
            // Rollback reserved slot if booking document creation fails
            await machineryCollection.updateOne(
                { _id: new ObjectId(machineryId) },
                {
                    $pull: { bookedDates: { bookingId: bookingId.toString() } },
                    $inc: { totalBookings: -1 }
                }
            );
            throw insertError;
        }

        console.log('✅ [POST /api/bookings] Success', { bookingId: bookingId, bookingNumber: bookingData.bookingNumber, machineryId: machineryId, finalAmount: bookingData.finalAmount, timestamp: new Date().toISOString() });
        res.status(201).json({
            success: true,
            data: {
                _id: bookingId,
                ...bookingData
            }
        });
    } catch (error) {
        console.error('Error creating booking:', error);
        res.status(500).json({ success: false, error: 'Failed to create booking' });
    }
});

// GET /api/bookings/user/:userId - Get user's bookings
router.get('/user/:userId', authenticateToken, async (req, res) => {
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

        if (req.user.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to view these bookings'
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
router.get('/owner/:ownerId', authenticateToken, async (req, res) => {
    try {
        const { ownerId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        if (req.user.userId !== ownerId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to view these bookings'
            });
        }

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
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);

        if (!assertObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid booking ID'
            });
        }

        const booking = await bookingsCollection.findOne({
            _id: new ObjectId(id)
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        if (booking.ownerId !== req.user.userId && booking.renterId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to view this booking'
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
router.put('/:id/status', authenticateToken, async (req, res) => {
    console.log('📋 [PUT /api/bookings/:id/status] Request received', { bookingId: req.params.id, newStatus: req.body.status, timestamp: new Date().toISOString() });
    try {
        const { id } = req.params;
        const { status, reason } = req.body;
        if (!assertObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid booking ID'
            });
        }
        if (!ALLOWED_STATUSES.has(status)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid booking status'
            });
        }

        const db = await getDatabase();
        const bookingsCollection = db.collection(collections.bookings);
        const machineryCollection = db.collection(collections.machinery);

        const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });
        if (!booking) {
            return res.status(404).json({
                success: false,
                error: 'Booking not found'
            });
        }

        // Ownership/role guards
        const isOwner = booking.ownerId === req.user.userId;
        const isRenter = booking.renterId === req.user.userId;
        if (!isOwner && !isRenter) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to update this booking'
            });
        }

        // Owner controls approve/reject/start/complete; renter can only cancel own booking
        if ((status === 'confirmed' || status === 'rejected' || status === 'in-progress' || status === 'completed') && !isOwner) {
            return res.status(403).json({
                success: false,
                error: 'Only owner can perform this status update'
            });
        }
        if (status === 'cancelled' && !isOwner && !isRenter) {
            return res.status(403).json({
                success: false,
                error: 'Only owner or renter can cancel this booking'
            });
        }

        // Payment constraint: only paid booking can become confirmed
        if (status === 'confirmed' && booking.paymentStatus !== 'paid') {
            return res.status(400).json({
                success: false,
                error: 'Booking cannot be confirmed before payment is completed'
            });
        }

        // Transition guard
        if (!TRANSITIONS[booking.status]?.has(status)) {
            return res.status(400).json({
                success: false,
                error: `Invalid status transition: ${booking.status} -> ${status}`
            });
        }

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

        // Release reserved slot on cancellation/rejection
        if (status === 'cancelled' || status === 'rejected') {
            await machineryCollection.updateOne(
                { _id: new ObjectId(booking.machineryId) },
                {
                    $pull: { bookedDates: { bookingId: id } },
                    $inc: { totalBookings: -1 }
                }
            );
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
router.post('/:id/payment', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            paymentMode,
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature,
            amount
        } = req.body;

        if (!assertObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid booking ID'
            });
        }
        if (!ALLOWED_PAYMENT_MODES.has(paymentMode)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid payment mode'
            });
        }

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
        if (booking.renterId !== req.user.userId) {
            return res.status(403).json({
                success: false,
                error: 'Only renter can process this payment'
            });
        }
        if (booking.paymentStatus === 'paid') {
            return res.status(400).json({
                success: false,
                error: 'Payment already completed for this booking'
            });
        }
        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                error: 'Payment can only be processed for pending bookings'
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
                message: 'Payment processed successfully (Demo mode). Booking confirmed.'
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
                    paidAmount: amount || booking.finalAmount,
                    pendingAmount: Math.max(0, booking.finalAmount - (amount || booking.finalAmount)),
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
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { reason, cancelledBy } = req.body;
        if (!assertObjectId(id)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid booking ID'
            });
        }

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
        const isOwner = booking.ownerId === req.user.userId;
        const isRenter = booking.renterId === req.user.userId;
        if (!isOwner && !isRenter) {
            return res.status(403).json({
                success: false,
                error: 'Unauthorized to cancel this booking'
            });
        }
        if (!['pending', 'confirmed'].includes(booking.status)) {
            return res.status(400).json({
                success: false,
                error: `Cannot cancel booking in ${booking.status} state`
            });
        }

        // Update booking status
        await bookingsCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    status: 'cancelled',
                    cancellationReason: reason || 'Cancelled by user',
                    cancelledBy: cancelledBy || (isOwner ? 'owner' : 'renter'),
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
                },
                $inc: { totalBookings: -1 }
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
