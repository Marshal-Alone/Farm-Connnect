import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Calendar, MapPin, IndianRupee, Clock, CheckCircle, XCircle,
    Loader2, FileText, Download
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { bookingService } from '@/lib/api/bookingService';
import { BookingSchema } from '@/lib/schemas/booking.schema';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export default function BookingHistory() {
    const [bookings, setBookings] = useState<BookingSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    // Use actual logged-in user ID
    const userId = user?._id || user?.id || '';

    useEffect(() => {
        fetchBookings();
    }, [activeTab]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            // Don't fetch if no user ID
            if (!userId) {
                console.log('No user ID available, skipping fetch');
                setBookings([]);
                setLoading(false);
                return;
            }

            const status = activeTab === 'all' ? undefined : activeTab;
            const response = await bookingService.getUserBookings(userId, status);

            if (response.success) {
                setBookings(response.data);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to fetch bookings",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            pending: { color: 'bg-yellow-500', label: 'Pending' },
            confirmed: { color: 'bg-green-500', label: 'Confirmed' },
            'in-progress': { color: 'bg-blue-500', label: 'In Progress' },
            completed: { color: 'bg-gray-500', label: 'Completed' },
            cancelled: { color: 'bg-red-500', label: 'Cancelled' },
            rejected: { color: 'bg-red-600', label: 'Rejected' }
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
        return <Badge className={`${config.color} text-white`}>{config.label}</Badge>;
    };

    const handleCancelBooking = async (bookingId: string) => {
        if (!confirm('Are you sure you want to cancel this booking?')) return;

        try {
            const response = await bookingService.cancelBooking(
                bookingId,
                'Cancelled by user',
                'renter'
            );

            if (response.success) {
                toast({
                    title: "Booking Cancelled",
                    description: "Your booking has been cancelled successfully"
                });
                fetchBookings();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to cancel booking",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Error cancelling booking:', error);
            toast({
                title: "Error",
                description: "Failed to cancel booking",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">My Bookings</h1>
                    <p className="text-muted-foreground">View and manage your machinery rental bookings</p>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
                    <TabsList>
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="pending">Pending</TabsTrigger>
                        <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
                        <TabsTrigger value="in-progress">In Progress</TabsTrigger>
                        <TabsTrigger value="completed">Completed</TabsTrigger>
                        <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                    </TabsList>
                </Tabs>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : bookings.length === 0 ? (
                    <Card>
                        <CardContent className="py-20 text-center">
                            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                            <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                            <p className="text-muted-foreground mb-6">
                                You haven't made any bookings yet
                            </p>
                            <Button onClick={() => navigate('/machinery')}>
                                Browse Machinery
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <Card key={booking._id} className="overflow-hidden">
                                <CardHeader className="bg-secondary/20">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{booking.machineryName}</CardTitle>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                Booking #{booking.bookingNumber}
                                            </p>
                                        </div>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                                        <div className="flex items-start gap-2">
                                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Rental Period</p>
                                                <p className="font-semibold">
                                                    {format(new Date(booking.startDate), 'MMM dd')} - {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                                                </p>
                                                <p className="text-sm text-muted-foreground">{booking.totalDays} days</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <IndianRupee className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                                <p className="font-semibold text-green-600">₹{booking.finalAmount}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Owner</p>
                                                <p className="font-semibold">{booking.ownerName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-2">
                                            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Booked On</p>
                                                <p className="font-semibold">
                                                    {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {booking.purpose && (
                                        <div className="mb-4 p-3 bg-secondary/20 rounded-lg">
                                            <p className="text-sm text-muted-foreground mb-1">Purpose</p>
                                            <p className="text-sm">{booking.purpose}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => navigate(`/machinery/${booking.machineryId}`)}
                                        >
                                            View Machinery
                                        </Button>

                                        {booking.status === 'confirmed' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600"
                                                onClick={() => handleCancelBooking(booking._id!)}
                                            >
                                                Cancel Booking
                                            </Button>
                                        )}


                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
