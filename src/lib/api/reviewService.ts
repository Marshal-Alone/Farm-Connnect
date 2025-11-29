import { ReviewSchema } from '../schemas/review.schema';

const API_BASE_URL = '/api';

export interface CreateReviewData {
    machineryId: string;
    bookingId?: string;
    reviewerId: string;
    reviewerName: string;
    overallRating: number;
    conditionRating?: number;
    performanceRating?: number;
    valueForMoneyRating?: number;
    ownerBehaviorRating?: number;
    title?: string;
    comment: string;
    pros?: string[];
    cons?: string[];
    images?: string[];
}

export interface ReviewResponse {
    success: boolean;
    data: ReviewSchema[];
    stats?: {
        totalReviews: number;
        averageRating: number;
        ratingDistribution: {
            5: number;
            4: number;
            3: number;
            2: number;
            1: number;
        };
    };
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    error?: string;
}

export interface SingleReviewResponse {
    success: boolean;
    data: ReviewSchema;
    error?: string;
}

class ReviewService {
    // Submit a review
    async createReview(reviewData: CreateReviewData): Promise<SingleReviewResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error creating review:', error);
            return {
                success: false,
                data: {} as ReviewSchema,
                error: 'Failed to create review'
            };
        }
    }

    // Get reviews for machinery
    async getMachineryReviews(machineryId: string, page: number = 1, limit: number = 10, sortBy: string = 'createdAt'): Promise<ReviewResponse> {
        try {
            const queryParams = new URLSearchParams({
                page: page.toString(),
                limit: limit.toString(),
                sortBy
            });

            const response = await fetch(`${API_BASE_URL}/reviews/machinery/${machineryId}?${queryParams}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching reviews:', error);
            return {
                success: false,
                data: [],
                error: 'Failed to fetch reviews'
            };
        }
    }

    // Update review
    async updateReview(id: string, reviewData: Partial<CreateReviewData>): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });
            return await response.json();
        } catch (error) {
            console.error('Error updating review:', error);
            return {
                success: false,
                error: 'Failed to update review'
            };
        }
    }

    // Mark review as helpful
    async markHelpful(id: string, userId: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${id}/helpful`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error marking review as helpful:', error);
            return {
                success: false,
                error: 'Failed to mark review as helpful'
            };
        }
    }

    // Add owner response
    async addOwnerResponse(id: string, comment: string, ownerId: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${id}/response`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ comment, ownerId }),
            });
            return await response.json();
        } catch (error) {
            console.error('Error adding owner response:', error);
            return {
                success: false,
                error: 'Failed to add owner response'
            };
        }
    }

    // Delete review
    async deleteReview(id: string): Promise<{ success: boolean; message?: string; error?: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
                method: 'DELETE',
            });
            return await response.json();
        } catch (error) {
            console.error('Error deleting review:', error);
            return {
                success: false,
                error: 'Failed to delete review'
            };
        }
    }
}

export const reviewService = new ReviewService();
