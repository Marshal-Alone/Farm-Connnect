import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import {
  Cloud,
  Sun,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  MapPin,
  Calendar,
  AlertTriangle,
  Umbrella,
  Sprout,
  Zap,
  Brain,
  Loader2,
  RefreshCw,
  Search,
  Leaf
} from 'lucide-react';
import { getAIInsights } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import {
  getCurrentWeather,
  getCurrentLocation,
  getWeatherByCity,
  getAgriculturalInsights,
  getMockWeatherData,
  WeatherData
} from '@/lib/weather';

interface FarmingAlert {
  type: 'warning' | 'info' | 'success';
  title: string;
  message: string;
  action?: string;
}

export default function SmartWeatherDashboard() {
  const { toast } = useToast();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState<string[]>([]);
  const [agricultureInsights, setAgricultureInsights] = useState<string[]>([]);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [alerts, setAlerts] = useState<FarmingAlert[]>([]);
  const [location, setLocation] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Load weather data on component mount
  useEffect(() => {
    loadWeatherData();
  }, []);

  // Update alerts and load AI insights when weather data changes
  useEffect(() => {
    if (weatherData) {
      generateFarmingAlerts();
      loadAgricultureInsights();
    }
  }, [weatherData]);

  // Load AI-powered agricultural insights
  const loadAgricultureInsights = async () => {
    if (!weatherData) return;
    setInsightsLoading(true);
    try {
      const insights = await getAgriculturalInsights(weatherData);
      setAgricultureInsights(insights);
    } catch (error) {
      console.error('Error loading agricultural insights:', error);
      setAgricultureInsights(['🌾 Normal farming conditions']);
    } finally {
      setInsightsLoading(false);
    }
  };

  const loadWeatherData = async () => {
    setWeatherLoading(true);
    setError(null);

    try {
      // Try to get user's location first
      const coords = await getCurrentLocation();
      const data = await getCurrentWeather(coords.lat, coords.lon);
      setWeatherData(data);
      setLocation(data.location);

      toast({
        title: "Weather Updated",
        description: `Weather data loaded for ${data.location}`,
      });
    } catch (locationError) {
      console.warn("Could not get location, using mock data:", locationError);
      // Fallback to mock data for development
      const mockData = getMockWeatherData();
      setWeatherData(mockData);
      setLocation(mockData.location);
      setError("Using sample weather data. Please enable location services for real-time data.");
    } finally {
      setWeatherLoading(false);
    }
  };

  const refreshWeather = async () => {
    await loadWeatherData();
  };

  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    setWeatherLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(searchQuery);
      setWeatherData(data);
      setLocation(data.location);
      setSearchQuery('');

      toast({
        title: "Location Updated",
        description: `Weather data loaded for ${data.location}`,
      });
    } catch (error) {
      setError("Could not find weather data for this location. Please try a different city.");
      toast({
        title: "Location Error",
        description: "Could not find weather data for this location.",
        variant: "destructive",
      });
    } finally {
      setWeatherLoading(false);
    }
  };

  const generateFarmingAlerts = () => {
    if (!weatherData) return;

    const newAlerts: FarmingAlert[] = [];

    // High rainfall alert
    if (weatherData.forecast.length > 1 && weatherData.forecast[1]?.precipitation > 10) {
      newAlerts.push({
        type: 'warning',
        title: 'Heavy Rain Expected',
        message: 'Heavy rainfall predicted. Protect sensitive crops and ensure proper drainage.',
        action: 'Check drainage systems'
      });
    }

    // High humidity alert
    if (weatherData.humidity > 80) {
      newAlerts.push({
        type: 'warning',
        title: 'High Humidity Alert',
        message: 'High humidity increases disease risk. Monitor crops for fungal infections.',
        action: 'Apply preventive fungicide'
      });
    }

    // Perfect weather for spraying
    if (weatherData.windSpeed < 15 && weatherData.humidity < 70 && weatherData.precipitation < 5) {
      newAlerts.push({
        type: 'success',
        title: 'Ideal Spraying Conditions',
        message: 'Perfect weather for pesticide/fertilizer application.',
        action: 'Schedule spraying today'
      });
    }

    // High UV warning
    if (weatherData.uvIndex > 7) {
      newAlerts.push({
        type: 'info',
        title: 'High UV Index',
        message: 'Consider shade protection for sensitive crops during peak hours.',
        action: 'Provide shade cover'
      });
    }

    setAlerts(newAlerts);
  };

  const getAIWeatherInsights = async () => {
    if (!weatherData) return;

    setLoading(true);
    try {
      const prompt = `As an agricultural expert, analyze this weather data and provide 3-4 specific, actionable farming recommendations:
      
      Location: ${weatherData.location}
      Temperature: ${weatherData.temperature}°C (feels like ${weatherData.feelsLike}°C)
      Condition: ${weatherData.condition}
      Humidity: ${weatherData.humidity}%
      Wind Speed: ${weatherData.windSpeed} km/h
      Precipitation: ${weatherData.precipitation}mm
      Pressure: ${weatherData.pressure} hPa
      Visibility: ${weatherData.visibility} km
      
      Focus on:
      1. Immediate actions farmers should take
      2. Crop protection measures
      3. Irrigation recommendations
      4. Disease prevention strategies
      
      Provide practical, region-specific advice.`;

      const insights = await getAIInsights(prompt);
      setAiInsights(insights);

      toast({
        title: "AI Analysis Complete",
        description: "Agricultural insights generated based on current weather conditions.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not generate AI insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getRainIntensity = (precipitation: number) => {
    if (precipitation >= 10) return 'Heavy';
    if (precipitation >= 5) return 'Moderate';
    if (precipitation >= 1) return 'Light';
    return 'None';
  };

  const getWeatherIcon = (condition: string, iconUrl?: string) => {
    if (iconUrl) {
      return <img src={iconUrl.startsWith('//') ? `https:${iconUrl}` : iconUrl} alt={condition} className="w-12 h-12" />;
    }

    const iconClass = "w-6 h-6";
    switch (condition.toLowerCase()) {
      case 'clear':
      case 'sunny':
        return <Sun className={`${iconClass} text-yellow-500`} />;
      case 'clouds':
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className={`${iconClass} text-gray-500`} />;
      case 'rain':
      case 'light rain':
      case 'heavy rain':
      case 'patchy rain possible':
        return <CloudRain className={`${iconClass} text-blue-500`} />;
      default:
        return <Sun className={`${iconClass} text-yellow-500`} />;
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case 'success':
        return <Sprout className="w-5 h-5 text-success" />;
      default:
        return <Zap className="w-5 h-5 text-primary" />;
    }
  };

  if (weatherLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Loading weather data...</span>
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Unable to load weather data. Please check your connection and try again.
          </AlertDescription>
        </Alert>
        <Button onClick={loadWeatherData} className="w-full">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry Loading Weather
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold">Weather Dashboard</h2>
        </div>
        <Button variant="outline" onClick={refreshWeather} className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4" />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Location Search */}
      <div className="flex space-x-2 mb-4">
        <Input
          placeholder="Search city..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
        />
        <Button onClick={searchLocation} variant="outline">
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {error && (
        <Alert className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Location */}
      <div className="text-center mb-6">
        <Badge variant="outline" className="text-sm">
          <MapPin className="w-3 h-3 mr-1" />
          {weatherData.location}
        </Badge>
        <p className="text-muted-foreground text-sm mt-2">
          AI-powered weather insights for smart farming decisions
        </p>
      </div>

      {/* Current Weather */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-4xl font-bold mb-2">{weatherData.temperature}°C</div>
                <div className="text-muted-foreground capitalize">{weatherData.condition}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Feels like {weatherData.feelsLike}°C
                </div>
              </div>
              {getWeatherIcon(weatherData.condition, weatherData.icon)}
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="flex items-center">
                <Droplets className="w-4 h-4 mr-2 text-blue-500" />
                <span>Humidity: {weatherData.humidity}%</span>
              </div>
              <div className="flex items-center">
                <Wind className="w-4 h-4 mr-2 text-gray-500" />
                <span>Wind: {weatherData.windSpeed} km/h</span>
              </div>
              <div className="flex items-center">
                <Umbrella className="w-4 h-4 mr-2 text-blue-600" />
                <span>Rain: {weatherData.precipitation}mm</span>
              </div>
              <div className="flex items-center">
                <Gauge className="w-4 h-4 mr-2 text-orange-500" />
                <span>Pressure: {weatherData.pressure} hPa</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Eye className="w-8 h-8 mx-auto mb-2 text-primary" />
            <div className="text-2xl font-bold">{weatherData.visibility} km</div>
            <div className="text-sm text-muted-foreground">Visibility</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <div className="text-2xl font-bold">{weatherData.uvIndex}</div>
            <div className="text-sm text-muted-foreground">UV Index</div>
            <Badge variant={weatherData.uvIndex > 7 ? 'destructive' : weatherData.uvIndex > 5 ? 'secondary' : 'outline'} className="mt-1">
              {weatherData.uvIndex > 7 ? 'High' : weatherData.uvIndex > 5 ? 'Moderate' : 'Low'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* 5-Day Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            5-Day Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="text-center p-2 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="text-sm font-medium mb-2">{day.date}</div>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.condition, day.icon)}
                </div>
                <div className="text-sm font-bold mb-1">{day.high}°C</div>
                <div className="text-xs text-muted-foreground">{day.low}°C</div>
                <Badge variant="outline" className="mt-1 text-xs">
                  {getRainIntensity(day.precipitation)}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Agricultural Insights & AI Analysis */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Agricultural Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <span>Agricultural Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {insightsLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-primary mr-2" />
                <span className="text-sm text-muted-foreground">Generating AI insights...</span>
              </div>
            ) : (
              agricultureInsights.map((insight, index) => (
                <Alert key={index}>
                  <AlertDescription>{insight}</AlertDescription>
                </Alert>
              ))
            )}
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-5 h-5 mr-2" />
                AI Weather Analysis
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={getAIWeatherInsights}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Analyze"
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiInsights.length > 0 ? (
              <div className="space-y-3">
                {aiInsights.map((insight, index) => (
                  <Alert key={index}>
                    <AlertDescription>{insight}</AlertDescription>
                  </Alert>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click "Analyze" to get AI-powered agricultural insights based on current weather conditions.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Farming Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              Farming Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                    {alert.action && (
                      <Button size="sm" variant="outline" className="text-xs">
                        {alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather History & Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Weather Trends & History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold mb-3">This Week</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Avg Temperature</span>
                  <span className="font-medium">27.5°C</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total Rainfall</span>
                  <span className="font-medium">12.5mm</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Avg Humidity</span>
                  <span className="font-medium">72%</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Seasonal Pattern</h4>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Monsoon Progress</span>
                    <span>45%</span>
                  </div>
                  <Progress value={45} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Growing Season</span>
                    <span>78%</span>
                  </div>
                  <Progress value={78} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Compared to Last Year</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Temperature</span>
                  <Badge variant="outline" className="text-xs">+1.2°C</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Rainfall</span>
                  <Badge variant="outline" className="text-xs">-15%</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Humidity</span>
                  <Badge variant="outline" className="text-xs">+5%</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}