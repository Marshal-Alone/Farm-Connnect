import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { machineryService } from '@/lib/api/machineryService';
import { bookingService } from '@/lib/api/bookingService';
import { MachinerySchema } from '@/lib/schemas/machinery.schema';
import { BookingSchema } from '@/lib/schemas/booking.schema';
import { User, MapPin, Phone, Mail, Globe, Sprout, TrendingUp, Calendar, Bell, Settings, Key, Trash2, IndianRupee, Package, CheckCircle, Clock, XCircle, Loader2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { geminiAI } from '@/lib/gemini';
import { groqAI } from '@/lib/groq';
import { getModelConfig, saveModelConfig, ModelConfig } from '@/lib/ai';


export default function UserProfile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // Owner Dashboard state
  const [machinery, setMachinery] = useState<MachinerySchema[]>([]);
  const [dashboardBookings, setDashboardBookings] = useState<BookingSchema[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    totalMachinery: 0,
    activeMachinery: 0,
    totalBookings: 0,
    totalEarnings: 0,
    pendingRequests: 0
  });
  const ownerId = user?._id || user?.id || ''; // Use actual logged-in user ID

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState('');
  const [showGroqApiKey, setShowGroqApiKey] = useState(false);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(getModelConfig());

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    language: user?.language || 'hindi',
    farmSize: user?.farmSize || 0,
    crops: user?.crops || []
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
    });
    setIsEditing(false);
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      geminiAI.updateAPIKey(apiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved and will be used for AI analysis.",
      });
      setApiKey('');
      setShowApiKey(false);
    }
  };

  const handleRemoveApiKey = () => {
    geminiAI.removeAPIKey();
    toast({
      title: "API Key Removed",
      description: "Removed your custom API key. Using default key now.",
    });
  };

  const getCurrentApiKey = () => {
    const saved = localStorage.getItem('gemini_api_key');
    return saved ? `${saved.substring(0, 8)}...${saved.substring(saved.length - 4)}` : 'Using default key';
  };


  // Groq API key handlers
  const handleSaveGroqApiKey = () => {
    if (groqApiKey.trim()) {
      groqAI.updateAPIKey(groqApiKey.trim());
      toast({
        title: "API Key Saved",
        description: "Your Groq API key has been saved and will be used when Groq model is selected.",
      });
      setGroqApiKey('');
      setShowGroqApiKey(false);
    }
  };

  const handleRemoveGroqApiKey = () => {
    groqAI.removeAPIKey();
    toast({
      title: "API Key Removed",
      description: "Removed your Groq API key.",
    });
  };

  const getCurrentGroqApiKey = () => {
    const saved = localStorage.getItem('groq_api_key');
    return saved ? `${saved.substring(0, 8)}...${saved.substring(saved.length - 4)}` : 'Not configured';
  };

  // Owner Dashboard functions
  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      const machineryResponse = await machineryService.getMachinery({ limit: 100 });
      const bookingsResponse = await bookingService.getOwnerBookings(ownerId);

      let ownerMachinery: MachinerySchema[] = [];

      if (machineryResponse.success) {
        ownerMachinery = machineryResponse.data.filter(m => m.ownerId === ownerId);
        setMachinery(ownerMachinery);
      }

      if (bookingsResponse.success) {
        setDashboardBookings(bookingsResponse.data);

        const totalEarnings = bookingsResponse.data
          .filter(b => b.paymentStatus === 'paid')
          .reduce((sum, b) => sum + b.finalAmount, 0);

        const pendingRequests = bookingsResponse.data.filter(b => b.status === 'pending').length;

        setDashboardStats({
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
      setDashboardLoading(false);
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, 'confirmed');
      if (response.success) {
        toast({ title: "Booking Approved", description: "The booking has been confirmed" });
        fetchDashboardData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to approve booking", variant: "destructive" });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, 'cancelled');
      if (response.success) {
        toast({ title: "Booking Rejected", description: "The booking has been cancelled" });
        fetchDashboardData();
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to reject booking", variant: "destructive" });
    }
  };

  const handleEditMachinery = (machineryId: string) => {
    window.location.href = `/machinery/edit/${machineryId}`;
  };

  const handleDeleteMachinery = (machineryId: string, machineryName: string) => {
    // Show custom delete dialog
    setDeleteDialog({ open: true, id: machineryId, name: machineryName });
  };

  const confirmDeleteMachinery = async () => {
    const { id, name } = deleteDialog;
    console.log('Deleting machinery:', id, name);

    try {
      const response = await machineryService.deleteMachinery(id);
      console.log('Delete response:', response);

      if (response.success) {
        toast({ title: "Machinery Deleted", description: `${name} has been deleted successfully` });
        fetchDashboardData();
      } else {
        toast({ title: "Error", description: response.error || "Failed to delete machinery", variant: "destructive" });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({ title: "Error", description: "Failed to delete machinery", variant: "destructive" });
    } finally {
      setDeleteDialog({ open: false, id: '', name: '' });
    }
  };

  // Model config handler
  const handleSaveModelConfig = () => {
    saveModelConfig(modelConfig);
    toast({
      title: "Model Settings Saved",
      description: "Your preferred AI model has been saved.",
    });
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-muted-foreground">You need to be logged in to view your profile.</p>
          <br />

          <Button
            variant="outline"
            size="lg"
            className="border-2 border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
            onClick={() => {
              // Trigger login modal - find the app component
              const appRoot = document.getElementById('root');
              if (appRoot) {
                const event = new CustomEvent('openLoginModal');
                appRoot.dispatchEvent(event);
              }
            }}
          >
            <User className="w-5 h-5 mr-2" />
            Get Started Free
          </Button>

        </div>
      </div>
    );
  }

  // Mock data for demonstration
  const recentActivity = [
    { id: 1, type: 'disease-check', description: 'Checked tomato leaf disease', date: '2025-01-15', result: 'Early Blight detected' },
    { id: 2, type: 'machinery-booking', description: 'Booked John Deere tractor', date: '2025-01-13', result: 'Booking confirmed' },
    { id: 3, type: 'scheme-application', description: 'Applied for PM-KISAN scheme', date: '2025-01-12', result: 'Application submitted' }
  ];

  const notifications = [
    { id: 1, type: 'weather', message: 'Heavy rain expected in your area tomorrow', priority: 'high' },
    { id: 2, type: 'scheme', message: 'New subsidy scheme available for organic farmers', priority: 'medium' },
    { id: 3, type: 'machinery', message: 'Your booked tractor is ready for pickup', priority: 'high' },
    { id: 4, type: 'ai-insight', message: 'Optimal sowing time for cotton approaching', priority: 'low' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Profile Dashboard</h1>
            <p className="text-muted-foreground">Manage your account and farm information</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="dashboard" onClick={() => fetchDashboardData()}>Dashboard</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Profile Summary */}
              <Card>
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle>{user.name}</CardTitle>
                  <CardDescription className="flex items-center justify-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {user.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Farm Size</span>
                      <span className="font-medium">{user.farmSize} acres</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Crops</span>
                      <span className="font-medium">{user.crops.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Language</span>
                      <span className="font-medium capitalize">{user.language}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Farm Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Farm Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Yield Efficiency</span>
                      <span>78%</span>
                    </div>
                    <Progress value={78} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Soil Health</span>
                      <span>85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Water Usage</span>
                      <span>62%</span>
                    </div>
                    <Progress value={62} />
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Sprout className="h-4 w-4 mr-2" />
                    Check Crop Health
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Check Growth Rate
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Book Machinery
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Globe className="h-4 w-4 mr-2" />
                    Find Schemes
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/10">
                      <div className={`w-2 h-2 rounded-full mt-2 ${notification.priority === 'high' ? 'bg-red-500' :
                        notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`} />
                      <div className="flex-1">
                        <p className="text-sm">{notification.message}</p>
                        <Badge variant="outline" className="text-xs mt-1 capitalize">
                          {notification.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal and farm details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData({ ...formData, language: value })} disabled={!isEditing}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hindi">Hindi</SelectItem>
                        <SelectItem value="marathi">Marathi</SelectItem>
                        <SelectItem value="malayalam">Malayalam</SelectItem>
                        <SelectItem value="punjabi">Punjabi</SelectItem>
                        <SelectItem value="english">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="farmSize">Farm Size (acres)</Label>
                    <Input
                      id="farmSize"
                      type="number"
                      value={formData.farmSize}
                      onChange={(e) => setFormData({ ...formData, farmSize: Number(e.target.value) })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label>Current Crops</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {user.crops.map((crop, index) => (
                      <Badge key={index} variant="secondary">
                        {crop}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your farming activities and platform usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-lg border">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {activity.type === 'disease-check' && <Sprout className="h-5 w-5 text-primary" />}
                        {activity.type === 'machinery-booking' && <Calendar className="h-5 w-5 text-primary" />}
                        {activity.type === 'scheme-application' && <Globe className="h-5 w-5 text-primary" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{activity.description}</h4>
                        <p className="text-sm text-muted-foreground">{activity.result}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard">
            {dashboardLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Machinery</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.totalMachinery}</div>
                      <p className="text-xs text-muted-foreground">{dashboardStats.activeMachinery} available</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.totalBookings}</div>
                      <p className="text-xs text-muted-foreground">{dashboardStats.pendingRequests} pending</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                      <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{dashboardStats.totalEarnings.toLocaleString()}</div>
                      <p className="text-xs text-muted-foreground">From confirmed bookings</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{dashboardStats.pendingRequests}</div>
                      <p className="text-xs text-muted-foreground">Awaiting approval</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Tabs for Machinery and Bookings */}
                <Tabs defaultValue="machinery" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="machinery">My Machinery</TabsTrigger>
                    <TabsTrigger value="bookings">Booking Requests</TabsTrigger>
                  </TabsList>

                  <TabsContent value="machinery" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">My Machinery</h3>
                      <Button onClick={() => window.location.href = '/machinery/add'}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Machinery
                      </Button>
                    </div>

                    {machinery.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No machinery listed yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid gap-4">
                        {machinery.map((item) => (
                          <Card key={item._id}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold text-lg">{item.name}</h4>
                                  <p className="text-sm text-muted-foreground">{item.category}</p>
                                  <div className="flex gap-4 mt-2">
                                    <span className="text-sm">₹{item.pricePerDay}/day</span>
                                    <Badge variant={item.available ? "default" : "secondary"}>
                                      {item.available ? "Available" : "Unavailable"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" onClick={() => handleEditMachinery(item._id!)}>
                                    Edit
                                  </Button>
                                  <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDeleteMachinery(item._id!, item.name)}>
                                    Delete
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="bookings" className="space-y-4">
                    <h3 className="text-lg font-semibold">Booking Requests</h3>

                    {dashboardBookings.length === 0 ? (
                      <Card>
                        <CardContent className="py-12 text-center">
                          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-muted-foreground">No booking requests yet</p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid gap-4">
                        {dashboardBookings.map((booking) => (
                          <Card key={booking._id}>
                            <CardContent className="p-6">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{booking.machineryName}</h4>
                                  <p className="text-sm text-muted-foreground">Renter: {booking.renterName}</p>
                                  <div className="flex gap-4 mt-2 text-sm">
                                    <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                                    <span className="font-semibold">₹{booking.finalAmount}</span>
                                  </div>
                                  <Badge className="mt-2" variant={
                                    booking.status === 'confirmed' ? 'default' :
                                      booking.status === 'pending' ? 'secondary' : 'destructive'
                                  }>
                                    {booking.status}
                                  </Badge>
                                </div>
                                {booking.status === 'pending' && (
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleApproveBooking(booking._id!)}>
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      Approve
                                    </Button>
                                    <Button size="sm" variant="outline" onClick={() => handleRejectBooking(booking._id!)}>
                                      <XCircle className="h-4 w-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* API Keys Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    AI Analysis API Keys
                  </CardTitle>
                  <CardDescription>
                    Configure your API keys for Gemini and Groq models
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Gemini API Key */}
                  <div className="space-y-3 pb-4 border-b">
                    <h3 className="font-medium">Gemini API Key</h3>
                    <div>
                      <Label>Current Status</Label>
                      <div className="text-sm text-muted-foreground mt-1">
                        {getCurrentApiKey()}
                      </div>
                    </div>

                    {showApiKey ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="api-key">Enter your Gemini API Key</Label>
                          <Input
                            id="api-key"
                            placeholder="AIzaSy..."
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            type="password"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            Get your free API key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveApiKey}>Save API Key</Button>
                          <Button variant="outline" onClick={() => { setShowApiKey(false); setApiKey(''); }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowApiKey(true)}>
                          Add API Key
                        </Button>
                        {localStorage.getItem('gemini_api_key') && (
                          <Button variant="outline" onClick={handleRemoveApiKey}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Custom Key
                          </Button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Groq API Key */}
                  <div className="space-y-3">
                    <h3 className="font-medium">Groq API Key</h3>
                    <div>
                      <Label>Current Status</Label>
                      <div className="text-sm text-muted-foreground mt-1">
                        {getCurrentGroqApiKey()}
                      </div>
                    </div>

                    {showGroqApiKey ? (
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="groq-api-key">Enter your Groq API Key</Label>
                          <Input
                            id="groq-api-key"
                            placeholder="gsk_..."
                            value={groqApiKey}
                            onChange={(e) => setGroqApiKey(e.target.value)}
                            type="password"
                          />
                          <div className="text-xs text-muted-foreground mt-1">
                            Get your free API key from <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Groq Console</a>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button onClick={handleSaveGroqApiKey}>Save API Key</Button>
                          <Button variant="outline" onClick={() => { setShowGroqApiKey(false); setGroqApiKey(''); }}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={() => setShowGroqApiKey(true)}>
                          Add API Key
                        </Button>
                        {localStorage.getItem('groq_api_key') && (
                          <Button variant="outline" onClick={handleRemoveGroqApiKey}>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Remove Key
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Model Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    AI Model Selection
                  </CardTitle>
                  <CardDescription>Choose which AI model to use for disease detection</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Disease Detection Model</Label>
                    <Select
                      value={modelConfig.diseaseDetection}
                      onValueChange={(value) => setModelConfig({ ...modelConfig, diseaseDetection: value as 'gemini' | 'groq' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini">Google Gemini 2.0 Flash - Fast & accurate</SelectItem>
                        <SelectItem value="groq">Groq Llama 4 Scout - Ultra-fast inference</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Chatbot Model (Future Feature)</Label>
                    <Select
                      value={modelConfig.chatbot}
                      onValueChange={(value) => setModelConfig({ ...modelConfig, chatbot: value as 'gemini' | 'groq' })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini">Google Gemini - Advanced conversational AI</SelectItem>
                        <SelectItem value="groq">Groq Llama - Lightning-fast responses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSaveModelConfig}>Save Model Preferences</Button>
                </CardContent>
              </Card>

              {/* Other Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Preferences
                  </CardTitle>
                  <CardDescription>Manage your preferences and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3">Notification Preferences</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Weather alerts</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Scheme notifications</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Machinery reminders</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">AI insights</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Privacy Settings</h3>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Share farm data for insights</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Allow location tracking</span>
                      </label>
                    </div>
                  </div>

                  <Button>Save Settings</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog - Placed at root level to work on all tabs */}
        {deleteDialog.open && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle>Confirm Delete</CardTitle>
                <CardDescription>
                  Are you sure you want to delete "{deleteDialog.name}"? This action cannot be undone.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDeleteDialog({ open: false, id: '', name: '' })}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDeleteMachinery}>
                  Delete
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
