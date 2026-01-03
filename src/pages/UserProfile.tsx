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
import { User, MapPin, Phone, Mail, Globe, Sprout, Calendar, Settings, Key, Trash2, IndianRupee, Package, CheckCircle, Clock, XCircle, Loader2, Plus, MessageSquare, Edit2, Save, X, BarChart3 } from 'lucide-react';
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
  const [messageText, setMessageText] = useState('');

  // Messaging Unified State
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const [conversationMessages, setConversationMessages] = useState<MessageSchema[]>([]);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

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
      fetchConversations();
    }
  }, [user]);

  const fetchConversations = async () => {
    if (!ownerId) return;
    setIsMessagesLoading(true);
    try {
      const response = await messageService.getUserConversations(ownerId);
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const handleSelectConversation = async (conversation: any) => {
    setSelectedConversation(conversation);
    setIsMessagesLoading(true);
    try {
      // Find the other participant's ID
      const otherParticipant = conversation.participants.find((p: any) => p.userId !== ownerId);
      if (otherParticipant) {
        const response = await messageService.getConversation(ownerId, otherParticipant.userId);
        if (response.success) {
          setConversationMessages(response.data);

          // Mark all as read if there are unread messages
          if (conversation.unreadCount > 0) {
            await messageService.markAllAsRead(conversation.conversationId, ownerId);
            // Update local unread count
            setConversations(conversations.map(c =>
              c.conversationId === conversation.conversationId
                ? { ...c, unreadCount: 0 }
                : c
            ));
          }
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsMessagesLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedConversation || !user) return;

    const otherParticipant = selectedConversation.participants.find((p: any) => p.userId !== ownerId);
    if (!otherParticipant) return;

    try {
      const response = await messageService.sendMessage({
        senderId: ownerId,
        senderName: user.name || 'User',
        receiverId: otherParticipant.userId,
        receiverName: otherParticipant.userName,
        content: messageText,
      });

      if (response.success) {
        setConversationMessages([...conversationMessages, response.data]);
        setMessageText('');

        // If it was a temp conversation, refresh the whole list to get real IDs
        if (selectedConversation.conversationId === 'temp') {
          fetchConversations();
        } else {
          // Update last message in list
          setConversations(conversations.map(c =>
            c.conversationId === selectedConversation.conversationId
              ? { ...c, lastMessage: response.data }
              : c
          ));
        }
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to send message', variant: 'destructive' });
    }
  };

  // Deep link to message if query param exists
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const otherId = params.get('otherId');

    if (tab === 'messages') {
      setActiveTab('messages');
      if (otherId && conversations.length > 0) {
        const conv = conversations.find(c => c.participants.some((p: any) => p.userId === otherId));
        if (conv) {
          handleSelectConversation(conv);
        }
      }
    }
  }, [conversations.length]); // Only run once conversations are loaded

  // Instant messaging poll
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (activeTab === 'messages') {
      // Refresh conversation list for new unread messages
      fetchConversations();

      interval = setInterval(() => {
        // Refresh conversation list
        fetchConversations();

        // If a conversation is selected, refresh its messages too
        if (selectedConversation) {
          const otherParticipant = selectedConversation.participants.find((p: any) => p.userId !== ownerId);
          if (otherParticipant && selectedConversation.conversationId !== 'temp') {
            messageService.getConversation(ownerId, otherParticipant.userId).then(res => {
              if (res.success) {
                // Only update if message count changed to avoid UI flickering
                setConversationMessages(prev => {
                  if (prev.length !== res.data.length) return res.data;
                  return prev;
                });
              }
            });
          }
        }
      }, 3000); // 3-second poll
    }

    return () => clearInterval(interval);
  }, [activeTab, selectedConversation?.conversationId]);

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
    const otherUserId = booking.renterId === ownerId ? booking.ownerId : booking.renterId;

    // Switch to messages tab
    setActiveTab('messages');

    // Try to find existing conversation
    const existingConversation = conversations.find(c =>
      c.participants.some((p: any) => p.userId === otherUserId)
    );

    if (existingConversation) {
      handleSelectConversation(existingConversation);
    } else {
      // If no conversation exists, we'll need to fetch it or wait for the list to update
      // For now, let's just fetch messages directly with that user
      setIsMessagesLoading(true);
      try {
        const response = await messageService.getConversation(ownerId, otherUserId);
        if (response.success) {
          setConversationMessages(response.data);
          // Create a "virtual" selected conversation for the UI
          setSelectedConversation({
            conversationId: 'temp',
            participants: [
              { userId: ownerId, userName: user?.name },
              { userId: otherUserId, userName: booking.renterId === ownerId ? booking.ownerName : booking.renterName }
            ]
          });
        }
      } catch (error) {
        console.error('Error selecting booking conversation:', error);
      } finally {
        setIsMessagesLoading(false);
      }
    }
  };

  const getFilteredBookings = () => {
    if (bookingFilter === 'all') {
      return userBookings;
    }
    return userBookings.filter(b => b.status === bookingFilter);
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap w-full gap-2 mb-6 h-auto bg-transparent p-0 border-b">
            <TabsTrigger value="overview" className="text-xs md:text-sm px-3 py-2">Overview</TabsTrigger>
            <TabsTrigger value="profile" className="text-xs md:text-sm px-3 py-2">Profile</TabsTrigger>
            <TabsTrigger value="bookings" className="text-xs md:text-sm px-3 py-2">My Bookings</TabsTrigger>
            <TabsTrigger value="machinery" className="text-xs md:text-sm px-3 py-2">My Machinery</TabsTrigger>
            <TabsTrigger value="dashboard" className="text-xs md:text-sm px-3 py-2">Owner Panel</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs md:text-sm px-3 py-2 flex items-center gap-1">
              Messages
              {conversations.some(c => c.unreadCount > 0) && (
                <Badge variant="destructive" className="h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  {conversations.filter(c => c.unreadCount > 0).length}
                </Badge>
              )}
            </TabsTrigger>
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
              <>
                <div className="space-y-4">
                  {getFilteredBookings().map((booking) => (
                    <Card
                      key={booking._id}
                      className="overflow-hidden hover:shadow-lg transition-all duration-200 border-l-4"
                      style={{
                        borderLeftColor: booking.status === 'confirmed' ? '#22c55e' :
                          booking.status === 'pending' ? '#eab308' :
                            booking.status === 'in-progress' ? '#3b82f6' :
                              booking.status === 'completed' ? '#6b7280' :
                                booking.status === 'cancelled' ? '#ef4444' : '#6b7280'
                      }}
                    >
                      {/* Card Header with Machinery Info */}
                      <CardHeader className="bg-secondary/30 pb-3">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <CardTitle className="text-xl">{booking.machineryName}</CardTitle>
                              <Badge variant="outline" className="text-xs">
                                {booking.machineryType}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">
                              Booking #{booking.bookingNumber}
                            </p>
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className={
                              booking.status === 'confirmed' ? 'bg-green-500 text-white' :
                                booking.status === 'pending' ? 'bg-yellow-500 text-white' :
                                  booking.status === 'in-progress' ? 'bg-blue-500 text-white' :
                                    booking.status === 'completed' ? 'bg-gray-500 text-white' :
                                      'bg-red-500 text-white'
                            }>
                              {booking.status === 'in-progress' ? 'In Progress' :
                                booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </Badge>
                            <Badge variant={booking.paymentStatus === 'paid' ? 'default' : 'secondary'}>
                              {booking.paymentStatus === 'paid' ? '✓ Paid' :
                                booking.paymentStatus === 'partial' ? 'Partial' : 'Payment Pending'}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pt-4">
                        {/* Main Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          {/* Rental Period */}
                          <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                            <Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium uppercase">Rental Period</p>
                              <p className="font-semibold text-sm">
                                {new Date(booking.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - {new Date(booking.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                              <p className="text-xs text-muted-foreground">{booking.totalDays} day{booking.totalDays > 1 ? 's' : ''}</p>
                            </div>
                          </div>

                          {/* Amount */}
                          <div className="flex items-start gap-3 p-3 bg-green-500/10 rounded-lg">
                            <IndianRupee className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium uppercase">Total Amount</p>
                              <p className="font-bold text-lg text-green-600">₹{booking.finalAmount.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-muted-foreground">
                                ₹{booking.pricePerDay}/day
                              </p>
                            </div>
                          </div>

                          {/* Owner */}
                          <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                            <User className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium uppercase">Owner</p>
                              <p className="font-semibold text-sm">{booking.ownerName}</p>
                              <Button
                                variant="link"
                                size="sm"
                                className="h-auto p-0 text-xs text-primary"
                                onClick={(e) => { e.stopPropagation(); handleSelectBooking(booking); }}
                              >
                                <MessageSquare className="w-3 h-3 mr-1" />
                                Message
                              </Button>
                            </div>
                          </div>

                          {/* Booked On */}
                          <div className="flex items-start gap-3 p-3 bg-secondary/20 rounded-lg">
                            <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-xs text-muted-foreground font-medium uppercase">Booked On</p>
                              <p className="font-semibold text-sm">
                                {new Date(booking.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(booking.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Payment Breakdown */}
                        {(booking.deliveryCharge > 0 || booking.securityDeposit > 0 || booking.discount > 0) && (
                          <div className="mb-4 p-3 bg-secondary/10 rounded-lg border">
                            <p className="text-xs text-muted-foreground font-medium uppercase mb-2">Payment Breakdown</p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                              <div>
                                <span className="text-muted-foreground">Base:</span>
                                <span className="ml-1 font-medium">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                              </div>
                              {booking.deliveryCharge > 0 && (
                                <div>
                                  <span className="text-muted-foreground">Delivery:</span>
                                  <span className="ml-1 font-medium">₹{booking.deliveryCharge.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {booking.securityDeposit > 0 && (
                                <div>
                                  <span className="text-muted-foreground">Deposit:</span>
                                  <span className="ml-1 font-medium">₹{booking.securityDeposit.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              {booking.discount > 0 && (
                                <div>
                                  <span className="text-muted-foreground">Discount:</span>
                                  <span className="ml-1 font-medium text-green-600">-₹{booking.discount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Purpose */}
                        {booking.purpose && (
                          <div className="mb-4 p-3 bg-blue-500/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Purpose</p>
                            <p className="text-sm">{booking.purpose}</p>
                          </div>
                        )}

                        {/* Special Requirements */}
                        {booking.specialRequirements && (
                          <div className="mb-4 p-3 bg-amber-500/10 rounded-lg">
                            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Special Requirements</p>
                            <p className="text-sm">{booking.specialRequirements}</p>
                          </div>
                        )}

                        {/* Delivery Address */}
                        {booking.deliveryRequired && booking.deliveryAddress && (
                          <div className="mb-4 p-3 bg-secondary/20 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <MapPin className="w-4 h-4 text-primary" />
                              <p className="text-xs text-muted-foreground font-medium uppercase">Delivery Address</p>
                            </div>
                            <p className="text-sm">{booking.deliveryAddress}</p>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2 pt-3 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); window.location.href = `/machinery/${booking.machineryId}`; }}
                          >
                            <Package className="w-4 h-4 mr-1" />
                            View Machinery
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); handleSelectBooking(booking); }}
                          >
                            <MessageSquare className="w-4 h-4 mr-1" />
                            Messages
                          </Button>

                          {(booking.status === 'pending' || booking.status === 'confirmed') && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (confirm('Are you sure you want to cancel this booking?')) {
                                  try {
                                    const response = await bookingService.cancelBooking(
                                      booking._id!,
                                      'Cancelled by user',
                                      'renter'
                                    );
                                    if (response.success) {
                                      toast({ title: 'Success', description: 'Booking cancelled successfully' });
                                      fetchUserData();
                                    }
                                  } catch (error) {
                                    toast({ title: 'Error', description: 'Failed to cancel booking', variant: 'destructive' });
                                  }
                                }
                              }}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Cancel Booking
                            </Button>
                          )}


                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
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
                {/* Header with Dashboard Link */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">Owner Panel</h2>
                    <p className="text-muted-foreground text-sm">Manage your machinery and booking requests</p>
                  </div>
                  <Button
                    className="gap-2 bg-primary hover:bg-primary/90"
                    onClick={() => window.location.href = '/owner/dashboard'}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Open Full Dashboard
                  </Button>
                </div>

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
                            <Button
                              variant="outline"
                              className="flex-1 gap-2 border-primary text-primary hover:bg-primary/5"
                              onClick={() => handleSelectBooking(booking)}
                            >
                              <MessageSquare className="w-4 h-4" />
                              {booking.status === 'pending' ? 'Message Renter' : 'Chat'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Unified Messaging Tab */}
          <TabsContent value="messages" className="space-y-0 h-[600px] border rounded-xl overflow-hidden bg-card shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
              {/* Conversations List */}
              <div className={`md:col-span-4 border-r bg-muted/20 flex flex-col h-full ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-4 border-b bg-card">
                  <h3 className="font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Messages
                  </h3>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {conversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full p-8 text-center text-muted-foreground">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                        <MessageSquare className="w-6 h-6" />
                      </div>
                      <p className="font-medium">No conversations yet</p>
                      <p className="text-xs">Your chats with owners and renters will appear here</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {conversations.map((conversation) => {
                        const otherParticipant = conversation.participants.find((p: any) => p.userId !== ownerId);
                        const isSelected = selectedConversation?.conversationId === conversation.conversationId;
                        return (
                          <button
                            key={conversation.conversationId}
                            onClick={() => handleSelectConversation(conversation)}
                            className={`w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left ${isSelected ? 'bg-primary/5 border-l-2 border-primary' : ''}`}
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                              {(otherParticipant?.userName || 'U').charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <p className="font-semibold text-sm truncate">{otherParticipant?.userName || 'Unknown User'}</p>
                                <p className="text-[10px] text-muted-foreground">
                                  {conversation.lastMessage ? new Date(conversation.lastMessage.createdAt).toLocaleDateString() : ''}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.lastMessage?.content || 'Started a conversation'}
                              </p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Window */}
              <div className={`md:col-span-8 flex flex-col h-full bg-card ${!selectedConversation ? 'hidden md:flex' : 'flex'}`}>
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="md:hidden"
                          onClick={() => setSelectedConversation(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                          {(selectedConversation.participants.find((p: any) => p.userId !== ownerId)?.userName || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">
                            {selectedConversation.participants.find((p: any) => p.userId !== ownerId)?.userName}
                          </p>
                          <p className="text-[10px] text-green-500 font-medium">Online</p>
                        </div>
                      </div>
                    </div>

                    {/* Messages Body */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/5">
                      {isMessagesLoading && conversationMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        </div>
                      ) : (
                        conversationMessages.map((msg, idx) => {
                          const isMe = msg.senderId === ownerId;
                          return (
                            <div key={msg._id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                ? 'bg-primary text-primary-foreground rounded-tr-none'
                                : 'bg-secondary text-secondary-foreground rounded-tl-none'
                                }`}>
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right opacity-70`}>
                                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Chat Input */}
                    <div className="p-4 border-t">
                      <form
                        className="flex gap-2"
                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                      >
                        <Input
                          placeholder="Type your message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={!messageText.trim()}>
                          <Plus className="w-4 h-4 rotate-45 scale-125" />
                        </Button>
                      </form>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-12 text-muted-foreground">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <MessageSquare className="w-8 h-8 opacity-20" />
                    </div>
                    <h4 className="font-semibold text-foreground">AgriSmart Messaging</h4>
                    <p className="max-w-xs text-sm mt-1">Select a conversation to view history and send messages.</p>
                  </div>
                )}
              </div>
            </div>
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
    </div >
  );
}
