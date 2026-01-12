import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee,
  Tractor,
  Wrench,
  Calendar,
  Filter,
  ArrowRight
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import machineryImage from "@/assets/machinery.jpg";

const machineryData = [
  {
    id: 1,
    name: "John Deere 5075E Tractor",
    type: "Tractor",
    pricePerDay: 2500,
    location: "Within 5km",
    rating: 4.8,
    reviews: 24,
    availability: "Available Now",
    owner: "Rajesh Kumar",
    features: ["75HP Engine", "4WD", "Power Steering"],
    image: machineryImage
  },
  {
    id: 2,
    name: "Mahindra Harvester",
    type: "Harvester",
    pricePerDay: 4000,
    location: "Within 8km",
    rating: 4.9,
    reviews: 31,
    availability: "Available Tomorrow",
    owner: "Suresh Patel",
    features: ["Self-Propelled", "GPS Guided", "High Efficiency"],
    image: machineryImage
  },
  {
    id: 3,
    name: "Kubota Rotavator",
    type: "Rotavator",
    pricePerDay: 1800,
    location: "Within 3km",
    rating: 4.7,
    reviews: 18,
    availability: "Available Now",
    owner: "Amit Singh",
    features: ["Wide Cutting", "Adjustable Depth", "Easy Operation"],
    image: machineryImage
  }
];

export default function MachineryRental() {
  const [selectedType, setSelectedType] = useState("All");
  const [bookingLoading, setBookingLoading] = useState<number | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const machineryTypes = ["All", "Tractor", "Harvester", "Rotavator", "Seeder", "Sprayer"];

  const handleBookNow = async (machinery: typeof machineryData[0]) => {
    setBookingLoading(machinery.id);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({
      title: "Booking Confirmed!",
      description: `${machinery.name} booked successfully for tomorrow.`,
    });
    
    setBookingLoading(null);
  };

  const filteredMachinery = selectedType === "All" 
    ? machineryData 
    : machineryData.filter(item => item.type === selectedType);

  return (
    <section className="py-16">
      <div className="container px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Tractor className="w-3 h-3 mr-1" />
            Machinery Rental
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Rent Farm Equipment
            <span className="block text-primary">Near Your Location</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access modern farming equipment without the high upfront costs. 
            Book verified machinery from trusted local providers.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <Button variant="outline" size="sm" className="mb-2">
            <Filter className="w-4 h-4 mr-2" />
            Location
          </Button>
          {machineryTypes.map((type) => (
            <Button
              key={type}
              variant={selectedType === type ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType(type)}
              className="mb-2"
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Machinery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredMachinery.map((machinery) => (
            <Card key={machinery.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={machinery.image} 
                  alt={machinery.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <Badge 
                    variant={machinery.availability === "Available Now" ? "default" : "secondary"}
                    className={machinery.availability === "Available Now" ? "bg-success" : ""}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    {machinery.availability}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-white/90">
                    {machinery.type}
                  </Badge>
                </div>
              </div>

              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span className="text-lg">{machinery.name}</span>
                  <div className="text-right">
                    <div className="flex items-center text-primary font-bold">
                      <IndianRupee className="w-4 h-4" />
                      {machinery.pricePerDay}
                    </div>
                    <span className="text-xs text-muted-foreground">per day</span>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Owner & Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {machinery.owner.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">{machinery.owner}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{machinery.rating}</span>
                    <span className="text-xs text-muted-foreground">({machinery.reviews})</span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {machinery.location}
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Wrench className="w-4 h-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">Features:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {machinery.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/machinery/${machinery.id}`)}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    variant="farm" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleBookNow(machinery)}
                    disabled={bookingLoading === machinery.id}
                  >
                    {bookingLoading === machinery.id ? "Booking..." : "Book Now"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            size="lg" 
            variant="hero" 
            onClick={() => navigate("/machinery")}
          >
            View All Machinery
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
}