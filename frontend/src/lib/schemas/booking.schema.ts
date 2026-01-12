export interface BookingSchema {
    _id?: string;
    bookingNumber: string; // Unique booking reference
    machineryId: string;
    machineryName: string;
    machineryType: string;
    ownerId: string;
    ownerName: string;
    renterId: string;
    renterName: string;
    renterPhone: string;
    renterEmail: string;

    // Booking dates
    startDate: Date;
    endDate: Date;
    totalDays: number;
    totalHours?: number;

    // Pricing
    pricePerDay: number;
    pricePerHour?: number;
    totalAmount: number;
    deliveryCharge: number;
    securityDeposit: number;
    discount: number;
    finalAmount: number;

    // Delivery
    deliveryRequired: boolean;
    deliveryAddress?: string;
    deliveryCoordinates?: {
        latitude: number;
        longitude: number;
    };
    pickupRequired: boolean;

    // Status tracking
    status: 'pending' | 'confirmed' | 'rejected' | 'in-progress' | 'completed' | 'cancelled' | 'refunded';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';

    // Payment details
    paymentMode: 'demo' | 'razorpay' | 'cash';
    paymentId?: string;
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    paidAmount: number;
    pendingAmount: number;

    // Additional info
    purpose?: string;
    specialRequirements?: string;

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
    confirmedAt?: Date;
    startedAt?: Date;
    completedAt?: Date;
    cancelledAt?: Date;

    // Cancellation
    cancellationReason?: string;
    cancelledBy?: 'owner' | 'renter' | 'admin';
    refundAmount?: number;
    refundStatus?: 'pending' | 'processed' | 'failed';

    // Review
    reviewSubmitted: boolean;
    reviewId?: string;
}

export const bookingStatuses = [
    'pending',
    'confirmed',
    'rejected',
    'in-progress',
    'completed',
    'cancelled',
    'refunded'
] as const;

export const paymentStatuses = [
    'pending',
    'paid',
    'failed',
    'refunded',
    'partial'
] as const;

export const paymentModes = [
    'demo',
    'razorpay',
    'cash'
] as const;

// Helper function to generate booking number
export function generateBookingNumber(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `BK-${timestamp}-${random}`.toUpperCase();
}
