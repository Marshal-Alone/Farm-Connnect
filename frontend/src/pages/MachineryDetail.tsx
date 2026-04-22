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

type DateRange = { from?: Date; to?: Date };

type RazorpayHandlerResponse = {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
};

type RazorpayCheckout = {
    open: () => void;
};

type RazorpayConstructor = new (options: unknown) => RazorpayCheckout;

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
    const [createdBooking, setCreatedBooking] = useState<any | null>(null);
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [mobileSections, setMobileSections] = useState<{ dates: boolean; details: boolean; payment: boolean }>({
        dates: true,
        details: false,
        payment: false
    });

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

    useEffect(() => {
        // Any date change invalidates previous booking quote/request preview
        setCreatedBooking(null);
    }, [selectedDates.from, selectedDates.to]);

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
                paymentMode: 'razorpay'
            });

            if (response.success) {
                setCreatedBooking(response.data);
                toast({
                    title: "Booking Request Created",
                    description: `Booking ${response.data.bookingNumber} created. Complete payment to confirm.`,
                });
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

    const loadRazorpayCheckout = (): Promise<boolean> => {
        return new Promise((resolve) => {
            if ((window as unknown as { Razorpay?: RazorpayConstructor }).Razorpay) return resolve(true);
            const existing = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
            if (existing) {
                (existing as HTMLScriptElement).addEventListener('load', () => resolve(true));
                (existing as HTMLScriptElement).addEventListener('error', () => resolve(false));
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePayAndConfirm = async () => {
        if (!createdBooking?._id) return;
        setPaymentLoading(true);
        try {
            const orderRes = await bookingService.createRazorpayOrder(createdBooking._id);
            if (!orderRes.success || !orderRes.data?.orderId || !orderRes.data?.keyId) {
                toast({
                    title: "Unable to start payment",
                    description: orderRes.error || "Failed to create Razorpay order",
                    variant: "destructive"
                });
                return;
            }

            const loaded = await loadRazorpayCheckout();
            if (!loaded) {
                toast({
                    title: "Payment unavailable",
                    description: "Failed to load Razorpay checkout",
                    variant: "destructive"
                });
                return;
            }

            const options = {
                key: orderRes.data.keyId,
                order_id: orderRes.data.orderId,
                amount: orderRes.data.amount,
                currency: orderRes.data.currency || 'INR',
                name: 'FarmConnect',
                description: `Machinery booking ${createdBooking.bookingNumber}`,
                prefill: {
                    name: userInfo.name,
                    email: userInfo.email,
                    contact: userInfo.phone
                },
                theme: { color: '#16a34a' },
                // Hide deprecated UPI collect flow; checkout will show Intent/QR appropriately
                config: {
                    display: {
                        hide: [{ method: 'upi', flows: ['collect'] }]
                    }
                },
                handler: async (rp: RazorpayHandlerResponse) => {
                    const verifyRes = await bookingService.processPayment(createdBooking._id, {
                        paymentMode: 'razorpay',
                        razorpayOrderId: rp.razorpay_order_id,
                        razorpayPaymentId: rp.razorpay_payment_id,
                        razorpaySignature: rp.razorpay_signature,
                        amount: createdBooking.finalAmount
                    });

                    if (verifyRes.success) {
                        toast({
                            title: "Payment successful",
                            description: "Your booking is now confirmed."
                        });
                        setTimeout(() => navigate('/bookings'), 1200);
                    } else {
                        toast({
                            title: "Payment verification failed",
                            description: verifyRes.error || "Please contact support",
                            variant: "destructive"
                        });
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast({
                            title: "Payment cancelled",
                            description: "You can retry payment anytime from this page."
                        });
                    }
                }
            };

            const RazorpayCtor = (window as unknown as { Razorpay: RazorpayConstructor }).Razorpay;
            const razorpay = new RazorpayCtor(options);
            razorpay.open();
        } catch (error) {
            toast({
                title: "Payment Error",
                description: "Failed to complete payment",
                variant: "destructive"
            });
        } finally {
            setPaymentLoading(false);
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

        const currentUserId = (user as any)?._id || (user as any)?.id;
        if (currentUserId && machinery?.ownerId && String(machinery.ownerId) === String(currentUserId)) {
            toast({
                title: "Not allowed",
                description: "You can't message yourself",
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
    const currentUserId = (user as unknown as { _id?: string; id?: string } | null)?. _id || (user as unknown as { _id?: string; id?: string } | null)?.id;
    const isSelfOwner = Boolean(currentUserId && machinery?.ownerId && String(machinery.ownerId) === String(currentUserId));

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <div className="container mx-auto px-4 py-5 sm:py-8">
                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => navigate('/machinery')}
                    className="mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Marketplace
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-8">
                    {/* Left Column - Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image Gallery */}
                        <Card>
                            <CardContent className="p-0">
                                <img
                                    src={machinery.images[0] || 'https://via.placeholder.com/800x400'}
                                    alt={machinery.name}
                                    className="w-full h-56 sm:h-80 lg:h-96 object-cover rounded-t-lg"
                                />
                            </CardContent>
                        </Card>

                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-2xl sm:text-3xl">{machinery.name}</CardTitle>
                                        <CardDescription className="text-base sm:text-lg mt-2">
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
                            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2">
                                <CardTitle>Owner Information</CardTitle>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={handleOpenChat}
                                    disabled={isSelfOwner}
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
                        <Card className="lg:sticky lg:top-4">
                            <CardHeader>
                                <CardTitle className="text-xl sm:text-2xl text-green-600">
                                    ₹{machinery.pricePerDay}/day
                                </CardTitle>
                                <CardDescription>
                                    {machinery.securityDeposit && `Security Deposit: ₹${machinery.securityDeposit}`}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Date Selection */}
                                <div className="space-y-2">
                                    <button
                                        type="button"
                                        className="w-full flex items-center justify-between text-sm font-medium"
                                        onClick={() => setMobileSections((s) => ({ ...s, dates: !s.dates }))}
                                    >
                                        <span>Select Dates</span>
                                        <span className="text-xs text-muted-foreground lg:hidden">{mobileSections.dates ? 'Hide' : 'Show'}</span>
                                    </button>
                                    <div className={`${mobileSections.dates ? 'block' : 'hidden'} lg:block`}>
                                        <div className="rounded-md border w-full overflow-hidden">
                                            <Calendar
                                                mode="range"
                                                selected={selectedDates}
                                        onSelect={(range: DateRange | undefined) => setSelectedDates((range as { from?: Date; to?: Date }) || { from: undefined, to: undefined })}
                                                disabled={(date) => date < new Date()}
                                                className="w-full [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-cell]:p-0 [&_.rdp-button]:h-8 [&_.rdp-button]:w-8 sm:[&_.rdp-button]:h-9 sm:[&_.rdp-button]:w-9"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Cost Breakdown */}
                                {selectedDates.from && selectedDates.to && costBreakdown && (
                                    <div className="rounded-lg border bg-secondary/10">
                                        <button
                                            type="button"
                                            className="w-full flex items-center justify-between px-3 py-2"
                                            onClick={() => setMobileSections((s) => ({ ...s, payment: !s.payment }))}
                                        >
                                            <span className="text-sm font-medium">Cost Summary</span>
                                            <span className="text-sm font-bold text-green-700">₹{costBreakdown.total}</span>
                                        </button>
                                        <div className={`${mobileSections.payment ? 'block' : 'hidden'} lg:block px-3 pb-3`}>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <div className="flex justify-between">
                                                    <span>₹{machinery.pricePerDay} × {costBreakdown.days} days</span>
                                                    <span>₹{costBreakdown.rentalCost}</span>
                                                </div>
                                                {costBreakdown.deliveryCharge > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Delivery</span>
                                                        <span>₹{costBreakdown.deliveryCharge}</span>
                                                    </div>
                                                )}
                                                {costBreakdown.securityDeposit > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Security deposit</span>
                                                        <span>₹{costBreakdown.securityDeposit}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <Separator className="my-2" />
                                            <div className="flex justify-between text-sm font-semibold">
                                                <span>Total</span>
                                                <span>₹{costBreakdown.total}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* User Info Form */}
                                {selectedDates.from && selectedDates.to && (
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            className="w-full flex items-center justify-between text-sm font-medium"
                                            onClick={() => setMobileSections((s) => ({ ...s, details: !s.details }))}
                                        >
                                            <span>Your Details</span>
                                            <span className="text-xs text-muted-foreground lg:hidden">{mobileSections.details ? 'Hide' : 'Show'}</span>
                                        </button>
                                        <div className={`${mobileSections.details ? 'block' : 'hidden'} lg:block space-y-3`}>
                                        <input
                                            type="text"
                                            placeholder="Your Name *"
                                            value={userInfo.name}
                                            onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md text-sm"
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number *"
                                            value={userInfo.phone}
                                            onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md text-sm"
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email *"
                                            value={userInfo.email}
                                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md text-sm"
                                        />
                                        <textarea
                                            placeholder="Purpose of rental (optional)"
                                            value={userInfo.purpose}
                                            onChange={(e) => setUserInfo({ ...userInfo, purpose: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-md text-sm"
                                            rows={3}
                                        />
                                        </div>
                                    </div>
                                )}

                                {/* Book/Pay Buttons */}
                                {!createdBooking ? (
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        size="lg"
                                        onClick={handleBookNow}
                                        disabled={isSelfOwner || !machinery.available || !selectedDates.from || !selectedDates.to || bookingLoading}
                                    >
                                        {bookingLoading ? (
                                            <>
                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                Creating booking...
                                            </>
                                        ) : (
                                            'Step 1: Request Booking'
                                        )}
                                    </Button>
                                ) : (
                                    <div className="space-y-2">
                                        <div className="text-xs text-muted-foreground bg-secondary/30 p-2 rounded">
                                            Booking {createdBooking.bookingNumber} created. Proceed to payment.
                                        </div>
                                        <Button
                                            className="w-full bg-primary hover:bg-primary/90"
                                            size="lg"
                                            onClick={handlePayAndConfirm}
                                            disabled={paymentLoading}
                                        >
                                            {paymentLoading ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    Processing payment...
                                                </>
                                            ) : (
                                                'Step 2: Pay with Razorpay (UPI QR)'
                                            )}
                                        </Button>
                                    </div>
                                )}

                                {isSelfOwner && (
                                    <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-2 rounded text-center">
                                        You can’t book or message yourself. This machinery belongs to you.
                                    </div>
                                )}

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
