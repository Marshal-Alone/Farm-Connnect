import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Brain,
  TrendingUp,
  Droplets,
  Thermometer,
  Leaf,
  Bug,
  Calendar,
  MapPin,
  Sparkles,
  BarChart3,
  PieChart,
  LineChart,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FarmMetrics {
  irrigationNeeds: number;
  diseaseProbability: number;
  weatherSuitability: number;
  soilHealth: number;
  cropStage: string;
  growthRate: number;
}

interface AIRecommendation {
  id: string;
  type: 'urgent' | 'important' | 'suggestion';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  daysLeft?: number;
  action: string;
}

export default function AIAnalyticsDashboard() {
  const [metrics, setMetrics] = useState<FarmMetrics>({
    irrigationNeeds: 65,
    diseaseProbability: 25,
    weatherSuitability: 78,
    soilHealth: 72,
    cropStage: 'Flowering',
    growthRate: 85
  });
  
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false);
  const [weatherAdvice, setWeatherAdvice] = useState<string>('');
  const [cropSuggestions, setCropSuggestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadAIRecommendations();
    loadWeatherAdvice();
    loadCropSuggestions();
  }, []);

  const loadAIRecommendations = () => {
    // Mock AI recommendations with realistic farming advice
    const mockRecommendations: AIRecommendation[] = [
      {
        id: '1',
        type: 'urgent',
        title: 'Irrigation Required',
        description: 'Soil moisture levels are below optimal. Immediate irrigation recommended.',
        impact: 'high',
        daysLeft: 2,
        action: 'Schedule irrigation within 24 hours'
      },
      {
        id: '2',
        type: 'important',
        title: 'Fertilizer Application',
        description: 'Nitrogen levels show signs of depletion. Apply NPK fertilizer soon.',
        impact: 'medium',
        daysLeft: 7,
        action: 'Apply 50kg NPK per acre'
      },
      {
        id: '3',
        type: 'suggestion',
        title: 'Pest Monitoring',
        description: 'Weather conditions favor pest activity. Increase monitoring frequency.',
        impact: 'medium',
        action: 'Check crops twice daily'
      }
    ];
    
    setRecommendations(mockRecommendations);
  };

  const loadWeatherAdvice = () => {
    // Using static data - no API calls
    setWeatherAdvice('Current weather conditions in Maharashtra are suitable for most crops. Monitor for sudden changes and maintain proper irrigation schedules.');
  };

  const loadCropSuggestions = () => {
    // Using static data - no API calls
    setCropSuggestions(['Wheat', 'Mustard', 'Chickpea', 'Barley', 'Peas', 'Lentils']);
  };

  const getMetricColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getMetricBgColor = (value: number) => {
    if (value >= 80) return 'bg-success';
    if (value >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'important': return <Clock className="w-4 h-4 text-warning" />;
      default: return <CheckCircle className="w-4 h-4 text-primary" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-2">
          <Brain className="w-6 h-6 mr-2 text-primary" />
          <h2 className="text-2xl font-bold">AI Farm Analytics</h2>
        </div>
        <p className="text-muted-foreground">
          Real-time insights and recommendations powered by artificial intelligence
        </p>
        <Badge variant="outline" className="mt-2">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Analysis Powered
        </Badge>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className={`w-8 h-8 mx-auto mb-2 ${getMetricColor(metrics.growthRate)}`} />
            <div className="text-2xl font-bold">{metrics.growthRate}%</div>
            <div className="text-sm text-muted-foreground">Growth Rate</div>
            <Progress value={metrics.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Droplets className={`w-8 h-8 mx-auto mb-2 ${getMetricColor(100 - metrics.irrigationNeeds)}`} />
            <div className="text-2xl font-bold">{metrics.irrigationNeeds}%</div>
            <div className="text-sm text-muted-foreground">Irrigation Need</div>
            <Progress value={metrics.irrigationNeeds} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Bug className={`w-8 h-8 mx-auto mb-2 ${getMetricColor(100 - metrics.diseaseProbability)}`} />
            <div className="text-2xl font-bold">{metrics.diseaseProbability}%</div>
            <div className="text-sm text-muted-foreground">Disease Risk</div>
            <Progress value={metrics.diseaseProbability} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Thermometer className={`w-8 h-8 mx-auto mb-2 ${getMetricColor(metrics.weatherSuitability)}`} />
            <div className="text-2xl font-bold">{metrics.weatherSuitability}%</div>
            <div className="text-sm text-muted-foreground">Weather Score</div>
            <Progress value={metrics.weatherSuitability} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Leaf className={`w-8 h-8 mx-auto mb-2 ${getMetricColor(metrics.soilHealth)}`} />
            <div className="text-2xl font-bold">{metrics.soilHealth}%</div>
            <div className="text-sm text-muted-foreground">Soil Health</div>
            <Progress value={metrics.soilHealth} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* AI Recommendations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec) => (
                  <div key={rec.id} className="flex items-start space-x-3 p-3 rounded-lg border">
                    {getRecommendationIcon(rec.type)}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <Badge variant={rec.type === 'urgent' ? 'destructive' : rec.type === 'important' ? 'secondary' : 'outline'}>
                          {rec.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary font-medium">{rec.action}</span>
                        {rec.daysLeft && (
                          <Badge variant="outline" className="text-xs">
                            {rec.daysLeft} days left
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weather & Crop Advice */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Weather Advice
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingAdvice ? (
                <div className="flex items-center justify-center py-4">
                  <Brain className="w-5 h-5 animate-pulse text-primary mr-2" />
                  <span className="text-sm">AI analyzing weather...</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">{weatherAdvice}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Crop Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {cropSuggestions.slice(0, 5).map((crop, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Leaf className="w-4 h-4 text-success" />
                    <span className="text-sm">{crop}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Crop Stage</span>
                  <Badge variant="outline">{metrics.cropStage}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Next Action</span>
                  <span className="text-xs text-primary">Check irrigation</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Harvest Est.</span>
                  <span className="text-xs">45 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Farm Performance Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="forecast">Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Current Season Performance</h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Health</span>
                        <span>78%</span>
                      </div>
                      <Progress value={78} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Resource Efficiency</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Sustainability Score</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">AI Confidence Levels</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">94%</div>
                      <div className="text-xs text-muted-foreground">Disease Detection</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">87%</div>
                      <div className="text-xs text-muted-foreground">Growth Tracking</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">91%</div>
                      <div className="text-xs text-muted-foreground">Weather Analysis</div>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <div className="text-2xl font-bold text-primary">89%</div>
                      <div className="text-xs text-muted-foreground">Resource Planning</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="trends" className="mt-6">
              <div className="text-center py-8">
                <LineChart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Trend Analysis</h3>
                <p className="text-muted-foreground">Historical data trends and patterns will be displayed here</p>
              </div>
            </TabsContent>
            
            <TabsContent value="forecast" className="mt-6">
              <div className="text-center py-8">
                <PieChart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">AI Forecasting</h3>
                <p className="text-muted-foreground">Future predictions and planning recommendations</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
