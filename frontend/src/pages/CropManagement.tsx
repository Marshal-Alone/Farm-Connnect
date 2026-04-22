/**
 * Crop Management Page
 * Displays farmer's crops and action logging interface
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, Plus, Leaf } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CropManagement from '@/components/CropManagement';
import CropActionLog from '@/components/CropActionLog';
import SEO from '@/components/SEO';

export default function CropManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('crops');
  const [refreshKey, setRefreshKey] = useState(0);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold">Authentication Required</h3>
                <p className="text-sm text-gray-600 mt-1">Please log in to manage your crops.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCropUpdate = () => {
    // Trigger a refresh of the components
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <SEO
        title="Crop Management | Farm Connect"
        description="Track your crops, log farming actions, and get AI-powered recommendations"
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <Leaf className="text-green-600" size={24} />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Crop Management</h1>
            </div>
            <p className="text-gray-600">Track your crops, log farming actions, and get personalized weather-based recommendations</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="crops">My Crops</TabsTrigger>
              <TabsTrigger value="actions">Action Log</TabsTrigger>
            </TabsList>

            {/* My Crops Tab */}
            <TabsContent value="crops" className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-blue-900">Track Your Crops</h3>
                  <p className="text-sm text-blue-700 mt-1">
                    Add your active crops to receive personalized weather recommendations and track your farming actions.
                  </p>
                </div>
              </div>
              
              <CropManagement key={`crops-${refreshKey}`} />
            </TabsContent>

            {/* Action Log Tab */}
            <TabsContent value="actions" className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="font-semibold text-green-900">Log Your Actions</h3>
                  <p className="text-sm text-green-700 mt-1">
                    Record farming activities like sowing, fertilizing, irrigating, and spraying to track your crop lifecycle.
                  </p>
                </div>
              </div>

              <CropActionLog key={`actions-${refreshKey}`} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Info Section */}
        <div className="bg-white border-t mt-8">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-lg mb-3">Why Track Your Crops?</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Get AI-powered weather recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Track crop lifecycle and growth stages</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Log all farming activities and actions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Receive personalized crop alerts</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3">Supported Actions</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>🌱 Sowing & Planting</li>
                  <li>💧 Irrigation & Watering</li>
                  <li>🧪 Fertilizer Application</li>
                  <li>🌿 Weeding & Mulching</li>
                  <li>🐛 Pest & Disease Management</li>
                  <li>✂️ Pruning & Trimming</li>
                  <li>🚜 Harvesting</li>
                  <li>📝 Custom Notes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
