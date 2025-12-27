import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { machineryService } from '@/lib/api/machineryService';
import { useAuth } from '@/contexts/AuthContext';

export default function MachineryForm() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { user } = useAuth();
    const { id: editId } = useParams();
    const isEditMode = !!editId;

    const [loading, setLoading] = useState(isEditMode);
    const [formData, setFormData] = useState({
        name: '',
        type: 'tractor',
        description: '',
        brand: '',
        model: '',
        pricePerDay: '',
        securityDeposit: '',
        address: '',
        city: '',
        state: '',
        deliveryAvailable: false,
        deliveryChargePerKm: ''
    });

    const [images, setImages] = useState<string[]>([]);
    const [specifications, setSpecifications] = useState<{ key: string, value: string }[]>([{ key: '', value: '' }]);
    const [features, setFeatures] = useState<string[]>([]);

    // Load machinery data if editing
    useEffect(() => {
        if (isEditMode && editId) {
            const loadMachinery = async () => {
                try {
                    const response = await machineryService.getMachineryById(editId);
                    if (response.success) {
                        const machinery = response.data;
                        setFormData({
                            name: machinery.name || '',
                            type: machinery.type || 'tractor',
                            description: machinery.description || '',
                            brand: machinery.brand || '',
                            model: machinery.model || '',
                            pricePerDay: machinery.pricePerDay?.toString() || '',
                            securityDeposit: machinery.securityDeposit?.toString() || '',
                            address: machinery.location?.address || '',
                            city: machinery.location?.city || '',
                            state: machinery.location?.state || '',
                            deliveryAvailable: machinery.deliveryAvailable || false,
                            deliveryChargePerKm: machinery.deliveryChargePerKm?.toString() || ''
                        });
                        if (machinery.images) setImages(machinery.images);
                        if (machinery.specifications) setSpecifications(machinery.specifications);
                        if (machinery.features) setFeatures(machinery.features);
                    } else {
                        toast({
                            title: 'Error',
                            description: 'Failed to load machinery',
                            variant: 'destructive'
                        });
                        navigate('/profile');
                    }
                } catch (error) {
                    console.error('Error loading machinery:', error);
                    toast({
                        title: 'Error',
                        description: 'Failed to load machinery',
                        variant: 'destructive'
                    });
                    navigate('/profile');
                } finally {
                    setLoading(false);
                }
            };
            loadMachinery();
        }
    }, [editId, isEditMode, navigate, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.pricePerDay || images.length === 0) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields including at least one image",
                variant: "destructive"
            });
            return;
        }

        if (!user) {
            toast({
                title: "Not Logged In",
                description: "Please log in to add machinery",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);
        try {
            const machineryData = {
                name: formData.name,
                type: formData.type as any,
                description: formData.description,
                brand: formData.brand,
                model: formData.model,
                condition: 'good' as any,
                ownerId: user._id || user.id || '',
                ownerName: user.name,
                ownerPhone: user.phone,
                ownerEmail: user.email || '',
                pricePerDay: parseFloat(formData.pricePerDay),
                securityDeposit: parseFloat(formData.securityDeposit) || 0,
                deliveryAvailable: formData.deliveryAvailable,
                deliveryRadius: 50,
                deliveryChargePerKm: parseFloat(formData.deliveryChargePerKm) || 0,
                minimumBookingHours: 4,
                cancellationPolicy: 'Free cancellation up to 24 hours before booking',
                location: {
                    address: formData.address,
                    city: formData.city,
                    state: formData.state,
                    pincode: '',
                    coordinates: { latitude: 0, longitude: 0 }
                },
                specifications: specifications.filter(s => s.key && s.value),
                features: features.filter(f => f.trim()),
                images: images,
                rating: 0,
                totalReviews: 0,
                totalBookings: 0,
                available: true,
                bookedDates: []
            };

            if (isEditMode && editId) {
                // Update existing machinery
                const response = await machineryService.updateMachinery(editId, machineryData);
                if (response.success) {
                    toast({
                        title: "Success!",
                        description: "Machinery updated successfully"
                    });
                    navigate('/profile?tab=machinery');
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to update machinery",
                        variant: "destructive"
                    });
                }
            } else {
                // Create new machinery
                const response = await machineryService.createMachinery(machineryData);
                if (response.success) {
                    toast({
                        title: "Success!",
                        description: "Machinery added successfully"
                    });
                    navigate('/profile?tab=machinery');
                } else {
                    toast({
                        title: "Error",
                        description: response.error || "Failed to add machinery",
                        variant: "destructive"
                    });
                }
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                title: "Error",
                description: isEditMode ? "Failed to update machinery" : "Failed to add machinery",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                toast({
                    title: "File too large",
                    description: `${file.name} exceeds 5MB limit`,
                    variant: "destructive"
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const addSpecification = () => {
        setSpecifications(prev => [...prev, { key: '', value: '' }]);
    };

    const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
        setSpecifications(prev => prev.map((spec, i) =>
            i === index ? { ...spec, [field]: value } : spec
        ));
    };

    const removeSpecification = (index: number) => {
        if (specifications.length > 1) {
            setSpecifications(prev => prev.filter((_, i) => i !== index));
        }
    };

    const addFeature = (feature: string) => {
        if (feature.trim() && !features.includes(feature.trim())) {
            setFeatures(prev => [...prev, feature.trim()]);
        }
    };

    const removeFeature = (index: number) => {
        setFeatures(prev => prev.filter((_, i) => i !== index));
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/profile?tab=machinery')}
                    className="mb-6"
                    disabled={loading}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Profile
                </Button>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle className="text-2xl">
                            {isEditMode ? 'Edit Machinery' : 'Add New Machinery'}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Machinery Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g., John Deere 5075E Tractor"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-md"
                                >
                                    <option value="tractor">Tractor</option>
                                    <option value="harvester">Harvester</option>
                                    <option value="rotavator">Rotavator</option>
                                    <option value="seeder">Seeder</option>
                                    <option value="sprayer">Sprayer</option>
                                    <option value="irrigation">Irrigation</option>
                                    <option value="livestock">Livestock</option>
                                    <option value="equipment">Equipment</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description *</Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe your machinery..."
                                    rows={3}
                                    required
                                />
                            </div>

                            {/* Image Upload */}
                            <div className="space-y-2">
                                <Label>Machinery Images * (Max 5MB each)</Label>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    className="cursor-pointer"
                                />
                                {images.length > 0 && (
                                    <div className="grid grid-cols-3 gap-2 mt-2">
                                        {images.map((img, idx) => (
                                            <div key={idx} className="relative">
                                                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-24 object-cover rounded" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-1 right-1 h-6 w-6 p-0"
                                                    onClick={() => removeImage(idx)}
                                                >
                                                    ×
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Brand & Model */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="brand">Brand</Label>
                                    <Input
                                        id="brand"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                        placeholder="e.g., John Deere"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="model">Model</Label>
                                    <Input
                                        id="model"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                        placeholder="e.g., 5075E"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="pricePerDay">Price per Day (₹) *</Label>
                                <Input
                                    id="pricePerDay"
                                    type="number"
                                    value={formData.pricePerDay}
                                    onChange={(e) => setFormData({ ...formData, pricePerDay: e.target.value })}
                                    placeholder="2500"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
                                <Input
                                    id="securityDeposit"
                                    type="number"
                                    value={formData.securityDeposit}
                                    onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })}
                                    placeholder="5000"
                                />
                            </div>

                            {/* Delivery Options */}
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="deliveryAvailable"
                                        checked={formData.deliveryAvailable}
                                        onChange={(e) => setFormData({ ...formData, deliveryAvailable: e.target.checked })}
                                        className="rounded"
                                    />
                                    <Label htmlFor="deliveryAvailable" className="cursor-pointer">Delivery Available</Label>
                                </div>
                                {formData.deliveryAvailable && (
                                    <Input
                                        type="number"
                                        value={formData.deliveryChargePerKm}
                                        onChange={(e) => setFormData({ ...formData, deliveryChargePerKm: e.target.value })}
                                        placeholder="Delivery charge per km (₹)"
                                    />
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Village Road, Sector 12"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City *</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                        placeholder="Pune"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="state">State *</Label>
                                    <Input
                                        id="state"
                                        value={formData.state}
                                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                        placeholder="Maharashtra"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Specifications Section */}
                            <div className="space-y-3 border-t pt-6">
                                <div className="flex items-center justify-between">
                                    <Label className="text-base font-semibold">Specifications</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addSpecification}
                                    >
                                        + Add Specification
                                    </Button>
                                </div>
                                {specifications.map((spec, index) => (
                                    <div key={index} className="grid grid-cols-2 gap-2 items-end">
                                        <Input
                                            placeholder="e.g., Engine Power"
                                            value={spec.key}
                                            onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                                        />
                                        <div className="flex gap-2">
                                            <Input
                                                placeholder="e.g., 75 HP"
                                                value={spec.value}
                                                onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => removeSpecification(index)}
                                                disabled={specifications.length === 1}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Features Section */}
                            <div className="space-y-3 border-t pt-6">
                                <Label className="text-base font-semibold">Features</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="featureInput"
                                        placeholder="e.g., Power Steering"
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                const input = e.currentTarget as HTMLInputElement;
                                                addFeature(input.value);
                                                input.value = '';
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            const input = document.getElementById('featureInput') as HTMLInputElement;
                                            if (input) {
                                                addFeature(input.value);
                                                input.value = '';
                                            }
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                                {features.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {features.map((feature, index) => (
                                            <Badge key={index} variant="secondary" className="px-3 py-1 cursor-pointer hover:bg-red-100">
                                                <span>{feature}</span>
                                                <button
                                                    type="button"
                                                    className="ml-2 font-bold text-red-600"
                                                    onClick={() => removeFeature(index)}
                                                >
                                                    ×
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => navigate('/owner/dashboard')}
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            {isEditMode ? 'Updating...' : 'Adding...'}
                                        </>
                                    ) : (
                                        isEditMode ? 'Update Machinery' : 'Add Machinery'
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
