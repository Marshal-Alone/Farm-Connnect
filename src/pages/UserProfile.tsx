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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { machineryService } from '@/lib/api/machineryService';
import { bookingService } from '@/lib/api/bookingService';
import { messageService } from '@/lib/api/messageService';
import { MachinerySchema } from '@/lib/schemas/machinery.schema';
import { BookingSchema } from '@/lib/schemas/booking.schema';
import { MessageSchema } from '@/lib/schemas/message.schema';
import { User, MapPin, Phone, Mail, Globe, Sprout, Calendar, Settings, Key, Trash2, IndianRupee, Package, CheckCircle, Clock, XCircle, Loader2, Plus, MessageSquare, Edit2, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { geminiAI } from '@/lib/gemini';
import { groqAI } from '@/lib/groq';
import { getModelConfig, saveModelConfig, ModelConfig } from '@/lib/ai';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  // State Management
  const [machinery, setMachinery] = useState<MachinerySchema[]>([]);
  const [userBookings, setUserBookings] = useState<BookingSchema[]>([]);
  const [ownerBookings, setOwnerBookings] = useState<BookingSchema[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<BookingSchema | null>(null);
  const [bookingMessages, setBookingMessages] = useState<MessageSchema[]>([]);
  const [messageText, setMessageText] = useState('');

  // Profile Editing
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    location: user?.location || '',
    language: user?.language || 'hindi',
    farmSize: user?.farmSize || 0,
    crops: (user?.crops || []).join(', ')
  });

  // Machinery Management
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: ''
  });

  // Bookings Filter
  const [bookingFilter, setBookingFilter] = useState('all');

  // API Key Management
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [groqApiKey, setGroqApiKey] = useState('');
  const [showGroqApiKey, setShowGroqApiKey] = useState(false);
  const [modelConfig, setModelConfig] = useState<ModelConfig>(getModelConfig());

  const ownerId = user?._id || user?.id || '';

  // Fetch Data
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      const [bookingsRes, machineryRes, ownerBookingsRes] = await Promise.all([
        bookingService.getUserBookings(ownerId),
        machineryService.getMachinery({ limit: 100 }),
        bookingService.getOwnerBookings(ownerId)
      ]);

      if (bookingsRes.success) setUserBookings(bookingsRes.data);
      if (machineryRes.success) {
        const userMachinery = machineryRes.data.filter(m => m.ownerId === ownerId);
        setMachinery(userMachinery);
      }
      if (ownerBookingsRes.success) setOwnerBookings(ownerBookingsRes.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBookingMessages = async (bookingId: string) => {
    try {
      const response = await messageService.getConversation(ownerId, bookingId);
      if (response.success) {
        setBookingMessages(response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  // Profile Actions
  const handleProfileUpdate = async () => {
    try {
      // TODO: Implement actual profile update API call
      // For now, just show success toast
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      setIsEditingProfile(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive'
      });
    }
  };

  // Machinery Actions
  const handleDeleteMachinery = (id: string, name: string) => {
    setDeleteDialog({ open: true, id, name });
  };

  const confirmDeleteMachinery = async () => {
    try {
      const response = await machineryService.deleteMachinery(deleteDialog.id);
      if (response.success) {
        toast({
          title: 'Success',
          description: `${deleteDialog.name} has been deleted`
        });
        fetchUserData();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete machinery',
        variant: 'destructive'
      });
    }
    setDeleteDialog({ open: false, id: '', name: '' });
  };

  const handleEditMachinery = (machineryId: string) => {
    // Navigate to edit page - using window.location for now
    window.location.href = `/machinery/edit/${machineryId}`;
  };

  // Booking Actions
  const handleSelectBooking = async (booking: BookingSchema) => {
    setSelectedBooking(booking);
    await fetchBookingMessages(booking._id || '');
  };

  const getFilteredBookings = () => {
    if (bookingFilter === 'all') {
      return userBookings;
    }
    return userBookings.filter(b => b.status === bookingFilter);
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedBooking) return;

    try {
      await messageService.sendMessage({
        senderId: ownerId,
        senderName: user?.name || 'User',
        receiverId: selectedBooking.renterId === ownerId ? selectedBooking.ownerId : selectedBooking.renterId,
        receiverName: selectedBooking.renterId === ownerId ? selectedBooking.ownerName : selectedBooking.renterName,
        content: messageText,
        relatedBookingId: selectedBooking._id,
        messageType: 'text'
      });
      setMessageText('');
      await fetchBookingMessages(selectedBooking._id || '');
      toast({ title: 'Message sent', description: 'Your message has been sent' });
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    }
  };

  const handleApproveBooking = async (bookingId: string) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, 'confirmed');
      if (response.success) {
        toast({ title: 'Success', description: 'Booking approved' });
        fetchUserData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to approve booking', variant: 'destructive' });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const response = await bookingService.updateBookingStatus(bookingId, 'cancelled');
      if (response.success) {
        toast({ title: 'Success', description: 'Booking rejected' });
        fetchUserData();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to reject booking', variant: 'destructive' });
    }
  };

  // API Key Management
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      geminiAI.updateAPIKey(apiKey.trim());
      toast({ title: 'Success', description: 'Gemini API key saved' });
      setApiKey('');
      setShowApiKey(false);
    }
  };

  const handleSaveGroqApiKey = () => {
    if (groqApiKey.trim()) {
      groqAI.updateAPIKey(groqApiKey.trim());
      toast({ title: 'Success', description: 'Groq API key saved' });
      setGroqApiKey('');
      setShowGroqApiKey(false);
    }
  };

  const handleSaveModelConfig = () => {
    saveModelConfig(modelConfig);
    toast({ title: 'Success', description: 'Model settings saved' });
  };

  const getCurrentApiKey = () => {
    const saved = localStorage.getItem('gemini_api_key');
    return saved ? `${saved.substring(0, 8)}...${saved.substring(saved.length - 4)}` : 'Not configured';
  };

  const getCurrentGroqApiKey = () => {
    const saved = localStorage.getItem('groq_api_key');
    return saved ? `${saved.substring(0, 8)}...${saved.substring(saved.length - 4)}` : 'Not configured';
  };

  const handleLogout = () => {
    logout();
    toast({ title: 'Logged out', description: 'You have been logged out' });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Login Required</CardTitle>
            <CardDescription>Please log in to access your profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg" onClick={() => window.location.href = '/'}>
              <User className="w-4 h-4 mr-2" />
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">My Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage your profile, bookings, and machinery</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="w-full md:w-auto">
            Logout
          </Button>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="flex flex-wrap w-full gap-2 mb-6 h-auto bg-transparent p-0 border-b">
            <TabsTrigger value="overview" className="text-xs md:text-sm px-3 py-2">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs md:text-sm px-3 py-2">Profile</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs md:text-sm px-3 py-2">My Bookings</TabsTrigger>
            <TabsTrigger value="machinery" className="text-xs md:text-sm px-3 py-2">My Machinery</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs md:text-sm px-3 py-2">Owner Panel</TabsTrigger>
            <TabsTrigger value="settings" className="text-xs md:text-sm px-3 py-2">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab - Clean Implementation Only */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* User Card */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{user.name}</CardTitle>
                      <CardDescription className="text-sm">{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{user.location || 'Not set'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{user.phone || 'Not set'}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mt-2"
                    onClick={() => {
                      setEditFormData({
                        name: user.name || '',
                        phone: user.phone || '',
                        location: user.location || '',
                        language: user.language || 'hindi',
                        farmSize: user.farmSize || 0,
                        crops: (user.crops || []).join(', ')
                      });
                      setIsEditingProfile(true);
                    }}
                  >
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>

              {/* Farm Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Farm Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Farm Size</div>
                    <div className="text-2xl font-bold">{user.farmSize} acres</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Crops Growing</div>
                    <div className="flex flex-wrap gap-2">
                      {user.crops && user.crops.length > 0 ? (
                        user.crops.map((crop, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {crop}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No crops added</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Preferred Language</div>
                    <Badge variant="outline" className="capitalize">{user.language}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Bookings Made</span>
                    <span className="text-2xl font-bold">{userBookings.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Equipment Owned</span>
                    <span className="text-2xl font-bold">{machinery.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Booking Requests</span>
                    <span className="text-2xl font-bold">{ownerBookings.filter(b => b.status === 'pending').length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Tab - Editable */}
          <TabsContent value="profile" className="space-y-6">
            {isEditingProfile ? (
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription>Update your personal and farm information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={editFormData.phone}
                        onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                        placeholder="Your phone number"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location/City</Label>
                      <Input
                        id="location"
                        value={editFormData.location}
                        onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                        placeholder="Your city/district"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Preferred Language</Label>
                      <Select value={editFormData.language} onValueChange={(value) => setEditFormData({ ...editFormData, language: value })}>
                        <SelectTrigger id="language">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hindi">Hindi</SelectItem>
                          <SelectItem value="marathi">Marathi</SelectItem>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="malayalam">Malayalam</SelectItem>
                          <SelectItem value="punjabi">Punjabi</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="farmSize">Farm Size (acres)</Label>
                      <Input
                        id="farmSize"
                        type="number"
                        value={editFormData.farmSize}
                        onChange={(e) => setEditFormData({ ...editFormData, farmSize: parseInt(e.target.value) || 0 })}
                        placeholder="Farm size in acres"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="crops">Crops (comma separated)</Label>
                      <Input
                        id="crops"
                        value={editFormData.crops}
                        onChange={(e) => setEditFormData({ ...editFormData, crops: e.target.value })}
                        placeholder="e.g., Wheat, Rice, Cotton"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t">
                    <Button onClick={handleProfileUpdate} className="gap-2">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditingProfile(false)}
                      className="gap-2"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader className="flex flex-row items-start justify-between pb-4">
                  <div className="space-y-1">
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your current profile details</CardDescription>
                  </div>
                  <Button 
                    size="sm"
                    onClick={() => {
                      setEditFormData({
                        name: user.name || '',
                        phone: user.phone || '',
                        location: user.location || '',
                        language: user.language || 'hindi',
                        farmSize: user.farmSize || 0,
                        crops: (user.crops || []).join(', ')
                      });
                      setIsEditingProfile(true);
                    }}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Full Name</div>
                      <div className="text-base font-medium">{user.name}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Email</div>
                      <div className="text-base font-medium">{user.email}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Phone</div>
                      <div className="text-base font-medium">{user.phone || 'Not set'}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Location</div>
                      <div className="text-base font-medium">{user.location || 'Not set'}</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Farm Size</div>
                      <div className="text-base font-medium">{user.farmSize} acres</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-xs font-medium text-muted-foreground uppercase">Preferred Language</div>
                      <div className="text-base font-medium capitalize">{user.language}</div>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t">
                    <div className="text-xs font-medium text-muted-foreground uppercase">Crops Growing</div>
                    <div className="flex flex-wrap gap-2">
                      {user.crops && user.crops.length > 0 ? (
                        user.crops.map((crop, idx) => (
                          <Badge key={idx} variant="secondary">{crop}</Badge>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">No crops added</span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* My Bookings Tab - NEW */}
          <TabsContent value="bookings" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-6">My Bookings</h2>
              
              {/* Filter Tabs */}
              <Tabs value={bookingFilter} onValueChange={setBookingFilter} className="mb-6">
                <TabsList className="flex flex-wrap gap-2 bg-transparent h-auto p-0">
                  <TabsTrigger 
                    value="all"
                    className="px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending"
                    className="px-4 py-2 rounded-full data-[state=active]:bg-yellow-500 data-[state=active]:text-white"
                  >
                    Pending
                  </TabsTrigger>
                  <TabsTrigger 
                    value="confirmed"
                    className="px-4 py-2 rounded-full data-[state=active]:bg-green-500 data-[state=active]:text-white"
                  >
                    Confirmed
                  </TabsTrigger>
                  <TabsTrigger 
                    value="in-progress"
                    className="px-4 py-2 rounded-full data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                  >
                    In Progress
                  </TabsTrigger>
                  <TabsTrigger 
                    value="completed"
                    className="px-4 py-2 rounded-full data-[state=active]:bg-gray-500 data-[state=active]:text-white"
                  >
                    Completed
                  </TabsTrigger>
                  <TabsTrigger 
                    value="cancelled"
                    className="px-4 py-2 rounded-full data-[state=active]:bg-red-500 data-[state=active]:text-white"
                  >
                    Cancelled
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : getFilteredBookings().length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No Bookings Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    {bookingFilter === 'all' 
                      ? "You haven't made any machinery bookings yet"
                      : `No ${bookingFilter} bookings found`}
                  </p>
                  {bookingFilter === 'all' && (
                    <Button onClick={() => window.location.href = '/machinery'}>
                      <Plus className="w-4 h-4 mr-2" />
                      Browse Machinery
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Bookings List */}
                <div className="lg:col-span-2 space-y-4">
                  {getFilteredBookings().map((booking) => (
                    <Card 
                      key={booking._id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleSelectBooking(booking)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{booking.machineryName}</h3>
                            <p className="text-sm text-muted-foreground">Owner: {booking.ownerName}</p>
                            <div className="flex flex-wrap gap-4 mt-3 text-sm">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <IndianRupee className="w-4 h-4" />
                                <span>₹{booking.finalAmount}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={
                              booking.status === 'confirmed' ? 'default' :
                              booking.status === 'pending' ? 'secondary' :
                              booking.status === 'completed' ? 'outline' : 'destructive'
                            }>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                              {booking.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Booking Details & Messages */}
                {selectedBooking && (
                  <div className="lg:col-span-1 space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Booking Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Booking Number</div>
                          <div className="font-mono text-sm">{selectedBooking.bookingNumber}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Status</div>
                          <Badge className="mt-1">{selectedBooking.status}</Badge>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Total Amount</div>
                          <div className="text-xl font-bold">₹{selectedBooking.finalAmount}</div>
                        </div>
                        <div className="pt-2">
                          <div className="text-xs text-muted-foreground mb-2">Owner Contact</div>
                          <Button variant="outline" size="sm" className="w-full">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Message Owner
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Messages Section */}
                    <Card className="flex flex-col h-80">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Messages
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-1 overflow-y-auto space-y-3">
                        {bookingMessages.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-4">No messages yet</p>
                        ) : (
                          bookingMessages.map((msg) => (
                            <div 
                              key={msg._id} 
                              className={`p-3 rounded-lg text-sm ${
                                msg.senderId === ownerId 
                                  ? 'bg-primary/10 ml-auto max-w-xs'
                                  : 'bg-secondary/50 mr-auto max-w-xs'
                              }`}
                            >
                              <div className="text-xs text-muted-foreground font-medium mb-1">{msg.senderName}</div>
                              <div>{msg.content}</div>
                              <div className="text-xs text-muted-foreground mt-1">
                                {new Date(msg.createdAt).toLocaleTimeString()}
                              </div>
                            </div>
                          ))
                        )}
                      </CardContent>
                      <div className="p-3 border-t space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Type message..."
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            className="text-sm"
                          />
                          <Button 
                            size="sm"
                            onClick={handleSendMessage}
                            disabled={!messageText.trim()}
                          >
                            Send
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* My Machinery Tab */}
          <TabsContent value="machinery" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">My Machinery</h2>
                    <p className="text-muted-foreground">Manage your equipment listings</p>
                  </div>
                  <Button onClick={() => window.location.href = '/machinery/add'}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Machinery
                  </Button>
                </div>

                {machinery.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No Machinery Listed</h3>
                      <p className="text-muted-foreground mb-6">Start earning by listing your equipment</p>
                      <Button onClick={() => window.location.href = '/machinery/add'}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Your First Equipment
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {machinery.map((item) => (
                      <Card key={item._id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.type}</p>
                              <div className="flex flex-wrap gap-4 mt-3 text-sm">
                                <div className="flex items-center gap-1">
                                  <IndianRupee className="w-4 h-4" />
                                  <span>{item.pricePerDay}/day</span>
                                </div>
                                <Badge variant={item.available ? 'default' : 'secondary'}>
                                  {item.available ? 'Available' : 'Unavailable'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap md:flex-nowrap">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleEditMachinery(item._id!)}
                              >
                                <Edit2 className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeleteMachinery(item._id!, item.name)}
                              >
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Owner Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div>
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Equipment Listed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{machinery.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{ownerBookings.length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{ownerBookings.filter(b => b.status === 'pending').length}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">₹{ownerBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.finalAmount, 0).toLocaleString()}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Booking Requests */}
                <h3 className="text-xl font-bold mb-4">Booking Requests</h3>
                {ownerBookings.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">No booking requests yet</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {ownerBookings.map((booking) => (
                      <Card key={booking._id} className="overflow-hidden">
                        <CardContent className="p-6 space-y-4">
                          {/* Header Row - Machinery & Status */}
                          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-4 border-b">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold">{booking.machineryName}</h3>
                              <p className="text-sm text-muted-foreground">{booking.machineryType}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={booking.status === 'pending' ? 'secondary' : 'default'}>
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </div>
                          </div>

                          {/* Renter Information */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Renter Name</div>
                              <div className="font-medium">{booking.renterName}</div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Phone Number</div>
                              <div className="font-medium flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary" />
                                {booking.renterPhone || 'Not provided'}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Email</div>
                              <div className="font-medium flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary" />
                                {booking.renterEmail || 'Not provided'}
                              </div>
                            </div>
                            <div>
                              <div className="text-xs font-medium text-muted-foreground uppercase mb-1">Total Amount</div>
                              <div className="text-lg font-bold text-primary">₹{booking.finalAmount.toLocaleString()}</div>
                            </div>
                          </div>

                          {/* Booking Dates */}
                          <div className="bg-secondary/50 rounded-lg p-3">
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                <span>
                                  {new Date(booking.startDate).toLocaleDateString()} → {new Date(booking.endDate).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                                <span>{booking.totalDays} day(s)</span>
                              </div>
                            </div>
                          </div>

                          {/* Special Requirements / Message */}
                          {(booking.specialRequirements || booking.purpose) && (
                            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                              <div className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase mb-2 flex items-center gap-2">
                                <MessageSquare className="w-4 h-4" />
                                Message / Requirements
                              </div>
                              <p className="text-sm text-blue-900 dark:text-blue-100">
                                {booking.specialRequirements || booking.purpose || 'No special requirements'}
                              </p>
                            </div>
                          )}

                          {/* Delivery Information */}
                          {booking.deliveryRequired && (
                            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                              <div className="text-xs font-medium text-amber-700 dark:text-amber-300 uppercase mb-2 flex items-center gap-2">
                                <Package className="w-4 h-4" />
                                Delivery Required
                              </div>
                              <p className="text-sm text-amber-900 dark:text-amber-100">
                                {booking.deliveryAddress || 'Address not specified'}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="pt-4 border-t flex flex-col md:flex-row gap-3">
                            {booking.status === 'pending' && (
                              <>
                                <Button 
                                  className="flex-1 gap-2"
                                  onClick={() => handleApproveBooking(booking._id!)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Approve Booking
                                </Button>
                                <Button 
                                  className="flex-1 gap-2"
                                  variant="outline"
                                  onClick={() => handleRejectBooking(booking._id!)}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Reject Booking
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <Button variant="outline" className="w-full gap-2" disabled>
                                <CheckCircle className="w-4 h-4" />
                                Booking Confirmed
                              </Button>
                            )}
                            {booking.status === 'rejected' && (
                              <Button variant="outline" className="w-full gap-2" disabled>
                                <XCircle className="w-4 h-4" />
                                Booking Rejected
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            {/* API Keys */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  AI Model API Keys
                </CardTitle>
                <CardDescription>Configure your preferred AI providers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Gemini API Key */}
                <div className="space-y-3 pb-4 border-b">
                  <h3 className="font-medium">Google Gemini API Key</h3>
                  {showApiKey ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter Gemini API key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        type="password"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveApiKey}>Save</Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setShowApiKey(false);
                            setApiKey('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {getCurrentApiKey()}
                    </div>
                  )}
                  {!showApiKey && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowApiKey(true)}
                    >
                      Add/Change Key
                    </Button>
                  )}
                </div>

                {/* Groq API Key */}
                <div className="space-y-3">
                  <h3 className="font-medium">Groq API Key</h3>
                  {showGroqApiKey ? (
                    <div className="space-y-3">
                      <Input
                        placeholder="Enter Groq API key"
                        value={groqApiKey}
                        onChange={(e) => setGroqApiKey(e.target.value)}
                        type="password"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleSaveGroqApiKey}>Save</Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setShowGroqApiKey(false);
                            setGroqApiKey('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {getCurrentGroqApiKey()}
                    </div>
                  )}
                  {!showGroqApiKey && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setShowGroqApiKey(true)}
                    >
                      Add/Change Key
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Model Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  AI Model Selection
                </CardTitle>
                <CardDescription>Choose which AI model to use</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="disease-model" className="mb-2 block">Disease Detection Model</Label>
                  <Select
                    value={modelConfig.diseaseDetection}
                    onValueChange={(value) => setModelConfig({ ...modelConfig, diseaseDetection: value as 'gemini' | 'groq' })}
                  >
                    <SelectTrigger id="disease-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">Google Gemini (Fast & Accurate)</SelectItem>
                      <SelectItem value="groq">Groq Llama (Ultra-fast)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveModelConfig} className="w-full md:w-auto">
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => !open && setDeleteDialog({ open: false, id: '', name: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Machinery</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deleteDialog.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline"
              onClick={() => setDeleteDialog({ open: false, id: '', name: '' })}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={confirmDeleteMachinery}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
