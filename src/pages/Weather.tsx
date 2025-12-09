import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Thermometer,
  CloudRain,
  Wind,
  Droplets,
  Sun,
  Cloud,
  AlertTriangle,
  Sprout,
  Loader2,
  MapPin,
  Bug,
  Clock,
  Search
} from "lucide-react";
import {
  getCurrentLocation,
  getCurrentWeather,
  getWeatherByCity,
  type WeatherData
} from "@/lib/weather";

// Helper to categorize humidity
const getHumidityLevel = (humidity: number): { label: string; color: string } => {
  if (humidity < 40) return { label: "Low", color: "text-orange-600" };
  if (humidity < 70) return { label: "Medium", color: "text-blue-600" };
  return { label: "High", color: "text-blue-800" };
};

// Helper to get rain chance message
const getRainMessage = (precipitation: number): { message: string; icon: any; color: string } => {
  if (precipitation > 5) return { message: "High chance of rain", icon: CloudRain, color: "text-blue-600" };
  if (precipitation > 0) return { message: "Low chance", icon: Cloud, color: "text-gray-600" };
  return { message: "No rain likely", icon: Sun, color: "text-yellow-600" };
};

// Get spray timing advice
const getSprayAdvice = (weather: WeatherData) => {
  const { windSpeed, precipitation, temperature } = weather;

  if (precipitation > 2) {
    return { canSpray: false, message: "Avoid spraying today — rain likely", icon: "⚠️" };
  }
  if (windSpeed > 15) {
    return { canSpray: false, message: "Avoid spraying — wind speed too high", icon: "💨" };
  }
  if (temperature > 35) {
    return { canSpray: true, message: "Spray early morning (6-9 AM) — very hot day", icon: "🌡️" };
  }

  return { canSpray: true, message: "Best time to spray: 6-9 AM or after 5 PM", icon: "✅" };
};

// Get irrigation advice
const getIrrigationAdvice = (weather: WeatherData) => {
  const { precipitation, temperature, humidity } = weather;

  if (precipitation > 5) {
    return { message: "Soil will be wet — no irrigation needed today", icon: "💧" };
  }
  if (temperature > 32 && humidity < 50) {
    return { message: "Hot & dry — irrigate your crop today", icon: "🌡️" };
  }
  if (humidity > 80) {
    return { message: "High humidity — reduce irrigation", icon: "💦" };
  }

  return { message: "Normal irrigation — water after 5 PM", icon: "✅" };
};

// Get disease/pest warnings
const getProtectionWarnings = (weather: WeatherData) => {
  const warnings: Array<{ message: string; icon: string }> = [];

  if (weather.humidity > 80 && weather.temperature > 25) {
    warnings.push({
      message: "High humidity — fungal disease possible. Monitor crops closely",
      icon: "🍃"
    });
  }

  if (weather.temperature > 30 && weather.humidity < 40) {
    warnings.push({
      message: "Hot & dry conditions — spider mites risk high",
      icon: "🐛"
    });
  }

  if (weather.precipitation > 10) {
    warnings.push({
      message: "Heavy rain expected — delay all crop protection activities",
      icon: "🌧️"
    });
  }

  return warnings;
};

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      let data: WeatherData;

      try {
        const coords = await getCurrentLocation();
        data = await getCurrentWeather(coords.lat, coords.lon);
      } catch {
        data = await getWeatherByCity('Pune, India');
      }

      setWeatherData(data);
    } catch (err: any) {
      setError('Failed to load weather data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getWeatherByCity(searchQuery);
      setWeatherData(data);
      setSearchQuery(""); // Clear search after successful fetch
    } catch (err: any) {
      setError(`Could not find weather for "${searchQuery}". Try another city.`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading weather...</p>
        </div>
      </div>
    );
  }

  if (error || !weatherData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-destructive" />
            <p className="mb-4">{error || 'Failed to load weather'}</p>
            <button
              onClick={fetchWeather}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
            >
              Try Again
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const humidityLevel = getHumidityLevel(weatherData.humidity);
  const rainToday = getRainMessage(weatherData.precipitation);
  const sprayAdvice = getSprayAdvice(weatherData);
  const irrigationAdvice = getIrrigationAdvice(weatherData);
  const protectionWarnings = getProtectionWarnings(weatherData);

  return (
    <div className="min-h-screen bg-background py-6">
      <div className="container px-4 max-w-6xl mx-auto">

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search city... (e.g., Mumbai, Delhi, Bangalore)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            />
            <button
              onClick={handleSearch}
              disabled={!searchQuery.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Search className="w-4 h-4" />
              Search
            </button>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center mb-6">
          <Badge variant="outline" className="px-4 py-2">
            <MapPin className="w-4 h-4 mr-2" />
            {weatherData.location}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* 1️⃣ WEATHER NOW */}
          <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-950 dark:to-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Sun className="w-5 h-5 mr-2 text-orange-500" />
                Weather Now
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Thermometer className="w-6 h-6 text-red-500" />
                  <span className="text-sm">Temperature</span>
                </div>
                <span className="text-2xl font-bold">{weatherData.temperature}°C</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <rainToday.icon className={`w-6 h-6 ${rainToday.color}`} />
                  <span className="text-sm">Rain Today</span>
                </div>
                <span className="text-sm font-semibold">{rainToday.message}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wind className="w-6 h-6 text-teal-500" />
                  <span className="text-sm">Wind Speed</span>
                </div>
                <span className="text-xl font-bold">{weatherData.windSpeed} km/h</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-6 h-6 text-blue-500" />
                  <span className="text-sm">Humidity</span>
                </div>
                <span className={`text-xl font-bold ${humidityLevel.color}`}>
                  {humidityLevel.label}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* 2️⃣ RAIN FORECAST */}
          <Card className="bg-gradient-to-br from-sky-50 to-white dark:from-sky-950 dark:to-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <CloudRain className="w-5 h-5 mr-2 text-blue-600" />
                Rain Forecast
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Next 3 hours */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Next 3 hours</div>
                <div className="font-semibold">{getRainMessage(weatherData.precipitation).message}</div>
              </div>

              {/* Today */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Today</div>
                <div className="font-semibold">
                  {weatherData.precipitation > 5 ? "🌧️ Rain expected" : weatherData.precipitation > 0 ? "⛅ May drizzle" : "☀️ No rain"}
                </div>
              </div>

              {/* Next 3 days */}
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="text-xs text-muted-foreground mb-1">Next 3 days</div>
                <div className="space-y-1">
                  {weatherData.forecast.slice(0, 3).map((day, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>{idx === 0 ? 'Tomorrow' : `Day ${idx + 1}`}</span>
                      <span>{getRainMessage(day.precipitation).message.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3️⃣ ALERTS */}
          <Card className="bg-gradient-to-br from-amber-50 to-white dark:from-amber-950 dark:to-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-amber-600" />
                Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {weatherData.precipitation > 2 && (
                <Alert className="py-2">
                  <AlertDescription className="text-sm">
                    ⚠️ Rain coming — don't spray pesticides
                  </AlertDescription>
                </Alert>
              )}

              {weatherData.temperature < 15 && (
                <Alert className="py-2">
                  <AlertDescription className="text-sm">
                    ❄️ Cold weather — protect seedlings
                  </AlertDescription>
                </Alert>
              )}

              {weatherData.windSpeed > 15 && (
                <Alert className="py-2">
                  <AlertDescription className="text-sm">
                    💨 High wind — avoid spraying
                  </AlertDescription>
                </Alert>
              )}

              {weatherData.temperature > 35 && (
                <Alert className="py-2">
                  <AlertDescription className="text-sm">
                    🌡️ Very hot day — irrigate crop
                  </AlertDescription>
                </Alert>
              )}

              {weatherData.humidity > 80 && (
                <Alert className="py-2">
                  <AlertDescription className="text-sm">
                    🌾 Humidity high — fungal disease possible
                  </AlertDescription>
                </Alert>
              )}

              {weatherData.precipitation === 0 && weatherData.windSpeed < 15 && weatherData.temperature < 35 && weatherData.temperature > 15 && weatherData.humidity < 80 && (
                <div className="py-8 text-center text-muted-foreground">
                  <Sun className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Good weather conditions</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 4️⃣ IRRIGATION ADVICE */}
          <Card className="bg-gradient-to-br from-green-50 to-white dark:from-green-950 dark:to-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-green-600" />
                Irrigation Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription className="flex items-start">
                  <span className="text-2xl mr-2">{irrigationAdvice.icon}</span>
                  <span className="text-sm">{irrigationAdvice.message}</span>
                </AlertDescription>
              </Alert>

              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg space-y-2">
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-semibold">Best time:</span>
                </div>
                <p className="text-sm ml-6">After 5:00 PM</p>
              </div>

              {weatherData.temperature > 30 && (
                <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                  <p className="text-sm">
                    <span className="font-semibold">Hot day:</span> Give approx 30 min irrigation
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 5️⃣ CROP PROTECTION ADVICE */}
          <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-950 dark:to-background md:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Sprout className="w-5 h-5 mr-2 text-purple-600" />
                Crop Protection Advice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">

              {/* Spray Timing */}
              <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex items-start mb-2">
                  <span className="text-2xl mr-2">{sprayAdvice.icon}</span>
                  <div>
                    <div className="font-semibold text-sm mb-1">Spray Timing</div>
                    <p className="text-sm">{sprayAdvice.message}</p>
                  </div>
                </div>
              </div>

              {/* Pest/Disease Warnings */}
              {protectionWarnings.length > 0 ? (
                <div className="space-y-2">
                  <div className="font-semibold text-sm flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Pest & Disease Risk
                  </div>
                  {protectionWarnings.map((warning, idx) => (
                    <Alert key={idx} className="py-2">
                      <AlertDescription className="text-sm flex items-start">
                        <span className="text-xl mr-2">{warning.icon}</span>
                        <span>{warning.message}</span>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg text-center">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✅ Low pest & disease risk today
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}