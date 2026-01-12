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
        days: 7,
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
        days: 7,
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

// AI-powered agricultural weather insights using configured AI provider (Groq or Gemini)
export const getAgriculturalInsights = async (weather: WeatherData): Promise<string[]> => {
  const { temperature, humidity, windSpeed, precipitation, condition, location } = weather;

  // Build weather context for AI
  const weatherContext = `
    Location: ${location}
    Temperature: ${temperature}°C
    Humidity: ${humidity}%
    Wind Speed: ${windSpeed} km/h
    Precipitation: ${precipitation} mm
    Condition: ${condition}
  `;

  try {
    // Import dynamically to avoid circular dependency
    const { getAgriculturalInsightsAI } = await import('./ai');
    const insights = await getAgriculturalInsightsAI(weatherContext);

    if (Array.isArray(insights) && insights.length > 0) {
      return insights;
    }

    return getBasicInsights(weather);
  } catch (error) {
    console.error('Error generating AI insights:', error);
    return getBasicInsights(weather);
  }
};

// Fallback basic insights when AI is unavailable
const getBasicInsights = (weather: WeatherData): string[] => {
  const insights: string[] = [];
  const { temperature, humidity, precipitation, condition } = weather;

  if (temperature > 35) {
    insights.push('🌡️ High temperature - increase irrigation frequency');
  } else if (temperature < 10) {
    insights.push('❄️ Low temperature - protect crops from frost');
  }

  if (humidity > 80) {
    insights.push('💧 High humidity - monitor for fungal diseases');
  } else if (humidity < 40) {
    insights.push('🏜️ Low humidity - consider mulching');
  }

  if (precipitation > 10) {
    insights.push('🌧️ Heavy rain expected - ensure proper drainage');
  }

  const conditionLower = condition.toLowerCase();
  if (conditionLower.includes('sunny') || conditionLower.includes('clear')) {
    insights.push('☀️ Good conditions for field work');
  }

  return insights.length > 0 ? insights : ['🌾 Normal farming conditions'];
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