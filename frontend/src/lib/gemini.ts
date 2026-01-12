import { GoogleGenAI, Type } from '@google/genai';

const DEFAULT_API_KEY = ''; // No default key - users must add their own

// Get API key from localStorage or use default
const getAPIKey = () => {
  const userAPIKey = localStorage.getItem('gemini_api_key');
  return userAPIKey || DEFAULT_API_KEY;
};

let genAI = new GoogleGenAI({ apiKey: getAPIKey() });

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
  private getModel() {
    // Refresh genAI instance with current API key
    genAI = new GoogleGenAI({ apiKey: getAPIKey() });
    return genAI;
  }

  updateAPIKey(apiKey: string) {
    localStorage.setItem('gemini_api_key', apiKey);
    genAI = new GoogleGenAI({ apiKey: apiKey });
  }

  removeAPIKey() {
    localStorage.removeItem('gemini_api_key');
    genAI = new GoogleGenAI({ apiKey: DEFAULT_API_KEY });
  }

  async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
    try {
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

      // Determine MIME type from base64 prefix
      let mimeType = 'image/jpeg';
      if (imageBase64.includes('data:image/png')) {
        mimeType = 'image/png';
      } else if (imageBase64.includes('data:image/webp')) {
        mimeType = 'image/webp';
      }

      // Define the response schema
      const diagnosisSchema = {
        type: Type.OBJECT,
        properties: {
          isPlant: {
            type: Type.BOOLEAN,
            description: "Is the image of a plant? If not, all other fields can be empty/false."
          },
          hasDisease: {
            type: Type.BOOLEAN,
            description: "Does the plant appear to have a disease?"
          },
          disease: {
            type: Type.STRING,
            description: "The common name of the identified plant disease. If healthy, state 'Healthy Plant'."
          },
          confidence: {
            type: Type.NUMBER,
            description: "Confidence level of the diagnosis (0-100)"
          },
          severity: {
            type: Type.STRING,
            description: "Severity level: Low, Medium, or High"
          },
          description: {
            type: Type.STRING,
            description: "A brief, easy-to-understand description of the disease or the plant's healthy state."
          },
          treatment: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING
            },
            description: "A list of actionable steps or treatments to help the plant recover."
          },
          prevention: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING
            },
            description: "A list of prevention methods for this disease."
          },
          affectedArea: {
            type: Type.NUMBER,
            description: "Estimated percentage of plant affected (0-100)"
          }
        },
        required: ['isPlant', 'hasDisease', 'disease', 'confidence', 'severity', 'description', 'treatment', 'prevention', 'affectedArea']
      };

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      };

      const textPart = {
        text: `You are a specialized plant pathologist and entomologist. Analyze this image of a crop/plant for diseases and pest infestations.
        
        If the image is not a plant, indicate that with isPlant: false.
        If it is a healthy plant with no visible issues, state that with hasDisease: false.
        
        IMPORTANT: Look for BOTH diseases AND pests:
        
        Common crop DISEASES in India:
        - Late Blight, Early Blight for tomatoes/potatoes
        - Rust diseases for wheat
        - Bacterial leaf blight for rice
        - Powdery mildew for various crops
        - Leaf spot diseases
        - Fungal and bacterial infections
        
        Common crop PESTS (insects/infestations):
        - Aphids (small green/yellow insects clustered on leaves/stems)
        - Whiteflies (tiny white flying insects)
        - Spider Mites (tiny dots, webbing on leaves)
        - Caterpillars/worms (visible larvae eating leaves)
        - Thrips, Mealybugs, Scale insects
        - Any visible insect infestation
        
        If you detect ANY issue (disease OR pest infestation), set hasDisease to true.
        For pests, set disease name to the specific pest (e.g., "Aphid Infestation", "Whitefly Attack").
        
        Provide:
        - Disease/pest name (or 'Healthy Plant')
        - Confidence level (0-100)
        - Severity (Low, Medium, High)
        - Simple description including visual evidence
        - Practical treatment steps for Indian farmers
        - Prevention methods
        - Estimated affected area percentage
        
        Respond with the JSON schema provided.`,
      };

      console.log(`🔬 [Gemini] Disease Detection using model: gemini-2.5-flash`);

      const response = await this.getModel().models.generateContent({
        model: 'gemini-2.5-flash', // Vision-capable model with higher free tier limits
        contents: { parts: [textPart, imagePart] },
        config: {
          responseMimeType: "application/json",
          responseSchema: diagnosisSchema,
          temperature: 0.2,
        },
      });

      const jsonText = response.text.trim();
      const result = JSON.parse(jsonText);

      // Basic validation to ensure the result matches the expected structure
      if (typeof result.isPlant === 'undefined' || typeof result.disease === 'undefined') {
        throw new Error("Invalid response structure from API.");
      }

      // If not a plant, return error-like result
      if (!result.isPlant) {
        return {
          disease: 'Not a Plant',
          confidence: 95,
          severity: 'Low' as const,
          description: 'The uploaded image does not appear to be a plant. Please upload a clear image of a crop or plant.',
          treatment: ['Upload a valid plant image'],
          prevention: ['Ensure proper image capture'],
          affectedArea: 0
        };
      }

      // Return the analyzed result
      return {
        disease: result.disease,
        confidence: Math.round(result.confidence),
        severity: result.severity as 'Low' | 'Medium' | 'High',
        description: result.description,
        treatment: result.treatment,
        prevention: result.prevention,
        affectedArea: Math.round(result.affectedArea)
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Could not get a diagnosis from the AI model. Please check your API key and try again.');
    }
  }

  async getFarmingAdvice(query: string, language: string = 'english'): Promise<AIFarmingAdvice> {
    try {
      const languageInstructions = {
        hindi: 'Respond in Hindi (Devanagari script)',
        marathi: 'Respond in Marathi (Devanagari script)',
        malayalam: 'Respond in Malayalam (Malayalam script)',
        punjabi: 'Respond in Punjabi (Gurmukhi script)',
        english: 'Respond in English'
      };

      const prompt = `
        You are an expert agricultural advisor helping Indian farmers. 
        The farmer asks: "${query}"
        
        ${languageInstructions[language as keyof typeof languageInstructions] || 'Respond in English'}
        
        Provide practical, actionable advice specific to Indian farming conditions.
        Consider factors like:
        - Local climate and seasons
        - Common Indian crops (wheat, rice, sugarcane, cotton, etc.)
        - Traditional and modern farming practices
        - Cost-effective solutions for small farmers
        - Government schemes and subsidies when relevant
        
        Keep the response concise but informative (2-4 sentences).
        Focus on immediate actionable steps.
      `;

      console.log(`💬 [Gemini] Farming Advice using model: gemini-2.5-flash-lite`);

      const result = await this.getModel().models.generateContent({
        model: 'gemini-2.5-flash-lite', // Text-only model with 10x higher free tier limits
        contents: { parts: [{ text: prompt }] },
        config: {
          temperature: 0.7,
        },
      });
      const text = result.text;

      // Determine category based on query keywords
      const queryLower = query.toLowerCase();
      let category: AIFarmingAdvice['category'] = 'general';

      if (queryLower.includes('weather') || queryLower.includes('rain') || queryLower.includes('मौसम')) {
        category = 'weather';
      } else if (queryLower.includes('disease') || queryLower.includes('pest') || queryLower.includes('बीमारी')) {
        category = 'disease';
      } else if (queryLower.includes('fertilizer') || queryLower.includes('खाद') || queryLower.includes('उर्वरक')) {
        category = 'fertilizer';
      } else if (queryLower.includes('crop') || queryLower.includes('फसल') || queryLower.includes('yield')) {
        category = 'crop';
      }

      return {
        query,
        response: text.trim(),
        language,
        category
      };
    } catch (error) {
      console.error('Gemini API error:', error);

      // Fallback responses in different languages
      const fallbackResponses = {
        hindi: 'क्षमा करें, मैं अभी आपकी मदद नहीं कर सकता। कृपया बाद में पुनः प्रयास करें।',
        marathi: 'माफ करा, मी सध्या तुमची मदत करू शकत नाही. कृपया नंतर पुन्हा प्रयत्न करा.',
        malayalam: 'ക്ഷമിക്കണം, എനിക്ക് ഇപ്പോൾ നിങ്ങളെ സഹായിക്കാൻ കഴിയില്ല. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.',
        english: 'Sorry, I cannot help you right now. Please try again later.'
      };

      return {
        query,
        response: fallbackResponses[language as keyof typeof fallbackResponses] || fallbackResponses.english,
        language,
        category: 'general'
      };
    }
  }

  async getWeatherAdvice(location: string = 'India'): Promise<string> {
    try {
      const prompt = `
        Provide current agricultural weather advice for farmers in ${location}.
        Include:
        - General weather conditions
        - Impact on current season crops
        - Recommended farming activities
        - Precautions to take
        
        Keep it practical and actionable for Indian farmers.
      `;

      const result = await this.getModel().models.generateContent({
        model: 'gemini-2.5-flash-lite', // Text-only model with higher free tier limits
        contents: { parts: [{ text: prompt }] },
        config: {
          temperature: 0.7,
        },
      });
      return result.text.trim();
    } catch (error) {
      console.error('Weather advice error:', error);
      return 'Unable to fetch weather advice at the moment. Please check local weather conditions and plan accordingly.';
    }
  }

  async getCropRecommendations(season: string, soilType: string = '', region: string = 'India'): Promise<string[]> {
    try {
      const prompt = `
        Recommend the best crops to plant in ${season} season in ${region}.
        ${soilType ? `Soil type: ${soilType}` : ''}
        
        Provide a list of 5-7 recommended crops with brief reasons.
        Format as a simple list, one crop per line.
        Focus on crops suitable for Indian farmers.
      `;

      const result = await this.getModel().models.generateContent({
        model: 'gemini-2.5-flash-lite', // Text-only model with higher free tier limits
        contents: { parts: [{ text: prompt }] },
        config: {
          temperature: 0.7,
        },
      });
      const text = result.text.trim();

      return text.split('\n').filter(line => line.trim()).slice(0, 7);
    } catch (error) {
      console.error('Crop recommendations error:', error);
      return ['Wheat', 'Rice', 'Sugarcane', 'Cotton', 'Maize'];
    }
  }
}

export const geminiAI = new GeminiAIService();

// Direct API access for general AI insights
export const getAIInsights = async (prompt: string): Promise<string[]> => {
  try {
    const ai = new GoogleGenAI({ apiKey: getAPIKey() });
    const result = await ai.models.generateContent({
      model: 'gemini-2.5-flash-lite', // Text-only model with higher free tier limits
      contents: { parts: [{ text: prompt }] },
      config: {
        temperature: 0.7,
      },
    });
    const text = result.text;

    // Split response into individual insights/recommendations
    const insights = text
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^\*\s*|\d+\.\s*/, '').trim())
      .filter(line => line.length > 10); // Filter out very short lines

    return insights.slice(0, 6); // Return up to 6 insights
  } catch (error) {
    console.error('Error getting AI insights:', error);
    throw new Error('Failed to generate AI insights');
  }
};