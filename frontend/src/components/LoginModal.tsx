import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Sprout, Loader2, Shield, KeyRound } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { otpService } from '@/lib/otp';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { login, register, loading } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('login');
  const [otpStep, setOtpStep] = useState<'identifier' | 'otp'>('identifier');
  const [otpLoading, setOtpLoading] = useState(false);
  const [currentIdentifier, setCurrentIdentifier] = useState('');
  const [identifierType, setIdentifierType] = useState<'email' | 'phone'>('email');
  
  const [loginForm, setLoginForm] = useState({
    identifier: '', // email or phone
    otp: ''
  });

  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    language: 'hindi',
    farmSize: 0,
    crops: [] as string[],
    otp: ''
  });

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const demoAccounts = [
    {
      name: 'राम शर्मा (Maharashtra Farmer)',
      identifier: 'ram@farmer.com',
      language: 'Hindi',
      crops: ['Rice', 'Wheat', 'Sugarcane']
    },
    {
      name: 'Priya Nair (Kerala Farmer)',
      identifier: 'priya@farmer.com',
      language: 'Malayalam',
      crops: ['Coconut', 'Pepper', 'Cardamom']
    },
    {
      name: 'Harpreet Singh (Punjab Farmer)',
      identifier: '+919876543212',
      language: 'Punjabi',
      crops: ['Wheat', 'Rice', 'Cotton']
    }
  ];

  const handleSendOTP = async (identifier: string, type: 'email' | 'phone') => {
    setOtpLoading(true);
    
    try {
      const result = await otpService.sendOTP(identifier, type);
      
      if (result.success) {
        setCurrentIdentifier(identifier);
        setIdentifierType(type);
        setOtpStep('otp');
        
        toast({
          title: "OTP Sent",
          description: `OTP sent to ${identifier}${result.otp ? ` (Demo OTP: ${result.otp})` : ''}`,
        });
      } else {
        toast({
          title: "Failed to Send OTP",
          description: "Please try again later.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setOtpLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otpStep === 'identifier') {
      if (!loginForm.identifier) {
        toast({
          title: "Missing Information",
          description: "Please enter your email or phone number.",
          variant: "destructive"
        });
        return;
      }

      const isEmail = otpService.isValidEmail(loginForm.identifier);
      const isPhone = otpService.isValidPhone(loginForm.identifier);
      
      if (!isEmail && !isPhone) {
        toast({
          title: "Invalid Format",
          description: "Please enter a valid email or phone number.",
          variant: "destructive"
        });
        return;
      }

      const type = isEmail ? 'email' : 'phone';
      const formattedIdentifier = type === 'phone' ? otpService.formatPhoneNumber(loginForm.identifier) : loginForm.identifier;
      
      await handleSendOTP(formattedIdentifier, type);
    } else {
      // Verify OTP and login
      if (!loginForm.otp) {
        toast({
          title: "Missing OTP",
          description: "Please enter the OTP.",
          variant: "destructive"
        });
        return;
      }

      const verified = await otpService.verifyOTP(currentIdentifier, loginForm.otp);
      
      if (verified) {
        const success = await login(currentIdentifier, 'otp_verified');
        
        if (success) {
          toast({
            title: "Login Successful",
            description: "Welcome back to FarmConnect!",
          });
          onClose();
          resetForm();
        } else {
          toast({
            title: "Login Failed",
            description: "Account not found. Please register first.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check and try again.",
          variant: "destructive"
        });
      }
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!registerForm.name || !registerForm.email || !registerForm.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!otpService.isValidEmail(registerForm.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    if (!otpService.isValidPhone(registerForm.phone)) {
      toast({
        title: "Invalid Phone",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return;
    }

    // For registration, we'll verify phone number
    const formattedPhone = otpService.formatPhoneNumber(registerForm.phone);
    
    if (!registerForm.otp) {
      // Send OTP first
      await handleSendOTP(formattedPhone, 'phone');
      return;
    }

    // Verify OTP and register
    const verified = await otpService.verifyOTP(formattedPhone, registerForm.otp);
    
    if (verified) {
      const success = await register({
        ...registerForm,
        phone: formattedPhone,
        password: 'otp_verified'
      });
      
      if (success) {
        toast({
          title: "Registration Successful",
          description: "Welcome to FarmConnect!",
        });
        onClose();
        resetForm();
      } else {
        toast({
          title: "Registration Failed",
          description: "An account with this email or phone already exists.",
          variant: "destructive"
        });
      }
    } else {
      toast({
        title: "Invalid OTP",
        description: "Please check and try again.",
        variant: "destructive"
      });
    }
  };

  const handleDemoLogin = (identifier: string) => {
    setLoginForm({ identifier, otp: '' });
    setActiveTab('login');
    setOtpStep('identifier');
  };

  const resetForm = () => {
    setLoginForm({ identifier: '', otp: '' });
    setRegisterForm({
      name: '',
      email: '',
      phone: '',
      location: '',
      language: 'hindi',
      farmSize: 0,
      crops: [],
      otp: ''
    });
    setOtpStep('identifier');
    setCurrentIdentifier('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <Button 
          variant="ghost" 
          size="sm"
          className="absolute top-3 right-3 z-10 h-8 w-8 p-0 rounded-full"
          onClick={onClose}
        >
          ✕
        </Button>
        <CardHeader className="text-center pt-8">
          <CardTitle className="flex items-center justify-center space-x-2">
            <Sprout className="h-6 w-6 text-primary" />
            <span>FarmConnect</span>
          </CardTitle>
          <CardDescription>
            Join our agricultural community platform
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                {otpStep === 'identifier' ? (
                  <>
                    <div>
                      <Label htmlFor="login-identifier">Email or Phone Number</Label>
                      <Input
                        id="login-identifier"
                        type="text"
                        placeholder="your.email@example.com or 9876543210"
                        value={loginForm.identifier}
                        onChange={(e) => setLoginForm({...loginForm, identifier: e.target.value})}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter your email address or phone number to receive OTP
                      </p>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || otpLoading}>
                      {otpLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <KeyRound className="h-4 w-4 mr-2" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <Shield className="h-8 w-8 text-primary mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        OTP sent to {currentIdentifier}
                      </p>
                      <p className="text-xs text-green-600 mt-1 font-medium">
                        Demo OTP: Check console for generated OTP
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="login-otp">Enter OTP</Label>
                      <Input
                        id="login-otp"
                        type="text"
                        placeholder="123456"
                        value={loginForm.otp}
                        onChange={(e) => setLoginForm({...loginForm, otp: e.target.value})}
                        maxLength={6}
                        required
                      />
                    </div>

                    <div className="flex space-x-2">
                      <Button type="submit" className="flex-1" disabled={loading}>
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          'Verify & Login'
                        )}
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {setOtpStep('identifier'); setLoginForm({...loginForm, otp: ''});}}
                      >
                        Back
                      </Button>
                    </div>
                  </>
                )}
              </form>

              {/* Demo Accounts - Quick Access */}
              {otpStep === 'identifier' && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3 text-center">Quick Demo Login</p>
                  <div className="space-y-2">
                    {demoAccounts.map((account, index) => (
                      <div 
                        key={index}
                        className="p-3 border rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors"
                        onClick={async () => {
                          // Directly login with demo account
                          const success = await login(account.identifier, 'farmer123');
                          if (success) {
                            toast({
                              title: "Demo Login Successful",
                              description: `Welcome ${account.name.split(' ')[0]}!`,
                            });
                            onClose();
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{account.name}</p>
                            <p className="text-xs text-muted-foreground">{account.identifier}</p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {account.language}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {account.crops.slice(0, 2).map((crop, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {crop}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="register-name">Full Name *</Label>
                    <Input
                      id="register-name"
                      placeholder="Your name"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="register-email">Email *</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="register-phone">Phone Number *</Label>
                    <Input
                      id="register-phone"
                      placeholder="9876543210"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      OTP will be sent to this number for verification
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="register-location">Location</Label>
                      <Input
                        id="register-location"
                        placeholder="City, State"
                        value={registerForm.location}
                        onChange={(e) => setRegisterForm({...registerForm, location: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="register-farmsize">Farm Size (acres)</Label>
                      <Input
                        id="register-farmsize"
                        type="number"
                        placeholder="0"
                        value={registerForm.farmSize}
                        onChange={(e) => setRegisterForm({...registerForm, farmSize: Number(e.target.value)})}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="register-language">Preferred Language</Label>
                    <Select 
                      value={registerForm.language} 
                      onValueChange={(value) => setRegisterForm({...registerForm, language: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindi">Hindi (हिंदी)</SelectItem>
                        <SelectItem value="marathi">Marathi (मराठी)</SelectItem>
                        <SelectItem value="malayalam">Malayalam (മലയാളം)</SelectItem>
                        <SelectItem value="punjabi">Punjabi (ਪੰਜਾਬੀ)</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {registerForm.name && registerForm.email && registerForm.phone && (
                    <div>
                      <Label htmlFor="register-otp">OTP (will be sent to phone)</Label>
                      <Input
                        id="register-otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        value={registerForm.otp}
                        onChange={(e) => setRegisterForm({...registerForm, otp: e.target.value})}
                        maxLength={6}
                      />
                      {!registerForm.otp && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Click "Send OTP" to receive verification code
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading || otpLoading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : otpLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending OTP...
                    </>
                  ) : registerForm.otp ? (
                    'Verify & Create Account'
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}