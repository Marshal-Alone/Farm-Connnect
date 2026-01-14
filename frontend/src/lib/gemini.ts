/**
 * Gemini AI Service - Secure Proxy Version
 * API calls route through backend, with user API key fallback from Settings
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4174';

// Get user's API key from localStorage (set in Profile > Settings)
const getUserApiKey = () => localStorage.getItem('gemini_api_key') || null;

export interface AICropAnalysis {
  disease: string;
  confidence: number;
  severity: 'Low' | 'Medium' | 'High';
  description: string;
  treatment: string[];
  prevention: string[];
  affectedArea: number;
}

export interface AIFarmingAdvice {
  query: string;
  response: string;
  language: string;
  category: 'weather' | 'disease' | 'fertilizer' | 'crop' | 'general';
}

class GeminiAIService {
  updateAPIKey(apiKey: string) {
    localStorage.setItem('gemini_api_key', apiKey);
  }

  removeAPIKey() {
    localStorage.removeItem('gemini_api_key');
  }

  async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
    try {
      console.log('🔬 [Gemini] Sending image to secure backend proxy...');

      const response = await fetch(`${API_BASE_URL}/api/ai/gemini/analyze-crop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64,
          userApiKey: getUserApiKey() // Send user's key as fallback
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to analyze image');
      }

      // Log the API key source for debugging
      if (data.keySource) {
        console.log(`🔑 [Gemini] API key source: ${data.keySource}`);
      }
      console.log('✅ [Gemini] Analysis received:', data.data.disease);
      return data.data;

    } catch (error) {
      console.error('Gemini API proxy error:', error);
      throw new Error('Could not get a diagnosis. Please check your connection and try again.');
    }
  }

  async getFarmingAdvice(query: string, language: string = 'english'): Promise<AIFarmingAdvice> {
    try {
      console.log('💬 [Gemini] Sending query to secure backend proxy...');

      const response = await fetch(`${API_BASE_URL}/api/ai/gemini/farming-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language,
          userApiKey: getUserApiKey()
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get farming advice');
      }

      // Log the API key source for debugging
      if (data.keySource) {
        console.log(`🔑 [Gemini] API key source: ${data.keySource}`);
      }
      console.log('✅ [Gemini] Advice received');
      return {
        query,
        response: data.data.response,
        language: data.data.language || language,
        category: data.data.category || 'general'
      };

    } catch (error) {
      console.error('Gemini API proxy error:', error);

      const fallbackResponses: Record<string, string> = {
        hindi: 'क्षमा करें, मैं अभी आपकी मदद नहीं कर सकता।',
        marathi: 'माफ करा, मी सध्या तुमची मदत करू शकत नाही.',
        english: 'Sorry, I cannot help you right now. Please try again later.'
      };

      return {
        query,
        response: fallbackResponses[language] || fallbackResponses.english,
        language,
        category: 'general'
      };
    }
  }

  async getWeatherAdvice(location: string = 'India'): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai/gemini/farming-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `Provide agricultural weather advice for farmers in ${location}.`,
          language: 'english',
          userApiKey: getUserApiKey()
        }),
      });

      const data = await response.json();
      return data.success ? data.data.response : 'Unable to fetch weather advice.';
    } catch (error) {
      return 'Unable to fetch weather advice at the moment.';
    }
  }

  async getCropRecommendations(season: string, soilType: string = '', region: string = 'India'): Promise<string[]> {
    try {
      const query = `Recommend crops for ${season} season in ${region}. ${soilType ? `Soil: ${soilType}` : ''}`;

      const response = await fetch(`${API_BASE_URL}/api/ai/gemini/farming-advice`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, language: 'english', userApiKey: getUserApiKey() }),
      });

      const data = await response.json();
      return data.success
        ? data.data.response.split('\n').filter((line: string) => line.trim()).slice(0, 7)
        : ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize'];
    } catch (error) {
      return ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize'];
    }
  }
}

export const geminiAI = new GeminiAIService();

// General AI insights (also uses backend proxy with user key fallback)
export const getAIInsights = async (prompt: string): Promise<string[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ai/gemini/farming-advice`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: prompt, language: 'english', userApiKey: getUserApiKey() }),
    });

    const data = await response.json();
    if (!data.success) throw new Error(data.error);

    return data.data.response
      .split('\n')
      .filter((line: string) => line.trim().length > 0)
      .map((line: string) => line.replace(/^\*\s*|\d+\.\s*/, '').trim())
      .filter((line: string) => line.length > 10)
      .slice(0, 6);
  } catch (error) {
    throw new Error('Failed to generate AI insights');
  }
};