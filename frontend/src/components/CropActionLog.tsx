/**
 * Crop Action Log Component - Log and view farming actions
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import ActionService from '@/lib/api/actionService';
import { cropService } from '@/lib/api/cropService';
import { FarmerCrop, CropAction, ACTION_TYPES } from '@/lib/schemas/cropSchema';
import {
  Plus,
  Trash2,
  Clock,
  AlertCircle,
  X,
  ChevronDown
} from 'lucide-react';

interface CropActionLogProps {
  crop?: FarmerCrop;
  onRefresh?: () => void;
}

export default function CropActionLog({ crop: initialCrop, onRefresh }: CropActionLogProps) {
  const { toast } = useToast();

  const [crops, setCrops] = useState<FarmerCrop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<FarmerCrop | null>(initialCrop || null);
  const [actions, setActions] = useState<CropAction[]>([]);
  const [loading, setLoading] = useState(false);
  const [cropsLoading, setCropsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showCropSelector, setShowCropSelector] = useState(false);
  const [formData, setFormData] = useState({
    actionType: 'monitoring' as const,
    actionDate: new Date().toISOString().split('T')[0],
    details: '',
    quantity: '',
    quantityUnit: ''
  });

  // Load crops on mount
  useEffect(() => {
    loadCrops();
  }, []);

  // Load actions when crop is selected
  useEffect(() => {
    if (selectedCrop?._id) {
      loadActions();
    }
  }, [selectedCrop]);

  const loadCrops = async () => {
    setCropsLoading(true);
    try {
      const response = await cropService.getCrops();
      if (response.success && response.data) {
        setCrops(response.data);
        // Auto-select first crop if not provided
        if (!selectedCrop && response.data.length > 0) {
          setSelectedCrop(response.data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading crops:', error);
      toast({
        title: 'Error',
        description: 'Failed to load crops',
        variant: 'destructive'
      });
    } finally {
      setCropsLoading(false);
    }
  };

  const loadActions = async () => {
    if (!selectedCrop?._id) return;
    setLoading(true);
    try {
      const response = await ActionService.getActions(selectedCrop._id);
      if (response.success && response.data) {
        // Sort by date descending
        setActions(response.data.sort((a, b) => 
          new Date(b.actionDate).getTime() - new Date(a.actionDate).getTime()
        ));
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load actions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (actionType: string) => {
    if (!selectedCrop?._id) return;

    try {
      const response = await ActionService.logAction(selectedCrop._id, {
        actionType: actionType as any,
        actionDate: new Date(),
        details: '',
        quantity: null
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: `${actionType} logged`
        });
        loadActions();
        onRefresh?.();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to log action',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log action',
        variant: 'destructive'
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCrop?._id) return;

    try {
      const response = await ActionService.logAction(selectedCrop._id, {
        actionType: formData.actionType,
        actionDate: new Date(formData.actionDate),
        details: formData.details,
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        quantityUnit: formData.quantityUnit || null
      });

      if (response.success) {
        toast({
          title: 'Success',
          description: 'Action logged'
        });
        setShowForm(false);
        setFormData({
          actionType: 'monitoring',
          actionDate: new Date().toISOString().split('T')[0],
          details: '',
          quantity: '',
          quantityUnit: ''
        });
        loadActions();
        onRefresh?.();
      } else {
        toast({
          title: 'Error',
          description: response.error || 'Failed to log action',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log action',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteAction = async (actionId: string) => {
    if (confirm('Delete this action?')) {
      try {
        const response = await ActionService.deleteAction(actionId);
        if (response.success) {
          setActions(actions.filter(a => a._id !== actionId));
          toast({
            title: 'Success',
            description: 'Action deleted'
          });
          onRefresh?.();
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete action',
          variant: 'destructive'
        });
      }
    }
  };

  const getActionColor = (actionType: string) => {
    const colors: Record<string, string> = {
      'sowing': 'bg-blue-100 text-blue-800 border-blue-300',
      'fertilizing': 'bg-purple-100 text-purple-800 border-purple-300',
      'irrigating': 'bg-cyan-100 text-cyan-800 border-cyan-300',
      'spraying': 'bg-red-100 text-red-800 border-red-300',
      'harvesting': 'bg-amber-100 text-amber-800 border-amber-300',
      'monitoring': 'bg-green-100 text-green-800 border-green-300',
      'other': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[actionType] || colors['other'];
  };

  return (
    <div className="space-y-4">
      {/* Crop Selector */}
      <div className="relative">
        <button
          onClick={() => setShowCropSelector(!showCropSelector)}
          className="w-full px-4 py-2 border rounded-lg flex items-center justify-between hover:bg-gray-50 transition-colors"
        >
          <span className="font-medium">
            {selectedCrop ? (
              <span>
                <span className="text-gray-600">Crop: </span>
                <span className="text-green-700 font-semibold">{selectedCrop.cropName}</span>
              </span>
            ) : (
              <span className="text-gray-500">Select a crop</span>
            )}
          </span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showCropSelector ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showCropSelector && (
          <div className="absolute top-full left-0 right-0 mt-1 border rounded-lg bg-white shadow-lg z-10">
            {cropsLoading ? (
              <div className="p-3 text-sm text-gray-500">Loading crops...</div>
            ) : crops.length === 0 ? (
              <div className="p-3 text-sm text-gray-500">No crops yet. Create one in the "My Crops" tab.</div>
            ) : (
              <div className="max-h-48 overflow-y-auto">
                {crops.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => {
                      setSelectedCrop(c);
                      setShowCropSelector(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-green-50 transition-colors ${
                      selectedCrop?._id === c._id ? 'bg-green-100 border-l-4 border-green-600' : ''
                    }`}
                  >
                    <span className="font-medium">{c.cropName}</span>
                    <span className="text-xs text-gray-500 ml-2">({c.variety})</span>
                    {selectedCrop?._id === c._id && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {!selectedCrop ? (
        <Card className="text-center py-8 bg-blue-50 border-blue-200">
          <AlertCircle className="w-8 h-8 text-blue-400 mx-auto mb-2" />
          <p className="text-blue-800 text-sm font-medium">Choose a crop above to log actions</p>
        </Card>
      ) : (
        <>
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Action Timeline</h3>
            <Button
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? 'outline' : 'default'}
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Log Action
            </Button>
          </div>

      {/* Quick Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {ACTION_TYPES.filter(a => a.value !== 'other').map(action => (
          <Button
            key={action.value}
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction(action.value)}
            className="text-xs"
          >
            <span className="mr-1">{action.icon}</span>
            {action.label}
          </Button>
        ))}
      </div>

      {/* Detailed Form */}
      {showForm && (
        <Card className="border-2 border-green-300 bg-green-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-base">Log New Action</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Action Type *</label>
                  <select
                    value={formData.actionType}
                    onChange={(e) => setFormData({ ...formData, actionType: e.target.value as any })}
                    className="w-full px-2 py-1.5 border text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {ACTION_TYPES.map(action => (
                      <option key={action.value} value={action.value}>
                        {action.icon} {action.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Date *</label>
                  <input
                    type="date"
                    value={formData.actionDate}
                    onChange={(e) => setFormData({ ...formData, actionDate: e.target.value })}
                    className="w-full px-2 py-1.5 border text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Details</label>
                <textarea
                  placeholder="What did you do? Any observations?"
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-2 py-1.5 border text-sm rounded resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={2}
                />
              </div>

              {['fertilizing', 'irrigating', 'spraying'].includes(formData.actionType) && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">Quantity</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="Amount"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full px-2 py-1.5 border text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Unit</label>
                    <select
                      value={formData.quantityUnit}
                      onChange={(e) => setFormData({ ...formData, quantityUnit: e.target.value })}
                      className="w-full px-2 py-1.5 border text-sm rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Select unit</option>
                      <option value="kg">kg</option>
                      <option value="liters">Liters</option>
                      <option value="ml">ml</option>
                      <option value="bags">Bags</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700">
                  Log Action
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Actions Timeline */}
      {loading ? (
        <div className="text-center py-4 text-sm text-gray-500">Loading actions...</div>
      ) : actions.length === 0 ? (
        <Card className="text-center py-8 bg-gray-50">
          <AlertCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500 text-sm">No actions logged yet for this crop</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {actions.map((action) => (
            <div
              key={action._id}
              className={`p-3 rounded-lg border-l-4 ${getActionColor(action.actionType)} flex items-start justify-between`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold capitalize text-sm">
                    {ACTION_TYPES.find(a => a.value === action.actionType)?.icon}
                    {' '}
                    {action.actionType}
                  </span>
                  <span className="text-xs opacity-75 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(action.actionDate).toLocaleDateString()}
                  </span>
                </div>
                {action.details && (
                  <p className="text-sm opacity-90 mb-1">{action.details}</p>
                )}
                {action.quantity && (
                  <p className="text-xs opacity-75">
                    Quantity: {action.quantity} {action.quantityUnit}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteAction(action._id!)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
        </>
      )}
    </div>
  );
}
