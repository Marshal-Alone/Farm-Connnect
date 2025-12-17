/**
 * Indian Farmer Weather Dashboard - Complete Single File Component
 * 
 * This is a self-contained weather dashboard for Indian farmers.
 * Features: Real-time weather, farming advisories, multi-language support, location search.
 * 
 * Dependencies required:
 * - lucide-react
 * - tailwindcss (with proper config)
 * 
 * Usage: <IndianFarmerWeatherDashboard />
 */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Wind, Droplets, Sun, Eye, Sunrise, Sunset, 
  RefreshCw, Globe, Search, MapPin, Star, X, ChevronDown,
  Sprout, Bug, AlertTriangle, CheckCircle
} from 'lucide-react';

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
// TRANSLATIONS
// ============================================================================

const translations: Record<Language, Record<string, string>> = {
  en: {
    appTitle: "Kisan Weather",
    searchPlaceholder: "Search village, city, district...",
    todayHighlight: "Today's Highlights",
    windStatus: "Wind Status",
    humidity: "Humidity",
    uvIndex: "UV Index",
    visibility: "Visibility",
    sunrise: "Sunrise",
    sunset: "Sunset",
    nearbyDistricts: "Nearby Districts",
    seeAll: "See All",
    dayForecast: "10 Day Forecast",
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
    highUV: "High UV - Avoid work",
    veryHighUV: "Very High UV",
    waterToday: "Water your crops today",
    skipIrrigation: "Skip irrigation - rain expected",
    idealIrrigation: "Ideal conditions for irrigation",
    pestRisk: "High pest risk due to humidity",
    noPestRisk: "Low pest risk",
    fungalRisk: "Fungal disease risk - check crops",
    sowingAdvice: "Good weather for sowing",
    harvestAdvice: "Ideal for harvesting",
    sprayAdvice: "Good conditions for spraying",
    noSpray: "Avoid spraying - windy",
    stayIndoors: "Extreme weather - stay indoors",
    today: "Today",
    savedLocations: "Saved Locations",
    save: "Save",
    remove: "Remove",
    loading: "Loading...",
    error: "Error loading data",
    retry: "Retry",
    language: "Language",
    kmh: "km/h",
    km: "km",
  },
  hi: {
    appTitle: "किसान मौसम",
    searchPlaceholder: "गाँव, शहर, जिला खोजें...",
    todayHighlight: "आज की मुख्य बातें",
    windStatus: "हवा की स्थिति",
    humidity: "आर्द्रता",
    uvIndex: "यूवी सूचकांक",
    visibility: "दृश्यता",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    nearbyDistricts: "आसपास के जिले",
    seeAll: "सभी देखें",
    dayForecast: "10 दिन का पूर्वानुमान",
    feelsLike: "महसूस होता है",
    cropAdvisory: "फसल सलाह",
    irrigationAlert: "सिंचाई अलर्ट",
    pestAlert: "कीट और रोग चेतावनी",
    goodHumidity: "फसलों के लिए अच्छा",
    moderateHumidity: "सामान्य",
    lowHumidity: "कम - सिंचाई करें",
    highHumidity: "अधिक - रोग का खतरा",
    lowUV: "कम यूवी",
    moderateUV: "मध्यम यूवी",
    highUV: "उच्च यूवी - काम से बचें",
    veryHighUV: "बहुत उच्च यूवी",
    waterToday: "आज फसलों को पानी दें",
    skipIrrigation: "सिंचाई छोड़ें - बारिश की संभावना",
    idealIrrigation: "सिंचाई के लिए आदर्श",
    pestRisk: "आर्द्रता के कारण कीट का खतरा",
    noPestRisk: "कीट का खतरा कम",
    fungalRisk: "फफूंद रोग का खतरा - फसल जांचें",
    sowingAdvice: "बुवाई के लिए अच्छा मौसम",
    harvestAdvice: "कटाई के लिए आदर्श",
    sprayAdvice: "छिड़काव के लिए अच्छी स्थिति",
    noSpray: "छिड़काव से बचें - हवा",
    stayIndoors: "अत्यधिक मौसम - घर में रहें",
    today: "आज",
    savedLocations: "सहेजे गए स्थान",
    save: "सहेजें",
    remove: "हटाएं",
    loading: "लोड हो रहा है...",
    error: "डेटा लोड करने में त्रुटि",
    retry: "पुनः प्रयास",
    language: "भाषा",
    kmh: "किमी/घं",
    km: "किमी",
  },
  ta: {
    appTitle: "விவசாயி வானிலை",
    searchPlaceholder: "கிராமம், நகரம், மாவட்டம் தேடுங்கள்...",
    todayHighlight: "இன்றைய சிறப்பம்சங்கள்",
    windStatus: "காற்று நிலை",
    humidity: "ஈரப்பதம்",
    uvIndex: "யூவி குறியீடு",
    visibility: "தெரிவுநிலை",
    sunrise: "சூரிய உதயம்",
    sunset: "சூரிய அஸ்தமனம்",
    nearbyDistricts: "அருகிலுள்ள மாவட்டங்கள்",
    seeAll: "அனைத்தும் காண்க",
    dayForecast: "10 நாள் முன்னறிவிப்பு",
    feelsLike: "உணர்வது",
    cropAdvisory: "பயிர் ஆலோசனை",
    irrigationAlert: "நீர்ப்பாசன எச்சரிக்கை",
    pestAlert: "பூச்சி மற்றும் நோய் எச்சரிக்கை",
    goodHumidity: "பயிர்களுக்கு நல்லது",
    moderateHumidity: "மிதமான",
    lowHumidity: "குறைவு - நீர்ப்பாசனம் செய்யுங்கள்",
    highHumidity: "அதிகம் - நோய் ஆபத்து",
    lowUV: "குறைந்த யூவி",
    moderateUV: "மிதமான யூவி",
    highUV: "உயர் யூவி - வேலை தவிர்க்கவும்",
    veryHighUV: "மிக உயர் யூவி",
    waterToday: "இன்று பயிர்களுக்கு நீர் ஊற்றுங்கள்",
    skipIrrigation: "நீர்ப்பாசனம் தவிர்க்கவும் - மழை எதிர்பார்க்கப்படுகிறது",
    idealIrrigation: "நீர்ப்பாசனத்திற்கு ஏற்ற நிலை",
    pestRisk: "ஈரப்பதத்தால் பூச்சி ஆபத்து",
    noPestRisk: "குறைந்த பூச்சி ஆபத்து",
    fungalRisk: "பூஞ்சை நோய் ஆபத்து - பயிர்களை சோதிக்கவும்",
    sowingAdvice: "விதைப்புக்கு நல்ல வானிலை",
    harvestAdvice: "அறுவடைக்கு ஏற்றது",
    sprayAdvice: "தெளிப்புக்கு நல்ல நிலை",
    noSpray: "தெளிப்பு தவிர்க்கவும் - காற்று",
    stayIndoors: "தீவிர வானிலை - வீட்டில் இருங்கள்",
    today: "இன்று",
    savedLocations: "சேமித்த இடங்கள்",
    save: "சேமி",
    remove: "நீக்கு",
    loading: "ஏற்றுகிறது...",
    error: "தரவு ஏற்றுவதில் பிழை",
    retry: "மீண்டும் முயற்சி",
    language: "மொழி",
    kmh: "கிமீ/ம",
    km: "கிமீ",
  },
  te: {
    appTitle: "రైతు వాతావరణం",
    searchPlaceholder: "గ్రామం, నగరం, జిల్లా వెతకండి...",
    todayHighlight: "నేటి ముఖ్యాంశాలు",
    windStatus: "గాలి స్థితి",
    humidity: "తేమ",
    uvIndex: "యువి సూచిక",
    visibility: "దృశ్యత",
    sunrise: "సూర్యోదయం",
    sunset: "సూర్యాస్తమయం",
    nearbyDistricts: "సమీప జిల్లాలు",
    seeAll: "అన్నీ చూడండి",
    dayForecast: "10 రోజుల అంచనా",
    feelsLike: "అనిపిస్తుంది",
    cropAdvisory: "పంట సలహా",
    irrigationAlert: "నీటిపారుదల హెచ్చరిక",
    pestAlert: "తెగుళ్ళు & వ్యాధి హెచ్చరిక",
    goodHumidity: "పంటలకు మంచిది",
    moderateHumidity: "మధ్యస్థం",
    lowHumidity: "తక్కువ - నీరు పెట్టండి",
    highHumidity: "ఎక్కువ - వ్యాధి ప్రమాదం",
    lowUV: "తక్కువ యువి",
    moderateUV: "మధ్యస్థ యువి",
    highUV: "అధిక యువి - పని మానుకోండి",
    veryHighUV: "చాలా అధిక యువి",
    waterToday: "ఈరోజు పంటలకు నీరు పెట్టండి",
    skipIrrigation: "నీటిపారుదల వదిలేయండి - వర్షం",
    idealIrrigation: "నీటిపారుదలకు అనువైన పరిస్థితులు",
    pestRisk: "తేమ వల్ల తెగుళ్ళ ప్రమాదం",
    noPestRisk: "తక్కువ తెగుళ్ళ ప్రమాదం",
    fungalRisk: "ఫంగల్ వ్యాధి ప్రమాదం",
    sowingAdvice: "విత్తనానికి మంచి వాతావరణం",
    harvestAdvice: "కోతకు అనువైనది",
    sprayAdvice: "స్ప్రే చేయడానికి మంచి పరిస్థితులు",
    noSpray: "స్ప్రే చేయకండి - గాలి",
    stayIndoors: "తీవ్ర వాతావరణం - ఇంట్లో ఉండండి",
    today: "ఈరోజు",
    savedLocations: "సేవ్ చేసిన స్థానాలు",
    save: "సేవ్",
    remove: "తొలగించు",
    loading: "లోడ్ అవుతోంది...",
    error: "డేటా లోడ్ లోపం",
    retry: "మళ్ళీ ప్రయత్నించు",
    language: "భాష",
    kmh: "కిమీ/గం",
    km: "కిమీ",
  },
  bn: {
    appTitle: "কৃষক আবহাওয়া",
    searchPlaceholder: "গ্রাম, শহর, জেলা খুঁজুন...",
    todayHighlight: "আজকের হাইলাইট",
    windStatus: "বাতাসের অবস্থা",
    humidity: "আর্দ্রতা",
    uvIndex: "ইউভি সূচক",
    visibility: "দৃশ্যমানতা",
    sunrise: "সূর্যোদয়",
    sunset: "সূর্যাস্ত",
    nearbyDistricts: "নিকটবর্তী জেলা",
    seeAll: "সব দেখুন",
    dayForecast: "১০ দিনের পূর্বাভাস",
    feelsLike: "অনুভূতি",
    cropAdvisory: "ফসল পরামর্শ",
    irrigationAlert: "সেচ সতর্কতা",
    pestAlert: "কীটপতঙ্গ ও রোগ সতর্কতা",
    goodHumidity: "ফসলের জন্য ভালো",
    moderateHumidity: "মাঝারি",
    lowHumidity: "কম - সেচ দিন",
    highHumidity: "বেশি - রোগের ঝুঁকি",
    lowUV: "কম ইউভি",
    moderateUV: "মাঝারি ইউভি",
    highUV: "উচ্চ ইউভি - কাজ এড়িয়ে চলুন",
    veryHighUV: "অত্যন্ত উচ্চ ইউভি",
    waterToday: "আজ ফসলে জল দিন",
    skipIrrigation: "সেচ বাদ দিন - বৃষ্টি আসছে",
    idealIrrigation: "সেচের জন্য আদর্শ অবস্থা",
    pestRisk: "আর্দ্রতার কারণে কীটপতঙ্গের ঝুঁকি",
    noPestRisk: "কম কীটপতঙ্গ ঝুঁকি",
    fungalRisk: "ছত্রাক রোগের ঝুঁকি - ফসল পরীক্ষা করুন",
    sowingAdvice: "বীজ বপনের জন্য ভালো আবহাওয়া",
    harvestAdvice: "ফসল কাটার জন্য আদর্শ",
    sprayAdvice: "স্প্রে করার জন্য ভালো অবস্থা",
    noSpray: "স্প্রে এড়িয়ে চলুন - বাতাস",
    stayIndoors: "চরম আবহাওয়া - ঘরে থাকুন",
    today: "আজ",
    savedLocations: "সংরক্ষিত স্থান",
    save: "সংরক্ষণ",
    remove: "সরান",
    loading: "লোড হচ্ছে...",
    error: "ডেটা লোড ত্রুটি",
    retry: "পুনরায় চেষ্টা",
    language: "ভাষা",
    kmh: "কিমি/ঘ",
    km: "কিমি",
  },
  mr: {
    appTitle: "शेतकरी हवामान",
    searchPlaceholder: "गाव, शहर, जिल्हा शोधा...",
    todayHighlight: "आजचे ठळक मुद्दे",
    windStatus: "वाऱ्याची स्थिती",
    humidity: "आर्द्रता",
    uvIndex: "यूवी निर्देशांक",
    visibility: "दृश्यमानता",
    sunrise: "सूर्योदय",
    sunset: "सूर्यास्त",
    nearbyDistricts: "जवळचे जिल्हे",
    seeAll: "सर्व पहा",
    dayForecast: "१० दिवसांचा अंदाज",
    feelsLike: "जाणवते",
    cropAdvisory: "पीक सल्ला",
    irrigationAlert: "सिंचन इशारा",
    pestAlert: "कीड आणि रोग इशारा",
    goodHumidity: "पिकांसाठी चांगले",
    moderateHumidity: "मध्यम",
    lowHumidity: "कमी - पाणी द्या",
    highHumidity: "जास्त - रोगाचा धोका",
    lowUV: "कमी यूवी",
    moderateUV: "मध्यम यूवी",
    highUV: "उच्च यूवी - काम टाळा",
    veryHighUV: "अत्यंत उच्च यूवी",
    waterToday: "आज पिकांना पाणी द्या",
    skipIrrigation: "सिंचन टाळा - पाऊस अपेक्षित",
    idealIrrigation: "सिंचनासाठी आदर्श परिस्थिती",
    pestRisk: "आर्द्रतेमुळे कीडीचा धोका",
    noPestRisk: "कमी कीड धोका",
    fungalRisk: "बुरशीजन्य रोगाचा धोका",
    sowingAdvice: "पेरणीसाठी चांगले हवामान",
    harvestAdvice: "कापणीसाठी आदर्श",
    sprayAdvice: "फवारणीसाठी चांगली परिस्थिती",
    noSpray: "फवारणी टाळा - वारा",
    stayIndoors: "अत्यंत हवामान - घरात रहा",
    today: "आज",
    savedLocations: "जतन केलेले स्थान",
    save: "जतन करा",
    remove: "काढा",
    loading: "लोड होत आहे...",
    error: "डेटा लोड त्रुटी",
    retry: "पुन्हा प्रयत्न करा",
    language: "भाषा",
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
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌧️' },
  56: { description: 'Light freezing drizzle', icon: '🌨️' },
  57: { description: 'Dense freezing drizzle', icon: '🌨️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  66: { description: 'Light freezing rain', icon: '🌨️' },
  67: { description: 'Heavy freezing rain', icon: '🌨️' },
  71: { description: 'Slight snow', icon: '🌨️' },
  73: { description: 'Moderate snow', icon: '🌨️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '🌨️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌧️' },
  82: { description: 'Violent rain showers', icon: '⛈️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '❄️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
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
  const index = Math.round(degrees / 45) % 8;
  return directions[index];
}

function getHumidityStatus(humidity: number): 'good' | 'moderate' | 'low' | 'high' {
  if (humidity < 30) return 'low';
  if (humidity > 80) return 'high';
  if (humidity >= 50 && humidity <= 70) return 'good';
  return 'moderate';
}

function getUVStatus(uv: number): 'low' | 'moderate' | 'high' | 'veryHigh' {
  if (uv <= 2) return 'low';
  if (uv <= 5) return 'moderate';
  if (uv <= 7) return 'high';
  return 'veryHigh';
}

function formatTime(timeString: string): string {
  const date = new Date(timeString);
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes} ${period}`;
}

function getDayName(dateString: string, short: boolean = true): string {
  const date = new Date(dateString);
  const days = short 
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[date.getDay()];
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

// Indian districts data for nearby suggestions
const indianDistricts: { name: string; state: string; lat: number; lon: number }[] = [
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
  { name: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2599, lon: 77.4126 },
  { name: 'Patna', state: 'Bihar', lat: 25.5941, lon: 85.1376 },
  { name: 'Chandigarh', state: 'Punjab', lat: 30.7333, lon: 76.7794 },
  { name: 'Varanasi', state: 'Uttar Pradesh', lat: 25.3176, lon: 82.9739 },
  { name: 'Nagpur', state: 'Maharashtra', lat: 21.1458, lon: 79.0882 },
  { name: 'Indore', state: 'Madhya Pradesh', lat: 22.7196, lon: 75.8577 },
  { name: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0168, lon: 76.9558 },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.6868, lon: 83.2185 },
  { name: 'Thiruvananthapuram', state: 'Kerala', lat: 8.5241, lon: 76.9366 },
  { name: 'Guwahati', state: 'Assam', lat: 26.1445, lon: 91.7362 },
];

function getNearbyDistricts(lat: number, lon: number, count: number = 4): typeof indianDistricts {
  return indianDistricts
    .map(district => ({
      ...district,
      distance: Math.sqrt(Math.pow(district.lat - lat, 2) + Math.pow(district.lon - lon, 2))
    }))
    .sort((a, b) => a.distance - b.distance)
    .slice(1, count + 1);
}

// ============================================================================
// UTILITY FUNCTION
// ============================================================================

function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
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
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load preferences:', err);
    }
    setLoaded(true);
  }, []);

  const savePreferences = useCallback((newPrefs: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save preferences:', err);
      }
      return updated;
    });
  }, []);

  const setLanguage = useCallback((language: Language) => {
    savePreferences({ language });
  }, [savePreferences]);

  const saveLocation = useCallback((location: SavedLocation) => {
    setPreferences((prev) => {
      const exists = prev.savedLocations.some(
        (l) => l.lat === location.lat && l.lon === location.lon
      );
      if (exists) return prev;

      const updated = {
        ...prev,
        savedLocations: [...prev.savedLocations, location],
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save location:', err);
      }
      return updated;
    });
  }, []);

  const removeLocation = useCallback((lat: number, lon: number) => {
    setPreferences((prev) => {
      const updated = {
        ...prev,
        savedLocations: prev.savedLocations.filter(
          (l) => !(l.lat === lat && l.lon === lon)
        ),
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to remove location:', err);
      }
      return updated;
    });
  }, []);

  const setLastLocation = useCallback((location: SavedLocation | null) => {
    savePreferences({ lastLocation: location });
  }, [savePreferences]);

  return {
    preferences,
    loaded,
    setLanguage,
    saveLocation,
    removeLocation,
    setLastLocation,
  };
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
        forecast_days: '10',
      });

      const response = await fetch(`${OPEN_METEO_API}?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const result = await response.json();

      const weatherData: WeatherData = {
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
        daily: result.daily.time.map((date: string, index: number) => ({
          date,
          tempMax: Math.round(result.daily.temperature_2m_max[index]),
          tempMin: Math.round(result.daily.temperature_2m_min[index]),
          weatherCode: result.daily.weather_code[index],
          precipitationProbability: result.daily.precipitation_probability_max[index] || 0,
          sunrise: result.daily.sunrise[index],
          sunset: result.daily.sunset[index],
        })),
        location: {
          name: '',
          lat,
          lon,
        },
      };

      setData(weatherData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [lat, lon]);

  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  return { data, loading, error, refetch: fetchWeather };
}

function useLocationSearch() {
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string) => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);

    try {
      const params = new URLSearchParams({
        name: query,
        count: '10',
        language: 'en',
        format: 'json',
      });

      const response = await fetch(`${GEOCODING_API}?${params}`);
      const data = await response.json();

      if (data.results) {
        const sortedResults = data.results.sort((a: LocationResult, b: LocationResult) => {
          if (a.country === 'India' && b.country !== 'India') return -1;
          if (a.country !== 'India' && b.country === 'India') return 1;
          return 0;
        });
        setResults(sortedResults);
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Search error:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, search };
}

function useMultipleWeather(locations: { name: string; lat: number; lon: number }[]) {
  const [data, setData] = useState<Map<string, WeatherData>>(new Map());
  const [loading, setLoading] = useState(false);

  const fetchAll = useCallback(async () => {
    if (locations.length === 0) return;

    setLoading(true);

    const promises = locations.map(async (location) => {
      try {
        const params = new URLSearchParams({
          latitude: location.lat.toString(),
          longitude: location.lon.toString(),
          current: 'temperature_2m,weather_code,is_day',
          timezone: 'Asia/Kolkata',
        });

        const response = await fetch(`${OPEN_METEO_API}?${params}`);
        const result = await response.json();

        return {
          name: location.name,
          data: {
            current: {
              temperature: Math.round(result.current.temperature_2m),
              feelsLike: Math.round(result.current.temperature_2m),
              humidity: 0,
              windSpeed: 0,
              windDirection: 0,
              weatherCode: result.current.weather_code,
              uvIndex: 0,
              visibility: 10,
              isDay: result.current.is_day === 1,
            },
            daily: [],
            location: {
              name: location.name,
              lat: location.lat,
              lon: location.lon,
            },
          } as WeatherData,
        };
      } catch {
        return null;
      }
    });

    const results = await Promise.all(promises);
    const newData = new Map<string, WeatherData>();
    
    results.forEach((result) => {
      if (result) {
        newData.set(result.name, result.data);
      }
    });

    setData(newData);
    setLoading(false);
  }, [locations]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { data, loading, refetch: fetchAll };
}

// ============================================================================
// INLINE STYLES (for standalone usage without tailwind config)
// ============================================================================

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '1rem',
    padding: '1.5rem',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    border: '1px solid rgba(0, 0, 0, 0.05)',
  } as React.CSSProperties,
  muted: {
    backgroundColor: 'rgb(249 250 251)',
  } as React.CSSProperties,
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

function WeatherIconComponent({ 
  code, 
  isDay = true, 
  size = 'md', 
}: { code: number; isDay?: boolean; size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  const sizeMap = { sm: '2rem', md: '3rem', lg: '4rem', xl: '6rem' };
  
  const getIcon = () => {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code === 1) return isDay ? '🌤️' : '🌙';
    if (code === 2) return '⛅';
    if (code === 3) return '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 51 && code <= 55) return '🌦️';
    if (code === 56 || code === 57) return '🌨️';
    if (code >= 61 && code <= 65) return '🌧️';
    if (code === 66 || code === 67) return '🌨️';
    if (code >= 71 && code <= 77) return '❄️';
    if (code === 80) return '🌦️';
    if (code === 81) return '🌧️';
    if (code === 82) return '⛈️';
    if (code === 85 || code === 86) return '🌨️';
    if (code >= 95) return '⛈️';
    return '🌡️';
  };

  return (
    <span style={{ fontSize: sizeMap[size], filter: 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))' }}>
      {getIcon()}
    </span>
  );
}

function LoadingSkeletonComponent() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div style={{ height: '2.5rem', width: '12rem', backgroundColor: '#e5e7eb', borderRadius: '0.75rem', animation: 'pulse 2s infinite' }} />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ height: '3rem', width: '20rem', backgroundColor: '#e5e7eb', borderRadius: '1rem', animation: 'pulse 2s infinite' }} />
            <div style={{ height: '2.5rem', width: '7rem', backgroundColor: '#e5e7eb', borderRadius: '0.75rem', animation: 'pulse 2s infinite' }} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: '16rem', backgroundColor: '#e5e7eb', borderRadius: '1rem', animation: 'pulse 2s infinite' }} />
            <div style={{ height: '20rem', backgroundColor: '#e5e7eb', borderRadius: '1rem', animation: 'pulse 2s infinite' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ height: '16rem', backgroundColor: '#e5e7eb', borderRadius: '1rem', animation: 'pulse 2s infinite' }} />
            <div style={{ height: '8rem', backgroundColor: '#e5e7eb', borderRadius: '1rem', animation: 'pulse 2s infinite' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CurrentWeatherComponent({ data, language }: { data: WeatherData; language: Language }) {
  const t = translations[language];
  const today = new Date();
  const dayName = getDayName(today.toISOString(), false);
  const formattedDate = formatDate(today.toISOString());

  return (
    <div style={styles.card}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827' }}>{dayName}</h2>
        <p style={{ color: '#6b7280', fontSize: '0.875rem' }}>{formattedDate}</p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <WeatherIconComponent code={data.current.weatherCode} isDay={data.current.isDay} size="xl" />
          <div>
            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '3.75rem', fontWeight: 'bold', color: '#111827' }}>
                {data.current.temperature}
              </span>
              <span style={{ fontSize: '1.5rem', fontWeight: '500', color: '#111827', marginTop: '0.5rem' }}>°C</span>
            </div>
            {data.daily[0] && (
              <p style={{ color: '#6b7280', fontSize: '1.125rem' }}>/{data.daily[0].tempMin}°C</p>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#111827' }}>
            {getWeatherDescription(data.current.weatherCode)}
          </p>
          <p style={{ color: '#6b7280' }}>{t.feelsLike} {data.current.feelsLike}°C</p>
        </div>
      </div>
    </div>
  );
}

function TodayHighlightsComponent({ data, language }: { data: WeatherData; language: Language }) {
  const t = translations[language];
  const humidityStatus = getHumidityStatus(data.current.humidity);
  const uvStatus = getUVStatus(data.current.uvIndex);

  const getHumidityLabel = () => {
    switch (humidityStatus) {
      case 'good': return t.goodHumidity;
      case 'moderate': return t.moderateHumidity;
      case 'low': return t.lowHumidity;
      case 'high': return t.highHumidity;
    }
  };

  const getUVLabel = () => {
    switch (uvStatus) {
      case 'low': return t.lowUV;
      case 'moderate': return t.moderateUV;
      case 'high': return t.highUV;
      case 'veryHigh': return t.veryHighUV;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': case 'low': return '#22c55e';
      case 'moderate': return '#f59e0b';
      case 'high': case 'warning': return '#f97316';
      case 'veryHigh': case 'danger': return '#ef4444';
      default: return '#111827';
    }
  };

  const highlightBoxStyle: React.CSSProperties = {
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    padding: '1rem',
  };

  return (
    <div style={styles.card}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{t.todayHighlight}</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {/* Wind */}
        <div style={highlightBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            <Wind size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{t.windStatus}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            {data.current.windSpeed.toFixed(1)} <span style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>{t.kmh}</span>
          </p>
          <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '0.25rem' }}>
            {getWindDirection(data.current.windDirection)}
          </p>
        </div>

        {/* Humidity */}
        <div style={highlightBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            <Droplets size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{t.humidity}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            {data.current.humidity}<span style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>%</span>
          </p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: getStatusColor(humidityStatus) }}>
            {getHumidityLabel()}
          </p>
        </div>

        {/* Sunrise */}
        {data.daily[0] && (
          <div style={{ ...highlightBoxStyle, background: 'linear-gradient(to bottom right, #fef3c7, #fed7aa)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b45309', marginBottom: '0.5rem' }}>
              <Sunrise size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{t.sunrise}</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#78350f' }}>
              {formatTime(data.daily[0].sunrise)}
            </p>
          </div>
        )}

        {/* UV Index */}
        <div style={highlightBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            <Sun size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{t.uvIndex}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            {Math.round(data.current.uvIndex)} <span style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>UV</span>
          </p>
          <p style={{ fontSize: '0.75rem', marginTop: '0.25rem', color: getStatusColor(uvStatus) }}>
            {getUVLabel()}
          </p>
        </div>

        {/* Visibility */}
        <div style={highlightBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#6b7280', marginBottom: '0.5rem' }}>
            <Eye size={16} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{t.visibility}</span>
          </div>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>
            {data.current.visibility} <span style={{ fontSize: '0.875rem', fontWeight: 'normal' }}>{t.km}</span>
          </p>
        </div>

        {/* Sunset */}
        {data.daily[0] && (
          <div style={{ ...highlightBoxStyle, background: 'linear-gradient(to bottom right, #fed7aa, #fecaca)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#be123c', marginBottom: '0.5rem' }}>
              <Sunset size={16} />
              <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>{t.sunset}</span>
            </div>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#881337' }}>
              {formatTime(data.daily[0].sunset)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DayForecastComponent({ data, language }: { data: WeatherData; language: Language }) {
  const t = translations[language];

  return (
    <div style={styles.card}>
      <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>{t.dayForecast}</h3>
      
      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {data.daily.slice(0, 7).map((day, index) => {
          const isToday = index === 0;
          
          return (
            <div
              key={day.date}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                minWidth: '5rem',
                backgroundColor: isToday ? '#2563eb' : '#f3f4f6',
                color: isToday ? 'white' : '#111827',
              }}
            >
              <span style={{ fontSize: '0.75rem', fontWeight: '600', marginBottom: '0.5rem', color: isToday ? 'white' : '#6b7280' }}>
                {isToday ? t.today : getDayName(day.date)}
              </span>
              <WeatherIconComponent code={day.weatherCode} size="sm" />
              <span style={{ fontSize: '1.125rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                {day.tempMax}°C
              </span>
              {day.precipitationProbability > 20 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem', fontSize: '0.75rem', color: isToday ? 'rgba(255,255,255,0.8)' : '#3b82f6' }}>
                  <span>💧</span>
                  <span>{day.precipitationProbability}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NearbyDistrictsComponent({ 
  districts, 
  weatherData, 
  language, 
  onSelect,
  loading 
}: { 
  districts: { name: string; state: string; lat: number; lon: number }[];
  weatherData: Map<string, WeatherData>;
  language: Language;
  onSelect: (location: { name: string; lat: number; lon: number }) => void;
  loading: boolean;
}) {
  const t = translations[language];

  return (
    <div style={styles.card}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>{t.nearbyDistricts}</h3>
        <button style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#2563eb', cursor: 'pointer', background: 'none', border: 'none' }}>
          {t.seeAll}
          <ChevronDown size={16} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {districts.map((district) => {
          const weather = weatherData.get(district.name);
          
          return (
            <button
              key={district.name}
              onClick={() => onSelect({ name: district.name, lat: district.lat, lon: district.lon })}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                borderRadius: '0.75rem',
                backgroundColor: '#f3f4f6',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
            >
              <div style={{ textAlign: 'left' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>{district.state}</p>
                <p style={{ fontWeight: '600', color: '#111827' }}>{district.name}</p>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {loading ? (
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', backgroundColor: '#e5e7eb', animation: 'pulse 2s infinite' }} />
                ) : weather ? (
                  <>
                    <WeatherIconComponent code={weather.current.weatherCode} isDay={weather.current.isDay} size="sm" />
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827' }}>
                        {weather.current.temperature}°
                      </span>
                    </div>
                  </>
                ) : (
                  <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>--</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FarmingAdvisoryComponent({ data, language }: { data: WeatherData; language: Language }) {
  const t = translations[language];
  
  const humidity = data.current.humidity;
  const windSpeed = data.current.windSpeed;
  const weatherCode = data.current.weatherCode;
  const temp = data.current.temperature;
  const rainExpected = data.daily.slice(0, 2).some(d => d.precipitationProbability > 50);

  const getCropAdvice = () => {
    if (weatherCode >= 95) return { text: t.stayIndoors, type: 'danger', Icon: AlertTriangle };
    if (weatherCode >= 61 && weatherCode <= 67) return { text: t.harvestAdvice, type: 'warning', Icon: AlertTriangle };
    if (temp >= 20 && temp <= 35 && humidity >= 40 && humidity <= 70) return { text: t.sowingAdvice, type: 'good', Icon: CheckCircle };
    return { text: t.sowingAdvice, type: 'good', Icon: CheckCircle };
  };

  const getIrrigationAdvice = () => {
    if (rainExpected) return { text: t.skipIrrigation, type: 'good', Icon: CheckCircle };
    if (humidity < 40 || temp > 35) return { text: t.waterToday, type: 'warning', Icon: Droplets };
    return { text: t.idealIrrigation, type: 'moderate', Icon: Droplets };
  };

  const getPestAdvice = () => {
    if (humidity > 80 && temp > 25) return { text: t.fungalRisk, type: 'danger', Icon: Bug };
    if (humidity > 70 && temp > 20) return { text: t.pestRisk, type: 'warning', Icon: Bug };
    return { text: t.noPestRisk, type: 'good', Icon: CheckCircle };
  };

  const advisories = [
    { title: t.cropAdvisory, ...getCropAdvice() },
    { title: t.irrigationAlert, ...getIrrigationAdvice() },
    { title: t.pestAlert, ...getPestAdvice() },
  ];

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'good': return { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.2)', color: '#22c55e' };
      case 'moderate': return { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' };
      case 'warning': return { bg: 'rgba(249, 115, 22, 0.1)', border: 'rgba(249, 115, 22, 0.2)', color: '#f97316' };
      case 'danger': return { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' };
      default: return { bg: '#f3f4f6', border: '#e5e7eb', color: '#111827' };
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {advisories.map((advisory, index) => {
        const typeStyles = getTypeStyles(advisory.type);
        const Icon = advisory.Icon;
        return (
          <div
            key={index}
            style={{
              ...styles.card,
              backgroundColor: typeStyles.bg,
              borderColor: typeStyles.border,
              borderWidth: '2px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ padding: '0.5rem', borderRadius: '0.5rem', backgroundColor: 'rgba(255,255,255,0.5)', color: typeStyles.color }}>
                <Icon size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ fontWeight: '600', color: '#111827', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {advisory.title}
                </h4>
                <p style={{ fontSize: '0.875rem', color: typeStyles.color }}>
                  {advisory.text}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LocationSearchComponent({
  language,
  savedLocations,
  onSelect,
  onSave,
  onRemove,
  currentLocation,
}: {
  language: Language;
  savedLocations: SavedLocation[];
  onSelect: (location: SavedLocation) => void;
  onSave: (location: SavedLocation) => void;
  onRemove: (lat: number, lon: number) => void;
  currentLocation?: SavedLocation | null;
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const { results, loading, search } = useLocationSearch();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setShowSaved(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (result: SavedLocation) => {
    onSelect(result);
    setQuery('');
    setIsOpen(false);
    setShowSaved(false);
  };

  const isLocationSaved = (lat: number, lon: number) => {
    return savedLocations.some(l => l.lat === lat && l.lon === lon);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '28rem' }}>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <div style={{ position: 'absolute', left: '1rem', color: '#6b7280' }}>
          <MapPin size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setShowSaved(false);
          }}
          onFocus={() => {
            if (query.length === 0 && savedLocations.length > 0) {
              setShowSaved(true);
            }
            setIsOpen(true);
          }}
          placeholder={t.searchPlaceholder}
          style={{
            width: '100%',
            paddingLeft: '3rem',
            paddingRight: '3rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            borderRadius: '1rem',
            backgroundColor: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            fontSize: '0.875rem',
            fontWeight: '500',
            outline: 'none',
          }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); inputRef.current?.focus(); }}
            style={{ position: 'absolute', right: '1rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        )}
        {!query && (
          <button
            onClick={() => { setShowSaved(!showSaved); setIsOpen(true); }}
            style={{ position: 'absolute', right: '1rem', color: '#6b7280', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Search size={16} />
          </button>
        )}
      </div>

      {currentLocation && !isOpen && (
        <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
          <MapPin size={16} style={{ color: '#2563eb' }} />
          <span style={{ fontWeight: '500', color: '#111827' }}>{currentLocation.name}</span>
          {currentLocation.admin1 && <span>, {currentLocation.admin1}</span>}
        </div>
      )}

      {isOpen && (query.length > 0 || showSaved) && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '1rem',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
          zIndex: 50,
        }}>
          {loading && (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
              {t.loading}
            </div>
          )}

          {!loading && query.length > 0 && results.length > 0 && (
            <ul style={{ maxHeight: '16rem', overflowY: 'auto', padding: '0.5rem 0', listStyle: 'none', margin: 0 }}>
              {results.map((result) => (
                <li key={result.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
                    <button
                      onClick={() => handleSelect({
                        name: result.name,
                        lat: result.latitude,
                        lon: result.longitude,
                        admin1: result.admin1,
                        country: result.country,
                      })}
                      style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      <MapPin size={16} style={{ color: '#6b7280', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontWeight: '500', fontSize: '0.875rem', margin: 0 }}>{result.name}</p>
                        <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                          {[result.admin1, result.country].filter(Boolean).join(', ')}
                        </p>
                      </div>
                    </button>
                    <button
                      onClick={() => {
                        if (isLocationSaved(result.latitude, result.longitude)) {
                          onRemove(result.latitude, result.longitude);
                        } else {
                          onSave({
                            name: result.name,
                            lat: result.latitude,
                            lon: result.longitude,
                            admin1: result.admin1,
                            country: result.country,
                          });
                        }
                      }}
                      style={{
                        padding: '0.5rem',
                        borderRadius: '50%',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: isLocationSaved(result.latitude, result.longitude) ? '#f59e0b' : '#6b7280',
                      }}
                    >
                      <Star size={16} fill={isLocationSaved(result.latitude, result.longitude) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {showSaved && savedLocations.length > 0 && (
            <div style={{ padding: '0.5rem 0' }}>
              <p style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t.savedLocations}
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {savedLocations.map((location) => (
                  <li key={`${location.lat}-${location.lon}`}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
                      <button
                        onClick={() => handleSelect(location)}
                        style={{ flex: 1, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        <Star size={16} style={{ color: '#f59e0b', flexShrink: 0 }} fill="currentColor" />
                        <div>
                          <p style={{ fontWeight: '500', fontSize: '0.875rem', margin: 0 }}>{location.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: 0 }}>
                            {[location.admin1, location.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => onRemove(location.lat, location.lon)}
                        style={{ padding: '0.5rem', borderRadius: '50%', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!loading && query.length > 1 && results.length === 0 && (
            <div style={{ padding: '1rem', textAlign: 'center', color: '#6b7280', fontSize: '0.875rem' }}>
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function LanguageSelectorComponent({ currentLanguage, onLanguageChange }: { currentLanguage: Language; onLanguageChange: (language: Language) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '0.75rem',
          backgroundColor: 'white',
          border: '1px solid rgba(0,0,0,0.1)',
          cursor: 'pointer',
          fontSize: '0.875rem',
          fontWeight: '500',
        }}
      >
        <Globe size={16} style={{ color: '#2563eb' }} />
        <span>{languageNames[currentLanguage]}</span>
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          marginTop: '0.5rem',
          backgroundColor: 'white',
          borderRadius: '0.75rem',
          border: '1px solid rgba(0,0,0,0.1)',
          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          overflow: 'hidden',
          zIndex: 50,
          minWidth: '8.75rem',
        }}>
          {(Object.keys(languageNames) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => { onLanguageChange(lang); setIsOpen(false); }}
              style={{
                width: '100%',
                padding: '0.625rem 1rem',
                textAlign: 'left',
                fontSize: '0.875rem',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: lang === currentLanguage ? 'rgba(37, 99, 235, 0.1)' : 'transparent',
                color: lang === currentLanguage ? '#2563eb' : '#111827',
                fontWeight: lang === currentLanguage ? '600' : '400',
              }}
            >
              {languageNames[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const DEFAULT_LOCATION = {
  name: 'Delhi',
  lat: 28.6139,
  lon: 77.209,
  admin1: 'Delhi',
  country: 'India',
};

export default function IndianFarmerWeatherDashboard() {
  const { 
    preferences, 
    loaded, 
    setLanguage, 
    saveLocation, 
    removeLocation, 
    setLastLocation 
  } = useLocalStorage();

  const [currentLocation, setCurrentLocation] = useState(
    preferences.lastLocation || DEFAULT_LOCATION
  );

  useEffect(() => {
    if (loaded && preferences.lastLocation) {
      setCurrentLocation(preferences.lastLocation);
    }
  }, [loaded, preferences.lastLocation]);

  const { data, loading, error, refetch } = useWeather(
    currentLocation.lat,
    currentLocation.lon
  );

  const nearbyDistricts = useMemo(() => {
    return getNearbyDistricts(currentLocation.lat, currentLocation.lon, 4);
  }, [currentLocation.lat, currentLocation.lon]);

  const { data: nearbyWeather, loading: nearbyLoading } = useMultipleWeather(nearbyDistricts);

  const t = translations[preferences.language];

  const handleLocationSelect = (location: { name: string; lat: number; lon: number; admin1?: string; country?: string }) => {
    setCurrentLocation(location);
    setLastLocation(location);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (!loaded) {
    return <LoadingSkeletonComponent />;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '1.5rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
        {/* Header */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem' }}>🌾</span>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', background: 'linear-gradient(to right, #16a34a, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {t.appTitle}
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <LocationSearchComponent
              language={preferences.language}
              savedLocations={preferences.savedLocations}
              onSelect={handleLocationSelect}
              onSave={saveLocation}
              onRemove={removeLocation}
              currentLocation={currentLocation}
            />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                onClick={handleRefresh}
                disabled={loading}
                style={{
                  padding: '0.625rem',
                  borderRadius: '0.75rem',
                  backgroundColor: 'white',
                  border: '1px solid rgba(0,0,0,0.1)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                }}
                aria-label="Refresh weather data"
              >
                <RefreshCw size={20} style={{ color: '#2563eb', animation: loading ? 'spin 1s linear infinite' : 'none' }} />
              </button>
              
              <LanguageSelectorComponent
                currentLanguage={preferences.language}
                onLanguageChange={setLanguage}
              />
            </div>
          </div>
        </header>

        {/* Error state */}
        {error && (
          <div style={{ marginBottom: '1.5rem', padding: '1rem', borderRadius: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
            <p style={{ fontWeight: '500' }}>{t.error}</p>
            <button onClick={handleRefresh} style={{ marginTop: '0.5rem', fontSize: '0.875rem', textDecoration: 'underline', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>
              {t.retry}
            </button>
          </div>
        )}

        {/* Main content */}
        {loading && !data ? (
          <LoadingSkeletonComponent />
        ) : data ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
            {/* Left column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <CurrentWeatherComponent data={data} language={preferences.language} />
              
              <NearbyDistrictsComponent
                districts={nearbyDistricts}
                weatherData={nearbyWeather}
                language={preferences.language}
                onSelect={handleLocationSelect}
                loading={nearbyLoading}
              />
            </div>

            {/* Right column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <TodayHighlightsComponent data={data} language={preferences.language} />
              <DayForecastComponent data={data} language={preferences.language} />
              <FarmingAdvisoryComponent data={data} language={preferences.language} />
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(0,0,0,0.1)', textAlign: 'center', fontSize: '0.875rem', color: '#6b7280' }}>
          <p>Data refreshes every 15 minutes • Powered by Open-Meteo</p>
        </footer>
      </div>

      {/* Keyframe animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
