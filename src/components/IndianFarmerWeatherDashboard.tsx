/**
 * Indian Farmer Weather Dashboard - Complete Single File Component
 * Updated with Tailwind CSS for proper mobile responsiveness
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Wind, Droplets, Sun, Eye, Sunrise, Sunset,
  RefreshCw, Globe, Search, MapPin, Star, X, ChevronDown,
  Bug, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr';

interface WeatherData {
  current: {
    temperature: number;
    feelsLike: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    weatherCode: number;
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
    admin1?: string;
    country?: string;
  };
}

interface LocationResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  admin1?: string;
  admin2?: string;
  country: string;
  countryCode: string;
}

interface SavedLocation {
  name: string;
  lat: number;
  lon: number;
  admin1?: string;
  country?: string;
}

interface UserPreferences {
  language: Language;
  savedLocations: SavedLocation[];
  lastLocation: SavedLocation | null;
}

// ============================================================================
// TRANSLATIONS (Simplified for key items)
// ============================================================================

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "Kisan Weather",
    searchPlaceholder: "Search village, city, district...",
    todayHighlight: "Today's Highlights",
    windStatus: "Wind",
    humidity: "Humidity",
    uvIndex: "UV Index",
    visibility: "Visibility",
    sunrise: "Sunrise",
    sunset: "Sunset",
    nearbyDistricts: "Nearby Districts",
    seeAll: "See All",
    dayForecast: "7 Day Forecast",
    feelsLike: "Feels like",
    cropAdvisory: "Crop Advisory",
    irrigationAlert: "Irrigation Alert",
    pestAlert: "Pest & Disease Alert",
    goodHumidity: "Good for crops",
    moderateHumidity: "Moderate",
    lowHumidity: "Low - irrigate",
    highHumidity: "High - disease risk",
    lowUV: "Low UV",
    moderateUV: "Moderate UV",
    highUV: "High UV",
    veryHighUV: "Very High UV",
    waterToday: "Water your crops today",
    skipIrrigation: "Skip irrigation - rain expected",
    idealIrrigation: "Ideal for irrigation",
    pestRisk: "High pest risk",
    noPestRisk: "Low pest risk",
    fungalRisk: "Fungal disease risk",
    sowingAdvice: "Good weather for sowing",
    today: "Today",
    loading: "Loading...",
    error: "Error loading data",
    retry: "Retry",
    kmh: "km/h",
    km: "km",
  },
  hi: {
    appTitle: "किसान मौसम",
    searchPlaceholder: "गाँव, शहर, जिला खोजें...",
    todayHighlight: "आज की मुख्य बातें",
    windStatus: "हवा",
    humidity: "आर्द्रता",
    uvIndex: "यूवी",
    visibility: "दृश्यता",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    nearbyDistricts: "आसपास के जिले",
    seeAll: "सभी देखें",
    dayForecast: "7 दिन का पूर्वानुमान",
    feelsLike: "महसूस",
    cropAdvisory: "फसल सलाह",
    irrigationAlert: "सिंचाई अलर्ट",
    pestAlert: "कीट चेतावनी",
    goodHumidity: "फसलों के लिए अच्छा",
    moderateHumidity: "सामान्य",
    lowHumidity: "कम - सिंचाई करें",
    highHumidity: "अधिक - रोग का खतरा",
    lowUV: "कम यूवी",
    moderateUV: "मध्यम यूवी",
    highUV: "उच्च यूवी",
    veryHighUV: "बहुत उच्च यूवी",
    waterToday: "आज फसलों को पानी दें",
    skipIrrigation: "सिंचाई छोड़ें - बारिश",
    idealIrrigation: "सिंचाई के लिए आदर्श",
    pestRisk: "कीट का खतरा",
    noPestRisk: "कीट का खतरा कम",
    fungalRisk: "फफूंद का खतरा",
    sowingAdvice: "बुवाई के लिए अच्छा",
    today: "आज",
    loading: "लोड हो रहा है...",
    error: "त्रुटि",
    retry: "पुनः प्रयास",
    kmh: "किमी/घं",
    km: "किमी",
  },
  ta: {
    appTitle: "விவசாயி வானிலை",
    searchPlaceholder: "தேடுங்கள்...",
    todayHighlight: "இன்றைய முக்கியம்",
    windStatus: "காற்று",
    humidity: "ஈரப்பதம்",
    uvIndex: "யூவி",
    visibility: "தெரிவு",
    sunrise: "சூரிய உதயம்",
    sunset: "சூரிய அஸ்தமனம்",
    nearbyDistricts: "அருகில்",
    seeAll: "அனைத்தும்",
    dayForecast: "7 நாள் முன்னறிவிப்பு",
    feelsLike: "உணர்வு",
    cropAdvisory: "பயிர் ஆலோசனை",
    irrigationAlert: "நீர்ப்பாசனம்",
    pestAlert: "பூச்சி எச்சரிக்கை",
    goodHumidity: "நல்லது",
    moderateHumidity: "மிதமான",
    lowHumidity: "குறைவு",
    highHumidity: "அதிகம்",
    lowUV: "குறைந்த யூவி",
    moderateUV: "மிதமான யூவி",
    highUV: "உயர் யூவி",
    veryHighUV: "மிக உயர் யூவி",
    waterToday: "நீர் ஊற்றுங்கள்",
    skipIrrigation: "தவிர்க்கவும்",
    idealIrrigation: "ஏற்றது",
    pestRisk: "பூச்சி ஆபத்து",
    noPestRisk: "குறைவு",
    fungalRisk: "பூஞ்சை ஆபத்து",
    sowingAdvice: "விதைப்பு நல்லது",
    today: "இன்று",
    loading: "ஏற்றுகிறது...",
    error: "பிழை",
    retry: "மீண்டும்",
    kmh: "கிமீ/ம",
    km: "கிமீ",
  },
  te: {
    appTitle: "రైతు వాతావరణం",
    searchPlaceholder: "వెతకండి...",
    todayHighlight: "ముఖ్యాంశాలు",
    windStatus: "గాలి",
    humidity: "తేమ",
    uvIndex: "యువి",
    visibility: "దృశ్యత",
    sunrise: "సూర్యోదయం",
    sunset: "సూర్యాస్తమయం",
    nearbyDistricts: "సమీపంలో",
    seeAll: "చూడండి",
    dayForecast: "7 రోజుల అంచనా",
    feelsLike: "అనిపిస్తుంది",
    cropAdvisory: "పంట సలహా",
    irrigationAlert: "నీటిపారుదల",
    pestAlert: "తెగుళ్ళ హెచ్చరిక",
    goodHumidity: "మంచిది",
    moderateHumidity: "మధ్యస్థం",
    lowHumidity: "తక్కువ",
    highHumidity: "ఎక్కువ",
    lowUV: "తక్కువ యువి",
    moderateUV: "మధ్యస్థ యువి",
    highUV: "అధిక యువి",
    veryHighUV: "చాలా అధిక",
    waterToday: "నీరు పెట్టండి",
    skipIrrigation: "వదిలేయండి",
    idealIrrigation: "అనువైన",
    pestRisk: "తెగుళ్ళ ప్రమాదం",
    noPestRisk: "తక్కువ ప్రమాదం",
    fungalRisk: "ఫంగల్ ప్రమాదం",
    sowingAdvice: "మంచి వాతావరణం",
    today: "ఈరోజు",
    loading: "లోడ్...",
    error: "లోపం",
    retry: "మళ్ళీ",
    kmh: "కిమీ/గం",
    km: "కిమీ",
  },
  bn: {
    appTitle: "কৃষক আবহাওয়া",
    searchPlaceholder: "খুঁজুন...",
    todayHighlight: "আজকের হাইলাইট",
    windStatus: "বাতাস",
    humidity: "আর্দ্রতা",
    uvIndex: "ইউভি",
    visibility: "দৃশ্যমান",
    sunrise: "সূর্যোদয়",
    sunset: "সূর্যাস্ত",
    nearbyDistricts: "নিকটবর্তী",
    seeAll: "সব দেখুন",
    dayForecast: "৭ দিনের পূর্বাভাস",
    feelsLike: "অনুভূতি",
    cropAdvisory: "ফসল পরামর্শ",
    irrigationAlert: "সেচ সতর্কতা",
    pestAlert: "কীট সতর্কতা",
    goodHumidity: "ভালো",
    moderateHumidity: "মাঝারি",
    lowHumidity: "কম",
    highHumidity: "বেশি",
    lowUV: "কম ইউভি",
    moderateUV: "মাঝারি ইউভি",
    highUV: "উচ্চ ইউভি",
    veryHighUV: "অত্যন্ত উচ্চ",
    waterToday: "জল দিন",
    skipIrrigation: "বাদ দিন",
    idealIrrigation: "আদর্শ",
    pestRisk: "কীট ঝুঁকি",
    noPestRisk: "কম ঝুঁকি",
    fungalRisk: "ছত্রাক ঝুঁকি",
    sowingAdvice: "ভালো আবহাওয়া",
    today: "আজ",
    loading: "লোড হচ্ছে...",
    error: "ত্রুটি",
    retry: "আবার",
    kmh: "কিমি/ঘ",
    km: "কিমি",
  },
  mr: {
    appTitle: "शेतकरी हवामान",
    searchPlaceholder: "शोधा...",
    todayHighlight: "आजचे ठळक",
    windStatus: "वारा",
    humidity: "आर्द्रता",
    uvIndex: "यूवी",
    visibility: "दृश्यमानता",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    nearbyDistricts: "जवळचे",
    seeAll: "सर्व",
    dayForecast: "7 दिवस",
    feelsLike: "जाणवते",
    cropAdvisory: "पीक सल्ला",
    irrigationAlert: "सिंचन",
    pestAlert: "कीड इशारा",
    goodHumidity: "चांगले",
    moderateHumidity: "मध्यम",
    lowHumidity: "कमी",
    highHumidity: "जास्त",
    lowUV: "कमी यूवी",
    moderateUV: "मध्यम यूवी",
    highUV: "उच्च यूवी",
    veryHighUV: "अत्यंत उच्च",
    waterToday: "पाणी द्या",
    skipIrrigation: "टाळा",
    idealIrrigation: "आदर्श",
    pestRisk: "कीड धोका",
    noPestRisk: "कमी धोका",
    fungalRisk: "बुरशी धोका",
    sowingAdvice: "चांगले हवामान",
    today: "आज",
    loading: "लोड...",
    error: "त्रुटी",
    retry: "पुन्हा",
    kmh: "किमी/ता",
    km: "किमी",
  },
};

const languageNames: Record<Language, string> = {
  en: 'English',
  hi: 'हिंदी',
  ta: 'தமிழ்',
  te: 'తెలుగు',
  bn: 'বাংলা',
  mr: 'मराठी',
};

// ============================================================================
// WEATHER UTILITIES
// ============================================================================

const weatherCodes: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  80: { description: 'Rain showers', icon: '🌦️' },
  81: { description: 'Moderate showers', icon: '🌧️' },
  82: { description: 'Heavy showers', icon: '⛈️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm + hail', icon: '⛈️' },
  99: { description: 'Heavy thunderstorm', icon: '⛈️' },
};

function getWeatherDescription(code: number): string {
  return weatherCodes[code]?.description || 'Unknown';
}

function getWeatherIcon(code: number, isDay: boolean = true): string {
  if (!isDay && code === 0) return '🌙';
  if (!isDay && code <= 2) return '🌙';
  return weatherCodes[code]?.icon || '🌡️';
}

function getWindDirection(degrees: number): string {
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return directions[Math.round(degrees / 45) % 8];
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  return `${hours % 12 || 12}:${minutes} ${period}`;
}

function getDayName(dateString: string): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[new Date(dateString).getDay()];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

const indianDistricts = [
  { name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lon: 72.8777 },
  { name: 'Delhi', state: 'Delhi', lat: 28.6139, lon: 77.209 },
  { name: 'Bangalore', state: 'Karnataka', lat: 12.9716, lon: 77.5946 },
  { name: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lon: 80.2707 },
  { name: 'Kolkata', state: 'West Bengal', lat: 22.5726, lon: 88.3639 },
  { name: 'Hyderabad', state: 'Telangana', lat: 17.385, lon: 78.4867 },
  { name: 'Pune', state: 'Maharashtra', lat: 18.5204, lon: 73.8567 },
  { name: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lon: 72.5714 },
  { name: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lon: 75.7873 },
  { name: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lon: 80.9462 },
];

function getNearbyDistricts(lat: number, lon: number, count: number = 4) {
  return indianDistricts
    .map(d => ({ ...d, distance: Math.sqrt(Math.pow(d.lat - lat, 2) + Math.pow(d.lon - lon, 2)) }))
    .sort((a, b) => a.distance - b.distance)
    .slice(1, count + 1);
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const OPEN_METEO_API = 'https://api.open-meteo.com/v1/forecast';
const GEOCODING_API = 'https://geocoding-api.open-meteo.com/v1/search';
const STORAGE_KEY = 'kisan-weather-prefs';

const defaultPreferences: UserPreferences = {
  language: 'en',
  savedLocations: [],
  lastLocation: null,
};

function useLocalStorage() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setPreferences(JSON.parse(stored));
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
    setLoaded(true);
  }, []);

  const savePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...newPrefs };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setLanguage = useCallback((language: Language) => savePreferences({ language }), [savePreferences]);

  const saveLocation = useCallback((location: SavedLocation) => {
    setPreferences(prev => {
      if (prev.savedLocations.some(l => l.lat === location.lat && l.lon === location.lon)) return prev;
      const updated = { ...prev, savedLocations: [...prev.savedLocations, location] };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeLocation = useCallback((lat: number, lon: number) => {
    setPreferences(prev => {
      const updated = { ...prev, savedLocations: prev.savedLocations.filter(l => !(l.lat === lat && l.lon === lon)) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const setLastLocation = useCallback((location: SavedLocation | null) => savePreferences({ lastLocation: location }), [savePreferences]);

  return { preferences, loaded, setLanguage, saveLocation, removeLocation, setLastLocation };
}

function useWeather(lat: number | null, lon: number | null) {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (lat === null || lon === null) return;
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,uv_index,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
        timezone: 'Asia/Kolkata',
        forecast_days: '7',
      });

      const response = await fetch(`${OPEN_METEO_API}?${params}`);
      if (!response.ok) throw new Error('Failed to fetch weather');

      const result = await response.json();
      setData({
        current: {
          temperature: Math.round(result.current.temperature_2m),
          feelsLike: Math.round(result.current.apparent_temperature),
          humidity: result.current.relative_humidity_2m,
          windSpeed: result.current.wind_speed_10m,
          windDirection: result.current.wind_direction_10m,
          weatherCode: result.current.weather_code,
          uvIndex: result.current.uv_index || 0,
          visibility: 10,
          isDay: result.current.is_day === 1,
        },
        daily: result.daily.time.map((date: string, i: number) => ({
          date,
          tempMax: Math.round(result.daily.temperature_2m_max[i]),
          tempMin: Math.round(result.daily.temperature_2m_min[i]),
          weatherCode: result.daily.weather_code[i],
          precipitationProbability: result.daily.precipitation_probability_max[i] || 0,
          sunrise: result.daily.sunrise[i],
          sunset: result.daily.sunset[i],
        })),
        location: { name: '', lat, lon },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => { fetchWeather(); }, [fetchWeather]);
  return { data, loading, error, refetch: fetchWeather };
}

function useLocationSearch() {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) { setResults([]); return; }
    setLoading(true);
    try {
      const response = await fetch(`${GEOCODING_API}?name=${query}&count=10&language=en&format=json`);
      const data = await response.json();
      if (data.results) {
        setResults(data.results.sort((a: LocationResult, b: LocationResult) =>
          (a.country === 'India' ? -1 : 1) - (b.country === 'India' ? -1 : 1)
        ));
      } else setResults([]);
    } catch { setResults([]); }
    finally { setLoading(false); }
  }, []);

  return { results, loading, search };
}

function useMultipleWeather(locations: { name: string; lat: number; lon: number }[]) {
  const [data, setData] = useState<Map<string, WeatherData>>(new Map());
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (locations.length === 0) return;
    setLoading(true);

    const promises = locations.map(async (loc) => {
      try {
        const params = new URLSearchParams({
          latitude: loc.lat.toString(),
          longitude: loc.lon.toString(),
          current: 'temperature_2m,weather_code,is_day',
          timezone: 'Asia/Kolkata',
        });
        const response = await fetch(`${OPEN_METEO_API}?${params}`);
        const result = await response.json();
        return {
          name: loc.name,
          data: {
            current: {
              temperature: Math.round(result.current.temperature_2m),
              feelsLike: Math.round(result.current.temperature_2m),
              humidity: 0, windSpeed: 0, windDirection: 0,
              weatherCode: result.current.weather_code,
              uvIndex: 0, visibility: 10,
              isDay: result.current.is_day === 1,
            },
            daily: [],
            location: { name: loc.name, lat: loc.lat, lon: loc.lon },
          } as WeatherData,
        };
      } catch { return null; }
    });

    const results = await Promise.all(promises);
    const newData = new Map<string, WeatherData>();
    results.forEach(r => r && newData.set(r.name, r.data));
    setData(newData);
    setLoading(false);
  }, [locations]);

  useEffect(() => { fetchAll(); }, [fetchAll]);
  return { data, loading, refetch: fetchAll };
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DEFAULT_LOCATION = { name: 'Delhi', lat: 28.6139, lon: 77.209, admin1: 'Delhi', country: 'India' };

export default function IndianFarmerWeatherDashboard() {
  const { preferences, loaded, setLanguage, saveLocation, removeLocation, setLastLocation } = useLocalStorage();
  const [currentLocation, setCurrentLocation] = useState(preferences.lastLocation || DEFAULT_LOCATION);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const { results, search } = useLocationSearch();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loaded && preferences.lastLocation) setCurrentLocation(preferences.lastLocation);
  }, [loaded, preferences.lastLocation]);

  const { data, loading, error, refetch } = useWeather(currentLocation.lat, currentLocation.lon);
  const nearbyDistricts = useMemo(() => getNearbyDistricts(currentLocation.lat, currentLocation.lon, 4), [currentLocation]);
  const { data: nearbyWeather, loading: nearbyLoading } = useMultipleWeather(nearbyDistricts);

  const t = translations[preferences.language];

  useEffect(() => {
    const timer = setTimeout(() => search(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, search]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSearch(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLocationSelect = (loc: SavedLocation) => {
    setCurrentLocation(loc);
    setLastLocation(loc);
    setSearchQuery('');
    setShowSearch(false);
  };

  if (!loaded) return <div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌾</span>
            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              {t.appTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div ref={searchRef} className="relative flex-1 sm:flex-initial">
              <div className="flex items-center bg-white rounded-lg border px-3 py-2 gap-2">
                <MapPin size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                  onFocus={() => setShowSearch(true)}
                  className="bg-transparent outline-none text-sm w-full min-w-[150px]"
                />
                {searchQuery && <X size={14} className="text-gray-400 cursor-pointer" onClick={() => setSearchQuery('')} />}
              </div>

              {showSearch && results.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-60 overflow-y-auto">
                  {results.map(r => (
                    <button
                      key={r.id}
                      onClick={() => handleLocationSelect({ name: r.name, lat: r.latitude, lon: r.longitude, admin1: r.admin1, country: r.country })}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-sm"
                    >
                      <MapPin size={14} className="text-gray-400" />
                      <div>
                        <div className="font-medium">{r.name}</div>
                        <div className="text-xs text-gray-500">{r.admin1}, {r.country}</div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current Location Display */}
            <div className="hidden sm:flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={14} className="text-blue-500" />
              <span className="font-medium">{currentLocation.name}</span>
            </div>

            {/* Refresh */}
            <button onClick={refetch} disabled={loading} className="p-2 bg-white rounded-lg border hover:bg-gray-50 disabled:opacity-50">
              <RefreshCw size={18} className={`text-blue-500 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {/* Language */}
            <div className="relative">
              <button onClick={() => setShowLangMenu(!showLangMenu)} className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg border text-sm">
                <Globe size={14} className="text-blue-500" />
                <span>{languageNames[preferences.language]}</span>
              </button>
              {showLangMenu && (
                <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 min-w-[120px]">
                  {(Object.keys(languageNames) as Language[]).map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setShowLangMenu(false); }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${lang === preferences.language ? 'bg-blue-50 text-blue-600 font-medium' : ''}`}
                    >
                      {languageNames[lang]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Location Display */}
        <div className="sm:hidden flex items-center gap-1 text-sm text-gray-600">
          <MapPin size={14} className="text-blue-500" />
          <span className="font-medium">{currentLocation.name}</span>
          {currentLocation.admin1 && <span className="text-gray-400">, {currentLocation.admin1}</span>}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-600 text-sm">
            {t.error} <button onClick={refetch} className="underline ml-2">{t.retry}</button>
          </div>
        )}

        {/* Loading */}
        {loading && !data && (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full" />
          </div>
        )}

        {/* Main Content */}
        {data && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left Column */}
            <div className="space-y-4">

              {/* Current Weather */}
              <Card>
                <CardContent className="p-4">
                  <div className="text-lg font-bold">{getDayName(new Date().toISOString())}</div>
                  <div className="text-sm text-gray-500 mb-4">{formatDate(new Date().toISOString())}</div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-5xl">{getWeatherIcon(data.current.weatherCode, data.current.isDay)}</span>
                      <div>
                        <div className="text-4xl font-bold">{data.current.temperature}°C</div>
                        <div className="text-gray-500">/{data.daily[0]?.tempMin}°C</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{getWeatherDescription(data.current.weatherCode)}</div>
                      <div className="text-sm text-gray-500">{t.feelsLike} {data.current.feelsLike}°C</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Nearby Districts */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    {t.nearbyDistricts}
                    <ChevronDown size={16} className="text-blue-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {nearbyDistricts.map(d => {
                    const weather = nearbyWeather.get(d.name);
                    return (
                      <button
                        key={d.name}
                        onClick={() => handleLocationSelect({ name: d.name, lat: d.lat, lon: d.lon, admin1: d.state })}
                        className="w-full flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                      >
                        <div className="text-left">
                          <div className="text-xs text-gray-500">{d.state}</div>
                          <div className="font-medium text-sm">{d.name}</div>
                        </div>
                        {weather && (
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{getWeatherIcon(weather.current.weatherCode, weather.current.isDay)}</span>
                            <span className="font-bold">{weather.current.temperature}°</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 space-y-4">

              {/* Today's Highlights */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t.todayHighlight}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {/* Wind */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <Wind size={12} /> {t.windStatus}
                      </div>
                      <div className="text-xl font-bold">{data.current.windSpeed.toFixed(1)} <span className="text-sm font-normal">{t.kmh}</span></div>
                      <div className="text-xs text-gray-500">{getWindDirection(data.current.windDirection)}</div>
                    </div>

                    {/* Humidity */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <Droplets size={12} /> {t.humidity}
                      </div>
                      <div className="text-xl font-bold">{data.current.humidity}<span className="text-sm font-normal">%</span></div>
                      <div className={`text-xs ${data.current.humidity > 70 ? 'text-orange-500' : data.current.humidity < 40 ? 'text-yellow-500' : 'text-green-500'}`}>
                        {data.current.humidity > 70 ? t.highHumidity : data.current.humidity < 40 ? t.lowHumidity : t.goodHumidity}
                      </div>
                    </div>

                    {/* Sunrise */}
                    <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-amber-700 text-xs mb-1">
                        <Sunrise size={12} /> {t.sunrise}
                      </div>
                      <div className="text-lg font-bold text-amber-800">{formatTime(data.daily[0]?.sunrise || '')}</div>
                    </div>

                    {/* UV Index */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <Sun size={12} /> {t.uvIndex}
                      </div>
                      <div className="text-xl font-bold">{Math.round(data.current.uvIndex)}</div>
                      <div className={`text-xs ${data.current.uvIndex > 7 ? 'text-red-500' : data.current.uvIndex > 5 ? 'text-orange-500' : 'text-green-500'}`}>
                        {data.current.uvIndex > 7 ? t.veryHighUV : data.current.uvIndex > 5 ? t.highUV : data.current.uvIndex > 2 ? t.moderateUV : t.lowUV}
                      </div>
                    </div>

                    {/* Visibility */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
                        <Eye size={12} /> {t.visibility}
                      </div>
                      <div className="text-xl font-bold">{data.current.visibility} <span className="text-sm font-normal">{t.km}</span></div>
                    </div>

                    {/* Sunset */}
                    <div className="bg-gradient-to-br from-orange-100 to-red-100 rounded-lg p-3">
                      <div className="flex items-center gap-1 text-red-700 text-xs mb-1">
                        <Sunset size={12} /> {t.sunset}
                      </div>
                      <div className="text-lg font-bold text-red-800">{formatTime(data.daily[0]?.sunset || '')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 7 Day Forecast */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t.dayForecast}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {data.daily.map((day, i) => (
                      <div
                        key={day.date}
                        className={`flex-shrink-0 flex flex-col items-center p-3 rounded-lg min-w-[70px] ${i === 0 ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
                      >
                        <span className={`text-xs font-medium ${i === 0 ? 'text-white' : 'text-gray-500'}`}>
                          {i === 0 ? t.today : getDayName(day.date)}
                        </span>
                        <span className="text-2xl my-1">{getWeatherIcon(day.weatherCode, true)}</span>
                        <span className="font-bold">{day.tempMax}°</span>
                        {day.precipitationProbability > 20 && (
                          <div className={`flex items-center gap-1 text-xs ${i === 0 ? 'text-blue-100' : 'text-blue-500'}`}>
                            💧 {day.precipitationProbability}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Farming Advisory */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Crop Advisory */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <CheckCircle size={16} className="text-green-600" />
                    </div>
                    <span className="font-medium text-sm">{t.cropAdvisory}</span>
                  </div>
                  <p className="text-sm text-green-700">{t.sowingAdvice}</p>
                </div>

                {/* Irrigation */}
                <div className={`${data.daily[0]?.precipitationProbability > 50 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'} border rounded-lg p-3`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 ${data.daily[0]?.precipitationProbability > 50 ? 'bg-blue-100' : 'bg-orange-100'} rounded-lg`}>
                      <Droplets size={16} className={data.daily[0]?.precipitationProbability > 50 ? 'text-blue-600' : 'text-orange-600'} />
                    </div>
                    <span className="font-medium text-sm">{t.irrigationAlert}</span>
                  </div>
                  <p className={`text-sm ${data.daily[0]?.precipitationProbability > 50 ? 'text-blue-700' : 'text-orange-700'}`}>
                    {data.daily[0]?.precipitationProbability > 50 ? t.skipIrrigation : t.waterToday}
                  </p>
                </div>

                {/* Pest Alert */}
                <div className={`${data.current.humidity > 80 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} border rounded-lg p-3`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`p-1.5 ${data.current.humidity > 80 ? 'bg-red-100' : 'bg-green-100'} rounded-lg`}>
                      <Bug size={16} className={data.current.humidity > 80 ? 'text-red-600' : 'text-green-600'} />
                    </div>
                    <span className="font-medium text-sm">{t.pestAlert}</span>
                  </div>
                  <p className={`text-sm ${data.current.humidity > 80 ? 'text-red-700' : 'text-green-700'}`}>
                    {data.current.humidity > 80 ? t.fungalRisk : t.noPestRisk}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 pt-4 border-t">
          Powered by Open-Meteo API
        </div>
      </div>
    </div>
  );
}
