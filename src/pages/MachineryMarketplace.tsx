import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Truck, Star, Filter, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { machineryService } from '@/lib/api/machineryService';
import { MachinerySchema } from '@/lib/schemas/machinery.schema';

export default function MachineryMarketplace() {
  const [machinery, setMachinery] = useState<MachinerySchema[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch machinery from backend
  useEffect(() => {
    fetchMachinery();
  }, [searchTerm, filterType, filterLocation, currentPage]);

  const fetchMachinery = async () => {
    setLoading(true);
    try {
      const response = await machineryService.getMachinery({
        search: searchTerm || undefined,
        type: filterType !== 'all' ? filterType : undefined,
        location: filterLocation !== 'all' ? filterLocation : undefined,
        page: currentPage,
        limit: 12,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });

      if (response.success) {
        setMachinery(response.data);
        if (response.pagination) {
          setTotalPages(response.pagination.pages);
        }
      } else {
        toast({
          title: "Error",
          description: response.error || "Failed to fetch machinery",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching machinery:', error);
      toast({
        title: "Error",
        description: "Failed to load machinery. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (machineryId: string) => {
    navigate(`/machinery/${machineryId}`);
  };

  const handleBookMachinery = (machinery: MachinerySchema) => {
    if (!machinery.available) {
      toast({
        title: "Not Available",
        description: "This machinery is currently not available for booking.",
        variant: "destructive"
      });
      return;
    }

    // Navigate to detail page for booking
    navigate(`/machinery/${machinery._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🚜 Machinery Marketplace
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Rent agricultural machinery from fellow farmers in your area
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search machinery..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={(value) => {
              setFilterType(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="tractor">Tractors</SelectItem>
                <SelectItem value="livestock">Livestock</SelectItem>
                <SelectItem value="irrigation">Irrigation</SelectItem>
                <SelectItem value="harvester">Harvesters</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
                <SelectItem value="rotavator">Rotavator</SelectItem>
                <SelectItem value="seeder">Seeder</SelectItem>
                <SelectItem value="sprayer">Sprayer</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLocation} onValueChange={(value) => {
              setFilterLocation(value);
              setCurrentPage(1);
            }}>
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Gujarat">Gujarat</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/machinery/calendar')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Select Dates
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading machinery...</span>
          </div>
        )}

        {/* Machinery Grid */}
        {!loading && machinery.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {machinery.map((item) => (
              <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow border-0 shadow-md cursor-pointer" onClick={() => handleViewDetails(item._id!)}>
                <div className="relative">
                  <img
                    src={item.images[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge
                    className={`absolute top-3 right-3 ${item.available ? 'bg-green-500' : 'bg-red-500'} text-white border-0 px-2 py-1 text-xs font-medium`}
                  >
                    {item.available ? 'Available' : 'Booked'}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg font-semibold leading-tight">
                      {item.name}
                    </CardTitle>
                    <div className="flex items-center bg-green-100 text-green-600 px-2 py-1 rounded-full">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      <span className="text-sm font-medium">{item.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0 pb-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {item.location.city}, {item.location.state}
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <Truck className="h-4 w-4 mr-2 text-gray-400" />
                      Owner: {item.ownerName}
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {item.features.slice(0, 3).map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-gray-200 text-gray-600 px-2 py-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between pt-0">
                  <div className="text-xl font-bold text-green-600">
                    ₹{item.pricePerDay}/day
                  </div>
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookMachinery(item);
                    }}
                    disabled={!item.available}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-medium"
                  >
                    {item.available ? 'Rent Now' : 'Not Available'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && machinery.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No machinery found matching your criteria.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterLocation('all');
                setCurrentPage(1);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}