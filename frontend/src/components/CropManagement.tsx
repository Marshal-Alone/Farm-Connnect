/**
 * Crop Management Component - Add, edit, view farmer's crops
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CropService from '@/lib/api/cropService';
import { FarmerCrop, CROP_TYPES, getCropStage } from '@/lib/schemas/cropSchema';
import {
  Plus,
  Trash2,
  Edit2,
  Leaf,
  Calendar,
  MapPin,
  Zap,
  X
} from 'lucide-react';

export default function CropManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [crops, setCrops] = useState<FarmerCrop[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState<FarmerCrop | null>(null);
  const [formData, setFormData] = useState<Partial<FarmerCrop>>({
    cropName: '',
    variety: '',
    sowDate: '',
    sowingArea: 1,
    status: 'growing',
    fieldLocation: { lat: 0, lon: 0, address: '' },
    notes: ''
  });

  // Load crops on mount
  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    setLoading(true);
    try {
      const response = await CropService.getCrops();
      if (response.success && response.data) {
        setCrops(response.data);
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to load crops',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load crops',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCrop = () => {
    setEditingCrop(null);
    setFormData({
      cropName: '',
      variety: '',
      sowDate: '',
      sowingArea: 1,
      status: 'growing',
      fieldLocation: { lat: 0, lon: 0, address: '' },
      notes: ''
    });
    setShowForm(true);
  };

  const handleEditCrop = (crop: FarmerCrop) => {
    setEditingCrop(crop);
    setFormData(crop);
    setShowForm(true);
  };

  const handleDeleteCrop = async (cropId: string) => {
    if (confirm('Are you sure you want to delete this crop?')) {
      try {
        const response = await CropService.deleteCrop(cropId);
        if (response.success) {
          setCrops(crops.filter(c => c._id !== cropId));
          toast({
            title: 'Success',
            description: 'Crop deleted'
          });
        } else {
          toast({
            title: 'Error',
            description: response.error || 'Failed to delete crop',
            variant: 'destructive'
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete crop',
          variant: 'destructive'
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.cropName || !formData.sowDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      let response;
      if (editingCrop && editingCrop._id) {
        response = await CropService.updateCrop(editingCrop._id, formData);
      } else {
        response = await CropService.createCrop(formData as any);
      }

      if (response.success) {
        toast({
          title: 'Success',
          description: editingCrop ? 'Crop updated' : 'Crop added'
        });
        setShowForm(false);
        loadCrops();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to save crop',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save crop',
        variant: 'destructive'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sowing':
        return 'bg-blue-100 text-blue-800';
      case 'growing':
        return 'bg-green-100 text-green-800';
      case 'mature':
        return 'bg-amber-100 text-amber-800';
      case 'harvested':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="w-6 h-6 text-green-600" />
            My Crops
          </h2>
          <p className="text-muted-foreground">Track your crop lifecycle and actions</p>
        </div>
        <Button
          onClick={handleAddCrop}
          className="bg-green-600 hover:bg-green-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Crop
        </Button>
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Crop Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Crop Type *</label>
                  <select
                    value={formData.cropName || ''}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select crop</option>
                    {CROP_TYPES.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>

                {/* Variety */}
                <div>
                  <label className="block text-sm font-medium mb-2">Variety</label>
                  <input
                    type="text"
                    placeholder="e.g., Basmati, HYV-5"
                    value={formData.variety || ''}
                    onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Sowing Date & Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Sowing Date *</label>
                  <input
                    type="date"
                    value={typeof formData.sowDate === 'string' ? formData.sowDate.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, sowDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Sowing Area (hectares) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.sowingArea || 1}
                    onChange={(e) => setFormData({ ...formData, sowingArea: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Expected Harvest Date */}
              <div>
                <label className="block text-sm font-medium mb-2">Expected Harvest Date</label>
                <input
                  type="date"
                  value={typeof formData.expectedHarvestDate === 'string' ? formData.expectedHarvestDate.split('T')[0] : ''}
                  onChange={(e) => setFormData({ ...formData, expectedHarvestDate: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              {/* Field Location */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.fieldLocation?.lat || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fieldLocation: { ...formData.fieldLocation, lat: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.fieldLocation?.lon || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fieldLocation: { ...formData.fieldLocation, lon: parseFloat(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="Field address"
                    value={formData.fieldLocation?.address || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      fieldLocation: { ...formData.fieldLocation, address: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes</label>
                <textarea
                  placeholder="Additional notes about this crop..."
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  {editingCrop ? 'Update Crop' : 'Add Crop'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Crops List */}
      {loading ? (
        <div className="text-center py-8">Loading crops...</div>
      ) : crops.length === 0 ? (
        <Card className="text-center py-12">
          <Leaf className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No crops added yet</p>
          <Button
            onClick={handleAddCrop}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Crop
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {crops.map((crop) => {
            const stage = getCropStage(crop.sowDate, crop.cropName);
            const daysToHarvest = crop.expectedHarvestDate
              ? Math.ceil((new Date(crop.expectedHarvestDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
              : null;
            const locationText = crop.fieldLocation?.address
              || (crop.fieldLocation?.lat != null && crop.fieldLocation?.lon != null
                ? `${crop.fieldLocation.lat}, ${crop.fieldLocation.lon}`
                : 'Location not provided');

            return (
              <Card key={crop._id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-600" />
                        {crop.cropName} {crop.variety && `(${crop.variety})`}
                      </CardTitle>
                      <Badge className={`mt-2 ${getStatusColor(crop.status)}`}>
                        {crop.status.charAt(0).toUpperCase() + crop.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditCrop(crop)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCrop(crop._id!)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Growth Stage */}
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-600">Current Stage</p>
                    <p className="font-semibold text-blue-900">{stage.stage}</p>
                    <p className="text-xs text-blue-700 mt-1">{stage.daysFromSowing} days from sowing</p>
                  </div>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Sown</p>
                        <p className="font-medium">{new Date(crop.sowDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Area</p>
                        <p className="font-medium">{crop.sowingArea} hectares</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Location</p>
                        <p className="font-medium text-xs truncate">
                          {locationText}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Harvest Info */}
                  {daysToHarvest !== null && (
                    <div className={`p-2 rounded text-xs font-medium ${
                      daysToHarvest > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {daysToHarvest > 0
                        ? `Harvest in ${daysToHarvest} days`
                        : 'Ready to harvest'}
                    </div>
                  )}

                  {/* Notes */}
                  {crop.notes && (
                    <div className="bg-gray-50 p-2 rounded text-xs text-gray-700 italic">
                      "{crop.notes}"
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
