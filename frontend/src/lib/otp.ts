interface OTPData {
  email?: string;
  phone?: string;
  otp: string;
  timestamp: number;
  verified: boolean;
}

class OTPService {
  private STORAGE_KEY = 'otp_verifications';
  private OTP_EXPIRY = 5 * 60 * 1000; // 5 minutes

  // Generate 6-digit OTP
  generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP (simulated)
  async sendOTP(identifier: string, type: 'email' | 'phone'): Promise<{ success: boolean; otp?: string }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const otp = this.generateOTP();
    const otpData: OTPData = {
      [type]: identifier,
      otp,
      timestamp: Date.now(),
      verified: false
    };

    // Store OTP data
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const otps: Record<string, OTPData> = stored ? JSON.parse(stored) : {};
    otps[identifier] = otpData;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otps));

    // For demo purposes, return the OTP so users can see it
    console.log(`OTP for ${identifier}: ${otp}`);
    
    return { success: true, otp }; // In production, don't return OTP
  }

  // Verify OTP
  async verifyOTP(identifier: string, inputOTP: string): Promise<boolean> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return false;

    const otps: Record<string, OTPData> = JSON.parse(stored);
    const otpData = otps[identifier];

    if (!otpData) return false;

    // Check if OTP is expired
    if (Date.now() - otpData.timestamp > this.OTP_EXPIRY) {
      delete otps[identifier];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otps));
      return false;
    }

    // Check if OTP matches
    if (otpData.otp === inputOTP) {
      otpData.verified = true;
      otps[identifier] = otpData;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otps));
      return true;
    }

    return false;
  }

  // Check if identifier is verified
  isVerified(identifier: string): boolean {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return false;

    const otps: Record<string, OTPData> = JSON.parse(stored);
    const otpData = otps[identifier];

    if (!otpData) return false;

    // Check if verification is still valid (not expired)
    if (Date.now() - otpData.timestamp > this.OTP_EXPIRY) {
      return false;
    }

    return otpData.verified;
  }

  // Clear expired OTPs
  clearExpiredOTPs(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return;

    const otps: Record<string, OTPData> = JSON.parse(stored);
    const now = Date.now();
    
    Object.keys(otps).forEach(key => {
      if (now - otps[key].timestamp > this.OTP_EXPIRY) {
        delete otps[key];
      }
    });

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otps));
  }

  // Format phone number
  formatPhoneNumber(phone: string): string {
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, '');
    
    // Add +91 if not present and it's 10 digits
    if (cleaned.length === 10) {
      return `+91${cleaned}`;
    }
    
    // If already has country code
    if (cleaned.length === 12 && cleaned.startsWith('91')) {
      return `+${cleaned}`;
    }
    
    return phone; // Return as-is if format is unclear
  }

  // Validate email format
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate phone format
  isValidPhone(phone: string): boolean {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
  }
}

export const otpService = new OTPService();
export type { OTPData };