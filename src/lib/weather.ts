import axios from 'axios';

const OPENWEATHER_API_KEY = 'your_openweather_api_key_here'; // This should be moved to environment variables
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

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

// Fetch current weather data
export const getCurrentWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const [currentResponse, forecastResponse, alertsResponse] = await Promise.all([
      axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
        },
      }),
      axios.get(`${BASE_URL}/forecast`, {
        params: {
          lat,
          lon,
          appid: OPENWEATHER_API_KEY,
          units: 'metric',
          cnt: 40, // 5 days forecast
        },
      }),
      // Weather alerts are not available in free tier, so we'll simulate or skip
      Promise.resolve({ data: { alerts: [] } }),
    ]);

    const current = currentResponse.data;
    const forecast = forecastResponse.data;

    // Process forecast data to get daily forecasts
    const dailyForecasts: DailyForecast[] = [];
    const dailyData: { [key: string]: any[] } = {};

    // Group forecast by date
    forecast.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toDateString();
      if (!dailyData[date]) {
        dailyData[date] = [];
      }
      dailyData[date].push(item);
    });

    // Create daily forecasts
    Object.keys(dailyData).slice(0, 5).forEach((date) => {
      const dayData = dailyData[date];
      const temps = dayData.map(d => d.main.temp);
      const conditions = dayData.map(d => d.weather[0]);
      const humidity = dayData.reduce((sum, d) => sum + d.main.humidity, 0) / dayData.length;
      const precipitation = dayData.reduce((sum, d) => sum + (d.rain?.['3h'] || 0), 0);

      dailyForecasts.push({
        date: new Date(date).toISOString().split('T')[0],
        high: Math.max(...temps),
        low: Math.min(...temps),
        condition: conditions[0].main,
        icon: conditions[0].icon,
        precipitation,
        humidity: Math.round(humidity),
      });
    });

    return {
      location: `${current.name}, ${current.sys.country}`,
      temperature: Math.round(current.main.temp),
      condition: current.weather[0].main,
      humidity: current.main.humidity,
      windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
      precipitation: current.rain?.['1h'] || 0,
      uvIndex: 0, // Not available in free tier
      visibility: Math.round(current.visibility / 1000), // Convert to km
      pressure: current.main.pressure,
      dewPoint: Math.round(current.main.temp - ((100 - current.main.humidity) / 5)),
      feelsLike: Math.round(current.main.feels_like),
      icon: current.weather[0].icon,
      forecast: dailyForecasts,
      alerts: [], // Weather alerts not available in free tier
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Failed to fetch weather data');
  }
};

// Fetch weather by city name
export const getWeatherByCity = async (city: string): Promise<WeatherData> => {
  try {
    const geocodeResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: OPENWEATHER_API_KEY,
        units: 'metric',
      },
    });

    const { coord } = geocodeResponse.data;
    return getCurrentWeather(coord.lat, coord.lon);
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
  switch (condition.toLowerCase()) {
    case 'clear':
      insights.push('☀️ Clear skies: Perfect conditions for field work and harvesting');
      break;
    case 'clouds':
      insights.push('☁️ Cloudy conditions: Good for transplanting and reducing plant stress');
      break;
    case 'rain':
      insights.push('🌧️ Rainy conditions: Avoid field operations and focus on indoor tasks');
      break;
    case 'thunderstorm':
      insights.push('⛈️ Thunderstorm warning: Avoid all outdoor farm activities for safety');
      break;
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
    icon: '02d',
    forecast: [
      {
        date: '2025-01-15',
        high: 30,
        low: 22,
        condition: 'Sunny',
        icon: '01d',
        precipitation: 0,
        humidity: 60,
      },
      {
        date: '2025-01-16',
        high: 28,
        low: 20,
        condition: 'Cloudy',
        icon: '03d',
        precipitation: 5,
        humidity: 70,
      },
      {
        date: '2025-01-17',
        high: 26,
        low: 18,
        condition: 'Rain',
        icon: '10d',
        precipitation: 15,
        humidity: 85,
      },
      {
        date: '2025-01-18',
        high: 29,
        low: 21,
        condition: 'Partly Cloudy',
        icon: '02d',
        precipitation: 2,
        humidity: 65,
      },
      {
        date: '2025-01-19',
        high: 31,
        low: 23,
        condition: 'Sunny',
        icon: '01d',
        precipitation: 0,
        humidity: 55,
      },
    ],
    alerts: [],
  };
};