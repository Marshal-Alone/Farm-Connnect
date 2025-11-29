import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { reviewService } from '@/lib/api/reviewService';

interface ReviewFormProps {
    isOpen: boolean;
    onClose: () => void;
    machineryId: string;
    machineryName: string;
    bookingId?: string;
    onSuccess?: () => void;
}

export default function ReviewForm({
    isOpen,
    onClose,
    machineryId,
    machineryName,
    bookingId,
    onSuccess
}: ReviewFormProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState({
        overall: 0,
        condition: 0,
        performance: 0,
        valueForMoney: 0,
        ownerBehavior: 0
    });
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');
    const [pros, setPros] = useState('');
    const [cons, setCons] = useState('');

    const handleSubmit = async () => {
        if (ratings.overall === 0) {
            toast({
                title: "Rating Required",
                description: "Please provide an overall rating",
                variant: "destructive"
            });
            return;
        }

        if (!comment.trim()) {
            toast({
                title: "Review Required",
                description: "Please write a review",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const response = await reviewService.createReview({
                machineryId,
                bookingId,
                reviewerId: 'demo_user_' + Date.now(), // In real app, get from auth
                reviewerName: 'Demo User',
                overallRating: ratings.overall,
                conditionRating: ratings.condition || undefined,
                performanceRating: ratings.performance || undefined,
                valueForMoneyRating: ratings.valueForMoney || undefined,
                ownerBehaviorRating: ratings.ownerBehavior || undefined,
                title: title || undefined,
                comment,
                pros: pros ? pros.split(',').map(p => p.trim()).filter(Boolean) : undefined,
                cons: cons ? cons.split(',').map(c => c.trim()).filter(Boolean) : undefined
            });

            if (response.success) {
                toast({
                    title: "Review Submitted!",
                    description: "Thank you for your feedback"
                });
                onSuccess?.();
                onClose();
                resetForm();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to submit review",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast({
                title: "Error",
                description: "Failed to submit review",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setRatings({ overall: 0, condition: 0, performance: 0, valueForMoney: 0, ownerBehavior: 0 });
        setTitle('');
        setComment('');
        setPros('');
        setCons('');
    };

    const RatingStars = ({ value, onChange, label }: { value: number; onChange: (v: number) => void; label: string }) => (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer transition-colors ${star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                        onClick={() => onChange(star)}
                    />
                ))}
            </div>
        </div>
    );

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                    <DialogDescription>
                        Share your experience with {machineryName}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Overall Rating */}
                    <RatingStars
                        value={ratings.overall}
                        onChange={(v) => setRatings({ ...ratings, overall: v })}
                        label="Overall Rating *"
                    />

                    {/* Detailed Ratings */}
                    <div className="grid grid-cols-2 gap-4">
                        <RatingStars
                            value={ratings.condition}
                            onChange={(v) => setRatings({ ...ratings, condition: v })}
                            label="Condition"
                        />
                        <RatingStars
                            value={ratings.performance}
                            onChange={(v) => setRatings({ ...ratings, performance: v })}
                            label="Performance"
                        />
                        <RatingStars
                            value={ratings.valueForMoney}
                            onChange={(v) => setRatings({ ...ratings, valueForMoney: v })}
                            label="Value for Money"
                        />
                        <RatingStars
                            value={ratings.ownerBehavior}
                            onChange={(v) => setRatings({ ...ratings, ownerBehavior: v })}
                            label="Owner Behavior"
                        />
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <Label htmlFor="title">Review Title (Optional)</Label>
                        <input
                            id="title"
                            type="text"
                            placeholder="Summarize your experience"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <Label htmlFor="comment">Your Review *</Label>
                        <Textarea
                            id="comment"
                            placeholder="Share details about your experience..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            rows={5}
                        />
                    </div>

                    {/* Pros */}
                    <div className="space-y-2">
                        <Label htmlFor="pros">Pros (Optional, comma-separated)</Label>
                        <input
                            id="pros"
                            type="text"
                            placeholder="e.g., Powerful, Easy to use, Good fuel efficiency"
                            value={pros}
                            onChange={(e) => setPros(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>

                    {/* Cons */}
                    <div className="space-y-2">
                        <Label htmlFor="cons">Cons (Optional, comma-separated)</Label>
                        <input
                            id="cons"
                            type="text"
                            placeholder="e.g., Expensive, Noisy"
                            value={cons}
                            onChange={(e) => setCons(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading} className="bg-green-600 hover:bg-green-700">
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
