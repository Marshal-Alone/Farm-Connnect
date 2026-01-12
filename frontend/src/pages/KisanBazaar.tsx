import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, MapPin, Clock, Star, ShoppingCart, Plus, TrendingUp, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  seller: string;
  location: string;
  price: number;
  unit: string;
  quantity: number;
  quality: 'premium' | 'good' | 'standard';
  rating: number;
  image: string;
  description: string;
  harvestDate: string;
  type: 'sell' | 'buy';
}

const productsData: Product[] = [
  {
    id: '1',
    name: 'Organic Wheat',
    category: 'grains',
    seller: 'राम शर्मा',
    location: 'Pune, Maharashtra',
    price: 2400,
    unit: 'quintal',
    quantity: 50,
    quality: 'premium',
    rating: 4.8,
    image: '/api/placeholder/300/200',
    description: 'High-quality organic wheat, chemical-free cultivation',
    harvestDate: '2025-01-10',
    type: 'sell'
  },
  {
    id: '2',
    name: 'Fresh Basmati Rice',
    category: 'grains',
    seller: 'Harpreet Singh',
    location: 'Ludhiana, Punjab',
    price: 3200,
    unit: 'quintal',
    quantity: 100,
    quality: 'premium',
    rating: 4.9,
    image: '/api/placeholder/300/200',
    description: 'Premium basmati rice, aged for perfect aroma',
    harvestDate: '2025-01-05',
    type: 'sell'
  },
  {
    id: '3',
    name: 'Coconut (Fresh)',
    category: 'fruits',
    seller: 'Priya Nair',
    location: 'Kochi, Kerala',
    price: 25,
    unit: 'piece',
    quantity: 500,
    quality: 'good',
    rating: 4.6,
    image: '/api/placeholder/300/200',
    description: 'Fresh coconuts from organic farms',
    harvestDate: '2025-01-12',
    type: 'sell'
  },
  {
    id: '4',
    name: 'Cotton (Raw)',
    category: 'cotton',
    seller: 'विकास पाटिल',
    location: 'Nagpur, Maharashtra',
    price: 5800,
    unit: 'quintal',
    quantity: 25,
    quality: 'good',
    rating: 4.5,
    image: '/api/placeholder/300/200',
    description: 'High-grade raw cotton for textile industry',
    harvestDate: '2025-01-08',
    type: 'sell'
  },
  {
    id: '5',
    name: 'Looking for Tomatoes',
    category: 'vegetables',
    seller: 'Amit Traders',
    location: 'Mumbai, Maharashtra',
    price: 3000,
    unit: 'quintal',
    quantity: 20,
    quality: 'good',
    rating: 4.3,
    image: '/api/placeholder/300/200',
    description: 'Bulk purchase requirement for fresh tomatoes',
    harvestDate: '',
    type: 'buy'
  }
];

export default function KisanBazaar() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('buy');

  const filteredProducts = productsData
    .filter(product => product.type === (activeTab === 'buy' ? 'sell' : 'buy'))
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      const matchesLocation = filterLocation === 'all' || product.location.includes(filterLocation);
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

  const handleContactSeller = (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to contact sellers.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Contact Initiated",
      description: `Your inquiry has been sent to ${product.seller}. They will contact you soon.`,
    });
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'premium':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'good':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'standard':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🛒 Kisan Bazaar
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Direct farmer-to-farmer marketplace for agricultural products
          </p>
        </div>

        {/* Market Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">₹2.4L</h3>
              <p className="text-sm text-muted-foreground">Daily Trading Volume</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">1,250</h3>
              <p className="text-sm text-muted-foreground">Active Farmers</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <ShoppingCart className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">342</h3>
              <p className="text-sm text-muted-foreground">Products Listed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h3 className="text-2xl font-bold">4.6</h3>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="flex justify-between items-center">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="buy">Buy Products</TabsTrigger>
              <TabsTrigger value="sell">Sell Products</TabsTrigger>
              <TabsTrigger value="requests">Buy Requests</TabsTrigger>
            </TabsList>
            
            {user && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                List Product
              </Button>
            )}
          </div>

          {/* Search and Filters */}
          <div className="bg-card rounded-lg shadow-sm border p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="grains">Grains</SelectItem>
                  <SelectItem value="vegetables">Vegetables</SelectItem>
                  <SelectItem value="fruits">Fruits</SelectItem>
                  <SelectItem value="cotton">Cotton</SelectItem>
                  <SelectItem value="spices">Spices</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger>
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="Kerala">Kerala</SelectItem>
                  <SelectItem value="Punjab">Punjab</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <TabsContent value="buy" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <Badge 
                      className={`absolute top-2 right-2 ${getQualityColor(product.quality)}`}
                    >
                      {product.quality}
                    </Badge>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {product.name}
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                        <span className="text-sm">{product.rating}</span>
                      </div>
                    </CardTitle>
                    <CardDescription>{product.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-primary">
                          ₹{product.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          per {product.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {product.location}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Seller: {product.seller}</span>
                        <span>Available: {product.quantity} {product.unit}s</span>
                      </div>

                      {product.harvestDate && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="h-4 w-4 mr-2" />
                          Harvested: {product.harvestDate}
                        </div>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleContactSeller(product)}
                    >
                      Contact Seller
                    </Button>
                    <Button 
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sell">
            <Card>
              <CardHeader>
                <CardTitle>List Your Products</CardTitle>
                <CardDescription>
                  Sell your agricultural products directly to other farmers and buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="text-center py-12">
                    <Plus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Ready to sell your products?</h3>
                    <p className="text-muted-foreground mb-4">
                      Create a listing to reach thousands of potential buyers
                    </p>
                    <Button size="lg">
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Listing
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold mb-2">Login Required</h3>
                    <p className="text-muted-foreground">
                      Please login to start selling your products
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {productsData.filter(p => p.type === 'buy').map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {request.name}
                      <Badge>Buy Request</Badge>
                    </CardTitle>
                    <CardDescription>{request.description}</CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-green-600">
                          ₹{request.price.toLocaleString()}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          per {request.unit}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {request.location}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span>Buyer: {request.seller}</span>
                        <span>Needed: {request.quantity} {request.unit}s</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full"
                      onClick={() => handleContactSeller(request)}
                    >
                      Contact Buyer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No products found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}