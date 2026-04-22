/**
 * AI-Powered Weather Advisory Component
 * Shows crop recommendations based on weather and farmer's crops
 */

import { useEffect, useState } from 'react';
import { AlertTriangle, Lightbulb, Leaf, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cropService } from '@/lib/api/cropService';
import { weatherAdvisoryService } from '@/lib/api/weatherAdvisoryService';

interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    uvIndex: number;
    visibility: number;
    isDay: boolean;
  };
  daily: {
    date: string;
    tempMax: number;
    tempMin: number;
    weatherCode: number;
    precipitationProbability: number;
    sunrise: string;
    sunset: string;
  }[];
  location: {
    name: string;
    lat: number;
    lon: number;
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
}

interface Props {
  weatherData?: WeatherData;
}

export function AIWeatherAdvisory({ weatherData }: Props) {
  const [advice, setAdvice] = useState<WeatherAdvice | null>(null);
  const [cropsCount, setCropsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAdvice();
  }, [weatherData]);

  const fetchAdvice = async () => {
    if (!weatherData) return;

    setLoading(true);
    setError(null);

    try {
      // Get farmer's crops count
      const cropsRes = await cropService.getCrops();
      if (cropsRes.success && cropsRes.data) {
        setCropsCount(cropsRes.data.length);
      }

      // Get AI weather advice
      const adviceRes = await weatherAdvisoryService.getWeatherAdvice(weatherData);
      if (adviceRes.success && adviceRes.data) {
        setAdvice(adviceRes.data);
      } else {
        setError(adviceRes.error || 'Failed to generate recommendations');
      }
    } catch (err) {
      console.error('Error fetching advice:', err);
      setError('Error generating recommendations');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            AI Crop Advisory
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!advice) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Lightbulb size={16} className="text-amber-500" />
            AI Crop Advisory
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-sm text-red-600">{error}</div>
          ) : (
            <div className="text-sm text-gray-600">
              {cropsCount === 0 ? 'Add crops to get AI recommendations' : 'No recommendations available'}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Lightbulb size={16} className="text-amber-500" />
          AI Crop Advisory
        </CardTitle>
        <button
          onClick={fetchAdvice}
          disabled={loading}
          className="p-1 hover:bg-gray-100 rounded disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Summary */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5">
          <p className="text-sm font-medium text-amber-900">{advice.summary}</p>
        </div>

        {/* Today's Actions */}
        {advice.todayActions.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <Leaf size={12} /> Today's Actions
            </h4>
            <ul className="space-y-1">
              {advice.todayActions.map((action, i) => (
                <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                  <span className="text-green-500 font-bold">✓</span>
                  <span>{action}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Alerts */}
        {advice.riskAlerts.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
              <AlertTriangle size={12} /> Alerts
            </h4>
            <div className="space-y-1">
              {advice.riskAlerts.map((alert, i) => (
                <div
                  key={i}
                  className={`text-xs p-1.5 rounded border ${
                    alert.severity === 'high'
                      ? 'bg-red-50 border-red-200 text-red-700'
                      : alert.severity === 'medium'
                      ? 'bg-yellow-50 border-yellow-200 text-yellow-700'
                      : 'bg-blue-50 border-blue-200 text-blue-700'
                  }`}
                >
                  {alert.alert}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Monitoring Items */}
        {advice.monitoring.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-gray-700 mb-1.5">Monitor</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {advice.monitoring.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Crops Tracked */}
        {advice.cropsCount !== undefined && (
          <div className="text-xs text-gray-500 pt-2 border-t">
            Tracking {advice.cropsCount} crop{advice.cropsCount !== 1 ? 's' : ''}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
