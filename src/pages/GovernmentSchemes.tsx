import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Search, Filter, FileText, Calendar, IndianRupee, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Scheme {
  id: string;
  name: string;
  nameHindi: string;
  category: string;
  state: string;
  subsidy: number;
  maxAmount: number;
  eligibility: string[];
  documents: string[];
  deadline: string;
  status: 'active' | 'deadline-soon' | 'closed';
  description: string;
  applicationProcess: string[];
}

const schemesData: Scheme[] = [
  {
    id: '1',
    name: 'PM-KISAN Samman Nidhi',
    nameHindi: 'प्रधानमंत्री किसान सम्मान निधि',
    category: 'income-support',
    state: 'All States',
    subsidy: 100,
    maxAmount: 6000,
    eligibility: ['Small & Marginal Farmers', 'Land ownership documents', 'Valid Aadhaar'],
    documents: ['Aadhaar Card', 'Land Records', 'Bank Passbook', 'Passport Photo'],
    deadline: '2025-03-31',
    status: 'active',
    description: 'Direct income support of ₹6000 per year to farmer families',
    applicationProcess: [
      'Visit PM-KISAN website',
      'Fill online application form',
      'Upload required documents',
      'Submit application',
      'Track application status'
    ]
  },
  {
    id: '2',
    name: 'Pradhan Mantri Fasal Bima Yojana',
    nameHindi: 'प्रधानमंत्री फसल बीमा योजना',
    category: 'insurance',
    state: 'Maharashtra',
    subsidy: 95,
    maxAmount: 200000,
    eligibility: ['All farmers', 'Valid crop insurance', 'Land records'],
    documents: ['Aadhaar Card', 'Land Records', 'Sowing Certificate', 'Bank Details'],
    deadline: '2025-02-15',
    status: 'deadline-soon',
    description: 'Comprehensive crop insurance scheme covering yield losses',
    applicationProcess: [
      'Visit nearest CSC or bank',
      'Fill application form',
      'Pay farmer premium (2%)',
      'Get insurance policy',
      'Report crop loss if any'
    ]
  },
  {
    id: '3',
    name: 'Soil Health Card Scheme',
    nameHindi: 'मृदा स्वास्थ्य कार्ड योजना',
    category: 'soil-health',
    state: 'Kerala',
    subsidy: 100,
    maxAmount: 0,
    eligibility: ['All farmers with land', 'Soil testing required'],
    documents: ['Land Records', 'Aadhaar Card', 'Mobile Number'],
    deadline: '2025-06-30',
    status: 'active',
    description: 'Free soil testing and health cards for farmers',
    applicationProcess: [
      'Contact local agriculture officer',
      'Provide soil samples',
      'Wait for lab testing',
      'Receive soil health card',
      'Follow recommendations'
    ]
  },
  {
    id: '4',
    name: 'Kisan Credit Card',
    nameHindi: 'किसान क्रेडिट कार्ड',
    category: 'credit',
    state: 'Punjab',
    subsidy: 0,
    maxAmount: 300000,
    eligibility: ['Crop cultivators', 'Good credit history', 'Land ownership'],
    documents: ['Aadhaar Card', 'Land Records', 'Income Certificate', 'Bank Statements'],
    deadline: '2025-12-31',
    status: 'active',
    description: 'Easy credit access for agriculture and allied activities',
    applicationProcess: [
      'Visit bank branch',
      'Fill KCC application',
      'Submit documents',
      'Credit assessment',
      'Receive KCC card'
    ]
  }
];

export default function GovernmentSchemes() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterState, setFilterState] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchSchemes = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (filterCategory !== 'all') queryParams.append('category', filterCategory);
        if (filterState !== 'all') queryParams.append('state', filterState);
        if (searchTerm) queryParams.append('search', searchTerm);

        const response = await fetch(`/api/schemes?${queryParams.toString()}`);
        const result = await response.json();

        if (result.success) {
          setSchemes(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch schemes:', error);
        toast({
          title: "Error",
          description: "Failed to load government schemes. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSchemes();
    }, 300); // Debounce search

    return () => clearTimeout(timer);
  }, [filterCategory, filterState, searchTerm, toast]);

  const handleApplyScheme = (scheme: Scheme) => {
    if (scheme.status === 'closed') {
      toast({
        title: "Application Closed",
        description: "This scheme's application period has ended.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Application Started",
      description: `Starting application process for ${scheme.name}. You will be redirected to the official portal.`,
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'deadline-soon':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'closed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'deadline-soon':
        return 'Deadline Soon';
      case 'closed':
        return 'Closed';
      default:
        return 'Active';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            🏛️ Government Schemes Portal
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover and apply for agricultural schemes and subsidies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search schemes..."
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
                <SelectItem value="income-support">Income Support</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="soil-health">Soil Health</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterState} onValueChange={setFilterState}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Kerala">Kerala</SelectItem>
                <SelectItem value="Punjab">Punjab</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{scheme.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{scheme.nameHindi}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(scheme.status)}
                    <Badge variant={scheme.status === 'active' ? 'default' :
                      scheme.status === 'deadline-soon' ? 'destructive' : 'secondary'}>
                      {getStatusText(scheme.status)}
                    </Badge>
                  </div>
                </div>
                <CardDescription>{scheme.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <IndianRupee className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">Max Amount</p>
                      <p className="text-sm text-muted-foreground">
                        {scheme.maxAmount === 0 ? 'Free' : `₹${scheme.maxAmount.toLocaleString()}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Deadline</p>
                      <p className="text-sm text-muted-foreground">{scheme.deadline}</p>
                    </div>
                  </div>
                </div>

                {/* Subsidy Percentage */}
                {scheme.subsidy > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Subsidy Coverage</span>
                      <span>{scheme.subsidy}%</span>
                    </div>
                    <Progress value={scheme.subsidy} className="h-2" />
                  </div>
                )}

                {/* Eligibility */}
                <div>
                  <p className="text-sm font-medium mb-2">Eligibility</p>
                  <div className="flex flex-wrap gap-1">
                    {scheme.eligibility.slice(0, 2).map((criteria, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criteria}
                      </Badge>
                    ))}
                    {scheme.eligibility.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{scheme.eligibility.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Documents Required */}
                <div>
                  <p className="text-sm font-medium mb-2">Documents Required</p>
                  <div className="flex flex-wrap gap-1">
                    {scheme.documents.slice(0, 2).map((doc, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <FileText className="h-3 w-3 mr-1" />
                        {doc}
                      </Badge>
                    ))}
                    {scheme.documents.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{scheme.documents.length - 2} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    onClick={() => handleApplyScheme(scheme)}
                    className="flex-1"
                    disabled={scheme.status === 'closed'}
                  >
                    {scheme.status === 'closed' ? 'Application Closed' : 'Apply Now'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedScheme(scheme)}
                  >
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {schemes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No schemes found matching your criteria.
            </p>
          </div>
        )}

        {/* Scheme Details Modal */}
        {selectedScheme && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedScheme.name}</CardTitle>
                    <p className="text-muted-foreground">{selectedScheme.nameHindi}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedScheme(null)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>{selectedScheme.description}</p>

                <div>
                  <h4 className="font-medium mb-2">Application Process:</h4>
                  <ol className="list-decimal list-inside space-y-1 text-sm">
                    {selectedScheme.applicationProcess.map((step, index) => (
                      <li key={index}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Complete Eligibility Criteria:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedScheme.eligibility.map((criteria, index) => (
                      <li key={index}>{criteria}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Required Documents:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    {selectedScheme.documents.map((doc, index) => (
                      <li key={index}>{doc}</li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => handleApplyScheme(selectedScheme)}
                  className="w-full"
                  disabled={selectedScheme.status === 'closed'}
                >
                  {selectedScheme.status === 'closed' ? 'Application Closed' : 'Start Application'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}