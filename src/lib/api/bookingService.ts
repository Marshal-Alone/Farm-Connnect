import { BookingSchema } from '../schemas/booking.schema';

const API_BASE_URL = '/api';

export interface CreateBookingData {
    machineryId: string;
    renterId: string;
    renterName: string;
    renterPhone: string;
    renterEmail: string;
    startDate: string;
    endDate: string;
    deliveryRequired?: boolean;
    deliveryAddress?: string;
    purpose?: string;
    specialRequirements?: string;
    paymentMode?: 'demo' | 'razorpay' | 'cash';
}

export interface BookingResponse {
    success: boolean;
    data: BookingSchema[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    error?: string;
}

export interface SingleBookingResponse {
    success: boolean;
    data: BookingSchema;
    error?: string;
}

export interface PaymentData {
    paymentMode: 'demo' | 'razorpay';
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount?: number;
}

class BookingService {
    // Create new booking
    async createBooking(bookingData: CreateBookingData): Promise<SingleBookingResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating booking:', error);
            return {
                success: false,
                data: {} as BookingSchema,
                error: 'Failed to create booking'
            };
        }
    }

    // Get user's bookings
    async getUserBookings(userId: string, status?: string, page: number = 1, limit: number = 10): Promise<BookingResponse> {
        try {
            const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (status) queryParams.append('status', status);

            const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching user bookings:', error);
            return {
                success: false,
                data: [],
                error: 'Failed to fetch bookings'
            };
        }
    }

    // Get owner's booking requests
    async getOwnerBookings(ownerId: string, status?: string, page: number = 1, limit: number = 10): Promise<BookingResponse> {
        try {
            const queryParams = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
            if (status) queryParams.append('status', status);

            const response = await fetch(`${API_BASE_URL}/bookings/owner/${ownerId}?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching owner bookings:', error);
            return {
                success: false,
                data: [],
                error: 'Failed to fetch bookings'
            };
        }
    }

    // Get single booking
    async getBookingById(id: string): Promise<SingleBookingResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching booking:', error);
            return {
                success: false,
                data: {} as BookingSchema,
                error: 'Failed to fetch booking'
            };
        }
    }

    // Update booking status
    async updateBookingStatus(id: string, status: string, reason?: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status, reason }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating booking status:', error);
            return {
                success: false,
                error: 'Failed to update booking status'
            };
        }
    }

    // Process payment
    async processPayment(id: string, paymentData: PaymentData): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${id}/payment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(paymentData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error processing payment:', error);
            return {
                success: false,
                error: 'Failed to process payment'
            };
        }
    }

    // Cancel booking
    async cancelBooking(id: string, reason: string, cancelledBy: 'owner' | 'renter'): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason, cancelledBy }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error cancelling booking:', error);
            return {
                success: false,
                error: 'Failed to cancel booking'
            };
        }
    }
}

export const bookingService = new BookingService();
