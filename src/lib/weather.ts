import axios from 'axios';

// Use relative path for API calls to leverage Vite proxy or direct backend connection
const API_BASE_URL = '/api/weather';

export interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: number;
  uvIndex: number;
  visibility: number;
  pressure: number;
  dewPoint: number;
  feelsLike: number;
  icon: string;
  forecast: DailyForecast[];
  alerts?: WeatherAlert[];
}

export interface DailyForecast {
  date: string;
  high: number;
  low: number;
  condition: string;
  icon: string;
  precipitation: number;
  humidity: number;
}

export interface WeatherAlert {
  title: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  startTime: string;
  endTime: string;
}

export interface LocationCoords {
  lat: number;
  lon: number;
}

// Get user's current location
export const getCurrentLocation = (): Promise<LocationCoords> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  });
};

// Map WeatherAPI.com response to our WeatherData interface
const mapWeatherResponse = (data: any): WeatherData => {
  const current = data.current;
  const location = data.location;
  const forecastDays = data.forecast.forecastday;

  // Map daily forecast
  const dailyForecasts: DailyForecast[] = forecastDays.map((day: any) => ({
    date: day.date,
    high: Math.round(day.day.maxtemp_c),
    low: Math.round(day.day.mintemp_c),
    condition: day.day.condition.text,
    icon: day.day.condition.icon, // WeatherAPI returns full URL usually, or we might need to prepend 'https:'
    precipitation: day.day.totalprecip_mm,
    humidity: day.day.avghumidity,
  }));

  // Map alerts if any
  const alerts: WeatherAlert[] = data.alerts?.alert?.map((alert: any) => ({
    title: alert.event,
    description: alert.desc,
    severity: 'moderate', // WeatherAPI doesn't strictly map to our types, defaulting to moderate or parsing severity field
    startTime: alert.effective,
    endTime: alert.expires,
  })) || [];

  return {
    location: `${location.name}, ${location.region}`,
    temperature: Math.round(current.temp_c),
    condition: current.condition.text,
    humidity: current.humidity,
    windSpeed: Math.round(current.wind_kph),
    precipitation: current.precip_mm,
    uvIndex: current.uv,
    visibility: current.vis_km,
    pressure: current.pressure_mb,
    dewPoint: Math.round(current.dewpoint_c || (current.temp_c - ((100 - current.humidity) / 5))), // Calculate if not provided
    feelsLike: Math.round(current.feelslike_c),
    icon: current.condition.icon,
    forecast: dailyForecasts,
    alerts: alerts,
  };
};

// Fetch current weather data (actually fetches forecast which includes current)
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast`, {
      params: {
        q: `${lat},${lon}`,
        days: 5,
      },
    });

    if (response.data.success) {
      return mapWeatherResponse(response.data.data);
    } else {
      throw new Error(response.data.error || 'Failed to fetch weather data');
    }
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Fetch weather by city name
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/forecast`, {
      params: {
        q: city,
        days: 5,
      },
    });

    if (response.data.success) {
      return mapWeatherResponse(response.data.data);
    } else {
      throw new Error(response.data.error || 'Failed to fetch weather data');
    }
  } catch (error) {
    console.error('Error fetching weather by city:', error);
    throw new Error('Failed to fetch weather data for the specified city');
  }
};

// Agricultural weather insights based on current conditions
export const getAgriculturalInsights = (weather: WeatherData): string[] => {
  const insights: string[] = [];
  const { temperature, humidity, windSpeed, precipitation, condition } = weather;

  // Temperature-based insights
  if (temperature > 35) {
    insights.push('🌡️ High temperature alert: Consider additional irrigation and shade for crops');
    insights.push('🚰 Increase watering frequency during early morning or evening hours');
  } else if (temperature < 10) {
    insights.push('❄️ Low temperature warning: Protect sensitive crops from frost damage');
    insights.push('🏠 Consider using row covers or greenhouse protection');
  } else if (temperature >= 20 && temperature <= 30) {
    insights.push('🌱 Optimal temperature range for most crop growth');
  }

  // Humidity-based insights
  if (humidity > 80) {
    insights.push('💧 High humidity detected: Monitor for fungal diseases and improve ventilation');
    insights.push('🍄 Consider preventive fungicide applications if needed');
  } else if (humidity < 40) {
    insights.push('🏜️ Low humidity alert: Increase irrigation and consider mulching');
  }

  // Wind-based insights
  if (windSpeed > 25) {
    insights.push('💨 Strong winds detected: Secure young plants and check irrigation systems');
  }

  // Precipitation insights
  if (precipitation > 10) {
    insights.push('🌧️ Heavy rainfall expected: Ensure proper drainage to prevent waterlogging');
    insights.push('⚠️ Delay fertilizer and pesticide applications');
  } else if (precipitation > 0) {
    insights.push('🌦️ Light rainfall expected: Good for natural irrigation');
  }

  // Condition-specific insights
  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    insights.push('☀️ Clear skies: Perfect conditions for field work and harvesting');
  } else if (conditionLower.includes('cloud')) {
    insights.push('☁️ Cloudy conditions: Good for transplanting and reducing plant stress');
  } else if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    insights.push('🌧️ Rainy conditions: Avoid field operations and focus on indoor tasks');
  } else if (conditionLower.includes('thunder') || conditionLower.includes('storm')) {
    insights.push('⛈️ Thunderstorm warning: Avoid all outdoor farm activities for safety');
  }

  return insights.length > 0 ? insights : ['🌾 Weather conditions are suitable for normal farming activities'];
};

// Mock data fallback for development/testing
export const getMockWeatherData = (): WeatherData => {
  return {
    location: 'Sample City, IN',
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    precipitation: 2,
    uvIndex: 7,
    visibility: 10,
    pressure: 1013,
    dewPoint: 21,
    feelsLike: 31,
    icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
    forecast: [
      {
        date: '2025-01-15',
        high: 30,
        low: 22,
        condition: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        precipitation: 0,
        humidity: 60,
      },
      {
        date: '2025-01-16',
        high: 28,
        low: 20,
        condition: 'Cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/119.png',
        precipitation: 5,
        humidity: 70,
      },
      {
        date: '2025-01-17',
        high: 26,
        low: 18,
        condition: 'Rain',
        icon: '//cdn.weatherapi.com/weather/64x64/day/296.png',
        precipitation: 15,
        humidity: 85,
      },
      {
        date: '2025-01-18',
        high: 29,
        low: 21,
        condition: 'Partly Cloudy',
        icon: '//cdn.weatherapi.com/weather/64x64/day/116.png',
        precipitation: 2,
        humidity: 65,
      },
      {
        date: '2025-01-19',
        high: 31,
        low: 23,
        condition: 'Sunny',
        icon: '//cdn.weatherapi.com/weather/64x64/day/113.png',
        precipitation: 0,
        humidity: 55,
      },
    ],
    alerts: [],
  };
};