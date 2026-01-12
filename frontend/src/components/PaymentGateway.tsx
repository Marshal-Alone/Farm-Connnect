import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { paymentService } from '@/lib/payment/paymentService';

interface PaymentGatewayProps {
    isOpen: boolean;
    onClose: () => void;
    bookingId: string;
    amount: number;
    onSuccess: () => void;
    paymentMode?: 'demo' | 'razorpay';
}

export default function PaymentGateway({
    isOpen,
    onClose,
    bookingId,
    amount,
    onSuccess,
    paymentMode = 'demo'
}: PaymentGatewayProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [cardDetails, setCardDetails] = useState({
        cardNumber: '',
        cardName: '',
        expiryDate: '',
        cvv: ''
    });

    const handleDemoPayment = async () => {
        setLoading(true);
        try {
            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            const response = await paymentService.processPayment({
                bookingId,
                amount,
                paymentMode: 'demo',
                paymentMethod: 'card'
            });

            if (response.success) {
                setPaymentSuccess(true);
                toast({
                    title: "Payment Successful!",
                    description: `₹${amount} has been paid successfully`
                });
                setTimeout(() => {
                    onSuccess();
                    onClose();
                }, 2000);
            } else {
                toast({
                    title: "Payment Failed",
                    description: response.error || "Please try again",
                    variant: "destructive"
                });
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast({
                title: "Payment Failed",
                description: "An error occurred during payment",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);
        try {
            const response = await paymentService.processPayment({
                bookingId,
                amount,
                paymentMode: 'razorpay',
                paymentMethod: 'card'
            });

            if (response.success && response.data) {
                // Load Razorpay script and open payment modal
                const script = document.createElement('script');
                script.src = 'https://checkout.razorpay.com/v1/checkout.js';
                script.async = true;
                document.body.appendChild(script);

                script.onload = () => {
                    const options = {
                        key: response.data.razorpayKeyId,
                        amount: response.data.amount,
                        currency: 'INR',
                        name: 'Farm Connect',
                        description: `Booking Payment #${bookingId}`,
                        order_id: response.data.orderId,
                        handler: async (razorpayResponse: any) => {
                            // Verify payment
                            const verifyResponse = await paymentService.verifyPayment({
                                orderId: response.data.orderId,
                                paymentId: razorpayResponse.razorpay_payment_id,
                                signature: razorpayResponse.razorpay_signature
                            });

                            if (verifyResponse.success) {
                                setPaymentSuccess(true);
                                toast({
                                    title: "Payment Successful!",
                                    description: `₹${amount} has been paid successfully`
                                });
                                setTimeout(() => {
                                    onSuccess();
                                    onClose();
                                }, 2000);
                            }
                        },
                        prefill: {
                            name: 'Demo User',
                            email: 'user@example.com',
                            contact: '9876543210'
                        },
                        theme: {
                            color: '#16a34a'
                        }
                    };

                    const razorpay = new (window as any).Razorpay(options);
                    razorpay.open();
                };
            }
        } catch (error) {
            console.error('Payment error:', error);
            toast({
                title: "Payment Failed",
                description: "An error occurred during payment",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (paymentMode === 'demo') {
            handleDemoPayment();
        } else {
            handleRazorpayPayment();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Gateway
                    </DialogTitle>
                    <DialogDescription>
                        {paymentMode === 'demo' ? 'Demo Mode - No real payment will be processed' : 'Secure payment powered by Razorpay'}
                    </DialogDescription>
                </DialogHeader>

                {paymentSuccess ? (
                    <div className="py-8 text-center">
                        <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-green-600" />
                        <h3 className="text-xl font-semibold mb-2">Payment Successful!</h3>
                        <p className="text-muted-foreground">Your booking has been confirmed</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="bg-secondary/50 p-4 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-muted-foreground">Amount to Pay</span>
                                <span className="text-2xl font-bold text-green-600">₹{amount.toLocaleString()}</span>
                            </div>
                        </div>

                        {paymentMode === 'demo' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="cardNumber">Card Number</Label>
                                    <Input
                                        id="cardNumber"
                                        placeholder="1234 5678 9012 3456"
                                        value={cardDetails.cardNumber}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                                        maxLength={19}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cardName">Cardholder Name</Label>
                                    <Input
                                        id="cardName"
                                        placeholder="John Doe"
                                        value={cardDetails.cardName}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cardName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                        <Input
                                            id="expiryDate"
                                            placeholder="MM/YY"
                                            value={cardDetails.expiryDate}
                                            onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                                            maxLength={5}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input
                                            id="cvv"
                                            placeholder="123"
                                            type="password"
                                            value={cardDetails.cvv}
                                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                            maxLength={3}
                                            required
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-green-600 hover:bg-green-700"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    `Pay ₹${amount.toLocaleString()}`
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
