// Payment Service with Demo and Real (Razorpay) modes
declare global {
    interface Window {
        Razorpay: any;
    }
}

export interface PaymentConfig {
    mode: 'demo' | 'razorpay';
    razorpayKeyId?: string;
}

export interface PaymentOptions {
    amount: number; // in rupees
    currency?: string;
    name: string;
    description: string;
    orderId?: string;
    prefill?: {
        name: string;
        email: string;
        contact: string;
    };
    notes?: {
        [key: string]: string;
    };
}

export interface PaymentResult {
    success: boolean;
    paymentId?: string;
    orderId?: string;
    signature?: string;
    error?: string;
    mode: 'demo' | 'razorpay';
}

class PaymentService {
    private config: PaymentConfig = {
        mode: 'demo'
    };

    // Initialize payment service
    initialize(config: PaymentConfig) {
        this.config = config;

        // Load Razorpay script if in razorpay mode
        if (config.mode === 'razorpay' && !window.Razorpay) {
            this.loadRazorpayScript();
        }
    }

    // Load Razorpay script
    private loadRazorpayScript(): Promise<boolean> {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    }

    // Process payment
    async processPayment(options: PaymentOptions): Promise<PaymentResult> {
        if (this.config.mode === 'demo') {
            return this.processDemoPayment(options);
        } else {
            return this.processRazorpayPayment(options);
        }
    }

    // Demo payment (instant success)
    private async processDemoPayment(options: PaymentOptions): Promise<PaymentResult> {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        return {
            success: true,
            paymentId: `demo_pay_${Date.now()}`,
            orderId: `demo_order_${Date.now()}`,
            signature: `demo_sig_${Date.now()}`,
            mode: 'demo'
        };
    }

    // Razorpay payment
    private async processRazorpayPayment(options: PaymentOptions): Promise<PaymentResult> {
        return new Promise((resolve) => {
            if (!window.Razorpay) {
                resolve({
                    success: false,
                    error: 'Razorpay SDK not loaded',
                    mode: 'razorpay'
                });
                return;
            }

            if (!this.config.razorpayKeyId) {
                resolve({
                    success: false,
                    error: 'Razorpay key not configured',
                    mode: 'razorpay'
                });
                return;
            }

            const razorpayOptions = {
                key: this.config.razorpayKeyId,
                amount: options.amount * 100, // Convert to paise
                currency: options.currency || 'INR',
                name: options.name,
                description: options.description,
                order_id: options.orderId,
                prefill: options.prefill,
                notes: options.notes,
                theme: {
                    color: '#10b981' // Green theme
                },
                handler: (response: any) => {
                    resolve({
                        success: true,
                        paymentId: response.razorpay_payment_id,
                        orderId: response.razorpay_order_id,
                        signature: response.razorpay_signature,
                        mode: 'razorpay'
                    });
                },
                modal: {
                    ondismiss: () => {
                        resolve({
                            success: false,
                            error: 'Payment cancelled by user',
                            mode: 'razorpay'
                        });
                    }
                }
            };

            const razorpay = new window.Razorpay(razorpayOptions);
            razorpay.open();
        });
    }

    // Create Razorpay order (backend call)
    async createOrder(amount: number, currency: string = 'INR', notes?: any): Promise<{ success: boolean; orderId?: string; error?: string }> {
        try {
            // This should call your backend API to create a Razorpay order
            const response = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, currency, notes }),
            });

            return await response.json();
        } catch (error) {
            console.error('Error creating order:', error);
            return {
                success: false,
                error: 'Failed to create payment order'
            };
        }
    }

    // Verify payment signature (backend call)
    async verifyPayment(orderId: string, paymentId: string, signature: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await fetch('/api/payment/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, paymentId, signature }),
            });

            return await response.json();
        } catch (error) {
            console.error('Error verifying payment:', error);
            return {
                success: false,
                error: 'Failed to verify payment'
            };
        }
    }

    // Get current mode
    getMode(): 'demo' | 'razorpay' {
        return this.config.mode;
    }

    // Switch mode
    setMode(mode: 'demo' | 'razorpay') {
        this.config.mode = mode;
        if (mode === 'razorpay' && !window.Razorpay) {
            this.loadRazorpayScript();
        }
    }
}

export const paymentService = new PaymentService();

// Initialize with demo mode by default
// To use Razorpay, call: paymentService.initialize({ mode: 'razorpay', razorpayKeyId: 'your_key_id' })
paymentService.initialize({ mode: 'demo' });
