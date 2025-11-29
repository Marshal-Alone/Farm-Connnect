export interface MachinerySchema {
    _id?: string;
    name: string;
    type: 'tractor' | 'harvester' | 'rotavator' | 'seeder' | 'sprayer' | 'irrigation' | 'livestock' | 'equipment';
    ownerId: string;
    ownerName: string;
    ownerPhone?: string;
    ownerEmail?: string;
    location: {
        address: string;
        city: string;
        state: string;
        pincode: string;
        coordinates?: {
            latitude: number;
            longitude: number;
        };
    };
    pricePerDay: number;
    pricePerHour?: number;
    rating: number;
    totalReviews: number;
    available: boolean;
    images: string[];
    description: string;
    specifications: {
        key: string;
        value: string;
    }[];
    features: string[];
    condition: 'excellent' | 'good' | 'fair' | 'needs-repair';
    yearOfManufacture?: number;
    brand?: string;
    model?: string;
    bookedDates: {
        startDate: Date;
        endDate: Date;
        bookingId: string;
    }[];
    deliveryAvailable: boolean;
    deliveryRadius?: number; // in km
    deliveryChargePerKm?: number;
    minimumBookingHours?: number;
    securityDeposit?: number;
    cancellationPolicy?: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
    views: number;
    totalBookings: number;
}

export const machineryTypes = [
    'tractor',
    'harvester',
    'rotavator',
    'seeder',
    'sprayer',
    'irrigation',
    'livestock',
    'equipment'
] as const;

export const machineryConditions = [
    'excellent',
    'good',
    'fair',
    'needs-repair'
] as const;
