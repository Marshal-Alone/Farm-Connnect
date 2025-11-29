import { MachinerySchema } from '../schemas/machinery.schema';

const API_BASE_URL = '/api';

export interface MachineryFilters {
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    available?: boolean;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
}

export interface MachineryResponse {
    success: boolean;
    data: MachinerySchema[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    error?: string;
}

export interface SingleMachineryResponse {
    success: boolean;
    data: MachinerySchema;
    error?: string;
}

export interface AvailabilityResponse {
    success: boolean;
    available: boolean;
    bookedDates: {
        startDate: Date;
        endDate: Date;
        bookingId: string;
    }[];
    error?: string;
}

class MachineryService {
    // Get all machinery with filters
    async getMachinery(filters: MachineryFilters = {}): Promise<MachineryResponse> {
        try {
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, value.toString());
                }
            });

            const response = await fetch(`${API_BASE_URL}/machinery?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching machinery:', error);
            return {
                success: false,
                data: [],
                error: 'Failed to fetch machinery'
            };
        }
    }

    // Get single machinery by ID
    async getMachineryById(id: string): Promise<SingleMachineryResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/machinery/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching machinery:', error);
            return {
                success: false,
                data: {} as MachinerySchema,
                error: 'Failed to fetch machinery'
            };
        }
    }

    // Get nearby machinery
    async getNearbyMachinery(latitude: number, longitude: number, radius: number = 50): Promise<MachineryResponse> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/machinery/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error fetching nearby machinery:', error);
            return {
                success: false,
                data: [],
                error: 'Failed to fetch nearby machinery'
            };
        }
    }

    // Check availability
    async checkAvailability(id: string, startDate: string, endDate: string): Promise<AvailabilityResponse> {
        try {
            const response = await fetch(
                `${API_BASE_URL}/machinery/${id}/availability?startDate=${startDate}&endDate=${endDate}`
            );
            return await response.json();
        } catch (error) {
            console.error('Error checking availability:', error);
            return {
                success: false,
                available: false,
                bookedDates: [],
                error: 'Failed to check availability'
            };
        }
    }

    // Create machinery (owner only)
    async createMachinery(machineryData: Partial<MachinerySchema>): Promise<SingleMachineryResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/machinery`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(machineryData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating machinery:', error);
            return {
                success: false,
                data: {} as MachinerySchema,
                error: 'Failed to create machinery'
            };
        }
    }

    // Update machinery (owner only)
    async updateMachinery(id: string, machineryData: Partial<MachinerySchema>): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/machinery/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(machineryData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating machinery:', error);
            return {
                success: false,
                error: 'Failed to update machinery'
            };
        }
    }

    // Delete machinery (owner only)
    async deleteMachinery(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/machinery/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting machinery:', error);
            return {
                success: false,
                error: 'Failed to delete machinery'
            };
        }
    }
}

export const machineryService = new MachineryService();
