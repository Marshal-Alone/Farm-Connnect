import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
    IndianRupee, TrendingUp, Calendar, Package, Plus,
    CheckCircle, Clock, XCircle, Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { machineryService } from '@/lib/api/machineryService';
import { bookingService } from '@/lib/api/bookingService';
import { MachinerySchema } from '@/lib/schemas/machinery.schema';
import { BookingSchema } from '@/lib/schemas/booking.schema';

export default function OwnerDashboard() {
    const [machinery, setMachinery] = useState<MachinerySchema[]>([]);
    const [bookings, setBookings] = useState<BookingSchema[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalMachinery: 0,
        activeMachinery: 0,
        totalBookings: 0,
        totalEarnings: 0,
        pendingRequests: 0
    });
    const navigate = useNavigate();
    const { toast } = useToast();

    // Demo owner ID (in real app, get from auth)
    const ownerId = 'user123';

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            // Fetch owner's machinery
            const machineryResponse = await machineryService.getMachinery({
                // In real app, filter by ownerId
                limit: 100
            });

            // Fetch owner's bookings
            const bookingsResponse = await bookingService.getOwnerBookings(ownerId);

            let ownerMachinery: MachinerySchema[] = [];

            if (machineryResponse.success) {
                // CRITICAL: Filter to show ONLY this owner's machinery
                ownerMachinery = machineryResponse.data.filter(m => m.ownerId === ownerId);
                setMachinery(ownerMachinery);
            }

            if (bookingsResponse.success) {
                setBookings(bookingsResponse.data);

                // Calculate stats using ownerMachinery (not all machinery)
                const totalEarnings = bookingsResponse.data
                    .filter(b => b.paymentStatus === 'paid')
                    .reduce((sum, b) => sum + b.finalAmount, 0);

                const pendingRequests = bookingsResponse.data.filter(b => b.status === 'pending').length;

                setStats({
                    totalMachinery: ownerMachinery.length,
                    activeMachinery: ownerMachinery.filter(m => m.available).length,
                    totalBookings: bookingsResponse.data.length,
                    totalEarnings,
                    pendingRequests
                });
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast({
                title: "Error",
                description: "Failed to load dashboard data",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleApproveBooking = async (bookingId: string) => {
        try {
            const response = await bookingService.updateBookingStatus(bookingId, 'confirmed');
            if (response.success) {
                toast({
                    title: "Booking Approved",
                    description: "The booking has been confirmed"
                });
                fetchDashboardData();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve booking",
                variant: "destructive"
            });
        }
    };

    const handleRejectBooking = async (bookingId: string) => {
        try {
            const response = await bookingService.updateBookingStatus(bookingId, 'rejected', 'Not available for selected dates');
            if (response.success) {
                toast({
                    title: "Booking Rejected",
                    description: "The booking has been rejected"
                });
                fetchDashboardData();
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reject booking",
                variant: "destructive"
            });
        }
    };

    const handleEditMachinery = (machineryId: string) => {
        // Navigate to edit page (you can create this later)
        navigate(`/machinery/edit/${machineryId}`);
    };

    const handleDeleteMachinery = async (machineryId: string, machineryName: string) => {
        if (!confirm(`Are you sure you want to delete "${machineryName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await machineryService.deleteMachinery(machineryId);
            if (response.success) {
                toast({
                    title: "Machinery Deleted",
                    description: `${machineryName} has been deleted successfully`
                });
                fetchDashboardData();
            } else {
                toast({
                    title: "Error",
                    description: response.error || "Failed to delete machinery",
                    variant: "destructive"
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete machinery",
                variant: "destructive"
            });
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-bold">Owner Dashboard</h1>
                        <p className="text-muted-foreground mt-2">Manage your machinery and bookings</p>
                    </div>
                    <Button
                        onClick={() => navigate('/machinery/add')}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Machinery
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Machinery</CardTitle>
                            <Package className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalMachinery}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.activeMachinery} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalBookings}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.pendingRequests} pending
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">₹{stats.totalEarnings.toLocaleString()}</div>
                            <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">{stats.pendingRequests}</div>
                            <p className="text-xs text-muted-foreground">Requires action</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="machinery" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="machinery">My Machinery</TabsTrigger>
                        <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
                        <TabsTrigger value="earnings">Earnings</TabsTrigger>
                    </TabsList>

                    {/* My Machinery Tab */}
                    <TabsContent value="machinery" className="space-y-4">
                        {machinery.length === 0 ? (
                            <Card>
                                <CardContent className="py-20 text-center">
                                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">No machinery listed</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Start earning by listing your machinery
                                    </p>
                                    <Button onClick={() => navigate('/machinery/add')}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Machinery
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            machinery.map((item) => (
                                <Card key={item._id}>
                                    <CardContent className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.images[0] || 'https://via.placeholder.com/100'}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-lg"
                                            />
                                            <div>
                                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">{item.type}</p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Badge className={item.available ? 'bg-green-500' : 'bg-red-500'}>
                                                        {item.available ? 'Available' : 'Booked'}
                                                    </Badge>
                                                    <span className="text-sm font-semibold text-green-600">
                                                        ₹{item.pricePerDay}/day
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleEditMachinery(item._id!)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="text-red-600"
                                                onClick={() => handleDeleteMachinery(item._id!, item.name)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* Booking Requests Tab */}
                    <TabsContent value="bookings" className="space-y-4">
                        {bookings.length === 0 ? (
                            <Card>
                                <CardContent className="py-20 text-center">
                                    <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-xl font-semibold mb-2">No booking requests</h3>
                                    <p className="text-muted-foreground">
                                        Booking requests will appear here
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            bookings.map((booking) => (
                                <Card key={booking._id}>
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-semibold text-lg">{booking.machineryName}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Booking #{booking.bookingNumber}
                                                </p>
                                            </div>
                                            <Badge className={
                                                booking.status === 'pending' ? 'bg-yellow-500' :
                                                    booking.status === 'confirmed' ? 'bg-green-500' :
                                                        'bg-red-500'
                                            }>
                                                {booking.status}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-sm text-muted-foreground">Renter</p>
                                                <p className="font-semibold">{booking.renterName}</p>
                                                <p className="text-sm">{booking.renterPhone}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground">Amount</p>
                                                <p className="font-semibold text-green-600">₹{booking.finalAmount}</p>
                                            </div>
                                        </div>

                                        {booking.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700"
                                                    onClick={() => handleApproveBooking(booking._id!)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-2" />
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="text-red-600"
                                                    onClick={() => handleRejectBooking(booking._id!)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-2" />
                                                    Reject
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    {/* Earnings Tab */}
                    <TabsContent value="earnings">
                        <Card>
                            <CardHeader>
                                <CardTitle>Earnings Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-12">
                                    <IndianRupee className="h-16 w-16 mx-auto mb-4 text-green-600" />
                                    <h3 className="text-3xl font-bold text-green-600 mb-2">
                                        ₹{stats.totalEarnings.toLocaleString()}
                                    </h3>
                                    <p className="text-muted-foreground">Total Earnings</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
