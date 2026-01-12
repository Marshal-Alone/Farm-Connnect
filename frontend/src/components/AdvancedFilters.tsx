import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';

interface AdvancedFiltersProps {
    onFilterChange: (filters: FilterState) => void;
    onReset: () => void;
}

export interface FilterState {
    priceRange: [number, number];
    distance: number;
    rating: number;
    type: string;
    condition: string;
    deliveryAvailable: boolean | null;
    sortBy: string;
}

export default function AdvancedFilters({ onFilterChange, onReset }: AdvancedFiltersProps) {
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 10000],
        distance: 50,
        rating: 0,
        type: 'all',
        condition: 'all',
        deliveryAvailable: null,
        sortBy: 'relevance'
    });

    const [isOpen, setIsOpen] = useState(false);

    const handleFilterChange = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const defaultFilters: FilterState = {
            priceRange: [0, 10000],
            distance: 50,
            rating: 0,
            type: 'all',
            condition: 'all',
            deliveryAvailable: null,
            sortBy: 'relevance'
        };
        setFilters(defaultFilters);
        onReset();
    };

    const activeFiltersCount = () => {
        let count = 0;
        if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) count++;
        if (filters.distance < 50) count++;
        if (filters.rating > 0) count++;
        if (filters.type !== 'all') count++;
        if (filters.condition !== 'all') count++;
        if (filters.deliveryAvailable !== null) count++;
        if (filters.sortBy !== 'relevance') count++;
        return count;
    };

    return (
        <div className="relative">
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="relative"
            >
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
                {activeFiltersCount() > 0 && (
                    <Badge className="ml-2 bg-green-600">{activeFiltersCount()}</Badge>
                )}
            </Button>

            {isOpen && (
                <Card className="absolute top-12 right-0 w-96 z-50 shadow-lg">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Filters</CardTitle>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Price Range */}
                        <div className="space-y-3">
                            <Label>Price Range (₹/day)</Label>
                            <div className="flex items-center gap-4">
                                <span className="text-sm">₹{filters.priceRange[0]}</span>
                                <Slider
                                    value={filters.priceRange}
                                    onValueChange={(value) => handleFilterChange('priceRange', value)}
                                    min={0}
                                    max={10000}
                                    step={100}
                                    className="flex-1"
                                />
                                <span className="text-sm">₹{filters.priceRange[1]}</span>
                            </div>
                        </div>

                        {/* Distance */}
                        <div className="space-y-3">
                            <Label>Maximum Distance (km)</Label>
                            <div className="flex items-center gap-4">
                                <Slider
                                    value={[filters.distance]}
                                    onValueChange={(value) => handleFilterChange('distance', value[0])}
                                    min={5}
                                    max={100}
                                    step={5}
                                    className="flex-1"
                                />
                                <span className="text-sm w-12">{filters.distance} km</span>
                            </div>
                        </div>

                        {/* Minimum Rating */}
                        <div className="space-y-3">
                            <Label>Minimum Rating</Label>
                            <Select
                                value={filters.rating.toString()}
                                onValueChange={(value) => handleFilterChange('rating', parseFloat(value))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="0">Any Rating</SelectItem>
                                    <SelectItem value="3">3+ Stars</SelectItem>
                                    <SelectItem value="4">4+ Stars</SelectItem>
                                    <SelectItem value="4.5">4.5+ Stars</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Type */}
                        <div className="space-y-3">
                            <Label>Machinery Type</Label>
                            <Select
                                value={filters.type}
                                onValueChange={(value) => handleFilterChange('type', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="tractor">Tractor</SelectItem>
                                    <SelectItem value="harvester">Harvester</SelectItem>
                                    <SelectItem value="rotavator">Rotavator</SelectItem>
                                    <SelectItem value="seeder">Seeder</SelectItem>
                                    <SelectItem value="sprayer">Sprayer</SelectItem>
                                    <SelectItem value="irrigation">Irrigation</SelectItem>
                                    <SelectItem value="livestock">Livestock</SelectItem>
                                    <SelectItem value="equipment">Equipment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Condition */}
                        <div className="space-y-3">
                            <Label>Condition</Label>
                            <Select
                                value={filters.condition}
                                onValueChange={(value) => handleFilterChange('condition', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any Condition</SelectItem>
                                    <SelectItem value="excellent">Excellent</SelectItem>
                                    <SelectItem value="good">Good</SelectItem>
                                    <SelectItem value="fair">Fair</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Delivery Available */}
                        <div className="space-y-3">
                            <Label>Delivery</Label>
                            <Select
                                value={filters.deliveryAvailable === null ? 'all' : filters.deliveryAvailable.toString()}
                                onValueChange={(value) => handleFilterChange('deliveryAvailable', value === 'all' ? null : value === 'true')}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Any</SelectItem>
                                    <SelectItem value="true">Available</SelectItem>
                                    <SelectItem value="false">Not Required</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Sort By */}
                        <div className="space-y-3">
                            <Label>Sort By</Label>
                            <Select
                                value={filters.sortBy}
                                onValueChange={(value) => handleFilterChange('sortBy', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="relevance">Relevance</SelectItem>
                                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                                    <SelectItem value="rating">Highest Rated</SelectItem>
                                    <SelectItem value="newest">Newest First</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-4">
                            <Button
                                variant="outline"
                                onClick={handleReset}
                                className="flex-1"
                            >
                                Reset All
                            </Button>
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                                Apply Filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
