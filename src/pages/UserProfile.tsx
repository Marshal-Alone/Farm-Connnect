import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, MapPin, Phone, Mail, Globe, Sprout, TrendingUp, Calendar, Bell, Settings, Key, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { geminiAI } from '@/lib/gemini';

export default function UserProfile() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
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
    { id: 1, type: 'disease-check', description: 'Checked tomato leaf disease', date: '2024-01-15', result: 'Early Blight detected' },
    { id: 2, type: 'machinery-booking', description: 'Booked John Deere tractor', date: '2024-01-13', result: 'Booking confirmed' },
    { id: 3, type: 'scheme-application', description: 'Applied for PM-KISAN scheme', date: '2024-01-12', result: 'Application submitted' }
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
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
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        notification.priority === 'high' ? 'bg-red-500' : 
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
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="language">Preferred Language</Label>
                    <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})} disabled={!isEditing}>
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
                      onChange={(e) => setFormData({...formData, farmSize: Number(e.target.value)})}
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

          {/* Settings Tab */}
          <TabsContent value="settings">
            <div className="space-y-6">
              {/* API Key Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Key className="h-5 w-5 mr-2" />
                    AI Analysis API Key
                  </CardTitle>
                  <CardDescription>
                    Use your own Gemini API key for unlimited AI analysis or rely on our default key
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Current API Key Status</Label>
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
                        <Button variant="outline" onClick={() => {setShowApiKey(false); setApiKey('');}}>
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
      </div>
    </div>
  );
}