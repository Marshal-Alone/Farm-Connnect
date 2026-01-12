import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import {
    MapPin, Star, Truck, Phone, Mail, Calendar as CalendarIcon,
    IndianRupee, Shield, Clock, ArrowLeft, Check, X, Loader2, MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { machineryService } from '@/lib/api/machineryService';
import { bookingService } from '@/lib/api/bookingService';
import { messageService } from '@/lib/api/messageService';
import { MachinerySchema } from '@/lib/schemas/machinery.schema';
import { format, addDays, differenceInDays } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';

export default function MachineryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();

    const [machinery, setMachinery] = useState<MachinerySchema | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDates, setSelectedDates] = useState<{ from: Date | undefined; to: Date | undefined }>({
        from: undefined,
        to: undefined
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [showBookingForm, setShowBookingForm] = useState(false);

    // User info (in real app, get from auth context)
    const [userInfo, setUserInfo] = useState({
        name: '',
        phone: '',
        email: '',
        purpose: ''
    });


    useEffect(() => {
        fetchMachineryDetails();
    }, [id]);

    const fetchMachineryDetails = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await machineryService.getMachineryById(id);
            if (response.success) {
                setMachinery(response.data);
            } else {
                toast({
                    title: "Error",
                    description: "Failed to load machinery details",
                    variant: "destructive"
                });
                navigate('/machinery');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: "Failed to load machinery details",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const calculateTotalCost = () => {
        if (!selectedDates.from || !selectedDates.to || !machinery) return 0;

        const days = differenceInDays(selectedDates.to, selectedDates.from) + 1;
        const rentalCost = days * machinery.pricePerDay;
        const deliveryCharge = machinery.deliveryAvailable ? (machinery.deliveryChargePerKm || 0) * 10 : 0;
        const securityDeposit = machinery.securityDeposit || 0;

        return {
            days,
            rentalCost,
            deliveryCharge,
            securityDeposit,
            total: rentalCost + deliveryCharge + securityDeposit
        };
    };

    const handleBookNow = async () => {
        if (!selectedDates.from || !selectedDates.to) {
            toast({
                title: "Select Dates",
                description: "Please select start and end dates for your booking",
                variant: "destructive"
            });
            return;
        }

        if (!userInfo.name || !userInfo.phone || !userInfo.email) {
            toast({
                title: "Complete Information",
                description: "Please fill in all required fields",
                variant: "destructive"
            });
            return;
        }

        if (!user) {
            toast({
                title: "Please Login",
                description: "You need to be logged in to make a booking",
                variant: "destructive"
            });
            return;
        }

        setBookingLoading(true);
        try {
            const response = await bookingService.createBooking({
                machineryId: id!,
                renterId: user._id || user.id || '',
                renterName: userInfo.name,
                renterPhone: userInfo.phone,
                renterEmail: userInfo.email,
                startDate: selectedDates.from.toISOString(),
                endDate: selectedDates.to.toISOString(),
                purpose: userInfo.purpose,
                paymentMode: 'demo' // Using demo mode for now
            });

            if (response.success) {
                toast({
                    title: "Booking Request Submitted! ✅",
                    description: `Your booking request (${response.data.bookingNumber}) is pending owner approval.`,
                });

                // Navigate to bookings page after 2 seconds
                setTimeout(() => {
                    navigate('/bookings');
                }, 2000);
            } else {
                toast({
                    title: "Booking Failed",
                    description: response.error || "Failed to create booking",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Booking error:', error);
            toast({
                title: "Error",
                description: "Failed to create booking. Please try again.",
                variant: "destructive"
            });
        } finally {
            setBookingLoading(false);
        }
    };

    const handleOpenChat = () => {
        if (!user) {
            toast({
                title: "Login Required",
                description: "Please login to message the owner",
                variant: "destructive"
            });
            return;
        }

        // Redirect to profile messages tab with the owner's ID
        navigate(`/profile?tab=messages&otherId=${machinery?.ownerId}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!machinery) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Machinery not found</p>
            </div>
        );
    }

    const costBreakdown = calculateTotalCost();

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <div className="container mx-auto px-4 py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/machinery')}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Marketplace
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <Card>
                            <CardContent className="p-0">
                                <img
                                    src={machinery.images[0] || 'https://via.placeholder.com/800x400'}
                                    alt={machinery.name}
                                    className="w-full h-96 object-cover rounded-t-lg"
                                />
                            </CardContent>
                        </Card>

                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-3xl">{machinery.name}</CardTitle>
                                        <CardDescription className="text-lg mt-2">
                                            {machinery.description}
                                        </CardDescription>
                                    </div>
                                    <Badge className={machinery.available ? 'bg-green-500' : 'bg-red-500'}>
                                        {machinery.available ? 'Available' : 'Booked'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-semibold">{machinery.rating.toFixed(1)}</span>
                                    <span className="text-muted-foreground">({machinery.totalReviews} reviews)</span>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground">Type</p>
                                        <p className="font-semibold capitalize">{machinery.type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Condition</p>
                                        <p className="font-semibold capitalize">{machinery.condition}</p>
                                    </div>
                                    {machinery.brand && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Brand</p>
                                            <p className="font-semibold">{machinery.brand}</p>
                                        </div>
                                    )}
                                    {machinery.model && (
                                        <div>
                                            <p className="text-sm text-muted-foreground">Model</p>
                                            <p className="font-semibold">{machinery.model}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Specifications */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Specifications</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    {machinery.specifications.map((spec, index) => (
                                        <div key={index}>
                                            <p className="text-sm text-muted-foreground">{spec.key}</p>
                                            <p className="font-semibold">{spec.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Features */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Features</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {machinery.features.map((feature, index) => (
                                        <Badge key={index} variant="secondary">
                                            <Check className="h-3 w-3 mr-1" />
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Owner Info */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle>Owner Information</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    onClick={handleOpenChat}
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    Message Owner
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Truck className="h-5 w-5 text-muted-foreground" />
                                    <span className="font-semibold">{machinery.ownerName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-muted-foreground" />
                                    <span>{machinery.location.address}, {machinery.location.city}, {machinery.location.state}</span>
                                </div>
                                {machinery.ownerPhone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                        <span>{machinery.ownerPhone}</span>
                                    </div>
                                )}
                                {machinery.deliveryAvailable && (
                                    <Badge variant="outline" className="text-green-600">
                                        <Truck className="h-3 w-3 mr-1" />
                                        Delivery Available (₹{machinery.deliveryChargePerKm}/km)
                                    </Badge>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Booking */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-4">
                            <CardHeader>
                                <CardTitle className="text-2xl text-green-600">
                                    ₹{machinery.pricePerDay}/day
                                </CardTitle>
                                <CardDescription>
                                    {machinery.securityDeposit && `Security Deposit: ₹${machinery.securityDeposit}`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Date Selection */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Select Dates</label>
                                    <Calendar
                                        mode="range"
                                        selected={selectedDates}
                                        onSelect={(range: any) => setSelectedDates(range || { from: undefined, to: undefined })}
                                        disabled={(date) => date < new Date()}
                                        className="rounded-md border"
                                    />
                                </div>

                                {/* Cost Breakdown */}
                                {selectedDates.from && selectedDates.to && costBreakdown && (
                                    <div className="space-y-2 p-4 bg-secondary/20 rounded-lg">
                                        <div className="flex justify-between text-sm">
                                            <span>₹{machinery.pricePerDay} x {costBreakdown.days} days</span>
                                            <span>₹{costBreakdown.rentalCost}</span>
                                        </div>
                                        {costBreakdown.deliveryCharge > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span>Delivery Charge</span>
                                                <span>₹{costBreakdown.deliveryCharge}</span>
                                            </div>
                                        )}
                                        {costBreakdown.securityDeposit > 0 && (
                                            <div className="flex justify-between text-sm">
                                                <span>Security Deposit</span>
                                                <span>₹{costBreakdown.securityDeposit}</span>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between font-bold">
                                            <span>Total</span>
                                            <span>₹{costBreakdown.total}</span>
                                        </div>
                                    </div>
                                )}

                                {/* User Info Form */}
                                {selectedDates.from && selectedDates.to && (
                                    <div className="space-y-3">
                                        <input
                                            type="text"
                                            placeholder="Your Name *"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number *"
                                            value={userInfo.phone}
                                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email *"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md"
                                        />
                                        <textarea
                                            placeholder="Purpose of rental (optional)"
                                            value={userInfo.purpose}
                                            onChange={(e) => setUserInfo({ ...userInfo, purpose: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md"
                                            rows={3}
                                        />
                                    </div>
                                )}

                                {/* Book Button */}
                                <Button
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    size="lg"
                                    onClick={handleBookNow}
                                    disabled={!machinery.available || !selectedDates.from || !selectedDates.to || bookingLoading}
                                >
                                    {bookingLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Confirm Booking (Demo Mode)'
                                    )}
                                </Button>

                                {machinery.cancellationPolicy && (
                                    <p className="text-xs text-muted-foreground text-center">
                                        {machinery.cancellationPolicy}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
