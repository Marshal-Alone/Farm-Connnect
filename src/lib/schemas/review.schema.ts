export interface ReviewSchema {
    _id?: string;
    machineryId: string;
    machineryName: string;
    bookingId: string;
    reviewerId: string;
    reviewerName: string;
    ownerId: string;

    // Ratings (1-5 stars)
    overallRating: number;
    conditionRating: number;
    performanceRating: number;
    valueForMoneyRating: number;
    ownerBehaviorRating: number;

    // Review content
    title?: string;
    comment: string;
    pros?: string[];
    cons?: string[];

    // Media
    images?: string[];

    // Metadata
    isVerifiedBooking: boolean;
    helpful: number; // Count of users who found this helpful
    helpfulBy: string[]; // User IDs who marked as helpful

    // Moderation
    isApproved: boolean;
    isFlagged: boolean;
    flagReason?: string;

    // Response from owner
    ownerResponse?: {
        comment: string;
        respondedAt: Date;
    };

    createdAt: Date;
    updatedAt: Date;
}

export interface MachineryRatingStats {
    machineryId: string;
    totalReviews: number;
    averageRating: number;
    overallRating: number;
    conditionRating: number;
    performanceRating: number;
    valueForMoneyRating: number;
    ownerBehaviorRating: number;
    ratingDistribution: {
        5: number;
        4: number;
        3: number;
        2: number;
        1: number;
    };
}

// Helper function to calculate average rating
export function calculateAverageRating(reviews: ReviewSchema[]): number {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.overallRating, 0);
    return Math.round((sum / reviews.length) * 10) / 10; // Round to 1 decimal
}

// Helper function to get rating distribution
export function getRatingDistribution(reviews: ReviewSchema[]): MachineryRatingStats['ratingDistribution'] {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
        const rating = Math.round(review.overallRating) as 1 | 2 | 3 | 4 | 5;
        distribution[rating]++;
    });
    return distribution;
}
