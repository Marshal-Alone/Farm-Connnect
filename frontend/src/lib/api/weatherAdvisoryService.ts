/**
 * Weather Advisory Service - Frontend API client for crop recommendations
 */

interface WeatherData {
  current?: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    uvIndex: number;
    visibility: number;
    condition?: string;
  };
  daily?: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    precipitationProbability: number;
    sunrise?: string;
    sunset?: string;
  }>;
  location?: {
    name?: string;
    lat?: number;
    lon?: number;
  };
}

interface RiskAlert {
  severity: 'high' | 'medium' | 'low';
  alert: string;
}

interface WeatherAdvice {
  todayActions: string[];
  monitoring: string[];
  riskAlerts: RiskAlert[];
  nextActions: string[];
  summary: string;
  hasUserCrops?: boolean;
  cropsCount?: number;
  lastUpdated?: string;
  rawAdvice?: string;
}

interface WeatherAdviceResponse {
  success: boolean;
  data?: WeatherAdvice;
  error?: string;
  message?: string;
}

class WeatherAdvisoryService {
  private baseURL = '/api';

  /**
   * Get AI crop recommendations based on weather
   */
  async getWeatherAdvice(weatherData: WeatherData): Promise<WeatherAdviceResponse> {
    try {
      const token = localStorage.getItem('FarmConnect_token');
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated. Please login first.'
        };
      }

      const response = await fetch(`${this.baseURL}/weather-advice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ weatherData })
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to get weather advice'
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching weather advice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch weather advice'
      };
    }
  }

  /**
   * Get last cached recommendation
   */
  async getLastAdvice(): Promise<WeatherAdviceResponse> {
    try {
      const token = localStorage.getItem('FarmConnect_token');
      if (!token) {
        return {
          success: false,
          error: 'Not authenticated. Please login first.'
        };
      }

      const response = await fetch(`${this.baseURL}/weather-advice/last`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to fetch last recommendation'
        };
      }

      return data;
    } catch (error) {
      console.error('Error fetching last advice:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch last recommendation'
      };
    }
  }
}

export const weatherAdvisoryService = new WeatherAdvisoryService();
