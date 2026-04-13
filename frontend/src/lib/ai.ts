import { geminiAI, AICropAnalysis } from './gemini';
import { groqAI } from './groq';
import { customModelAI } from './customModel';
import { API_BASE_URL } from '../config/api';

/**
 * Model Provider Types
 * - 'gemini': Google Gemini Vision API (cloud-based)
 * - 'groq': Groq LLaMA API (cloud-based)
 * - 'custom': Our custom TensorFlow.js model (browser-based, offline capable)
 * - 'hybrid': Custom model + Groq validation for best accuracy
 */
export type ModelProvider = 'gemini' | 'groq' | 'custom' | 'hybrid';

export interface ModelConfig {
    diseaseDetection: ModelProvider;
    chatbot: ModelProvider;
}

const SETTINGS_KEY = 'farm-connect-model-settings';

const getDefaultConfig = (): ModelConfig => ({
    diseaseDetection: 'hybrid',
    chatbot: 'groq',
});

export const getModelConfig = (): ModelConfig => {
    try {
        const stored = localStorage.getItem(SETTINGS_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            return { ...getDefaultConfig(), ...parsed };
        }
    } catch (error) {
        console.error('Error loading model config:', error);
    }
    return getDefaultConfig();
};

export const saveModelConfig = (config: ModelConfig): void => {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(config));
    } catch (error) {
        console.error('Error saving model config:', error);
    }
};

/**
 * Analyze a crop image for diseases using the configured AI provider.
 * 
 * Supports three providers:
 * - 'custom': Browser-based TensorFlow.js model (offline capable, fast)
 * - 'groq': Groq LLaMA Vision API (requires internet + API key)
 * - 'gemini': Google Gemini Vision API (requires internet + API key)
 * 
 * @param imageBase64 - Base64-encoded image data
 * @returns AICropAnalysis object with disease info, treatment, prevention
 */
export const analyzeCropImage = async (imageBase64: string): Promise<AICropAnalysis> => {
    const config = getModelConfig();
    const provider = config.diseaseDetection;

    console.log(`🔬 [AI] Crop Disease Analysis using: ${provider.toUpperCase()}`);

    switch (provider) {
        case 'hybrid':
            // Hybrid mode: Run custom model + validate with Groq for best accuracy
            console.log('🔀 [AI] Using HYBRID mode (Custom Model + Groq validation)');
            return analyzeWithHybridMode(imageBase64);

        case 'custom':
            // Use our custom TensorFlow.js model (runs in browser, offline capable)
            console.log('🧠 [AI] Using custom CNN model (browser-based, offline capable)');
            return customModelAI.analyzeCropImage(imageBase64);

        case 'groq':
            // Use Groq LLaMA Vision API (cloud-based)
            return groqAI.analyzeCropImage(imageBase64);

        case 'gemini':
        default:
            // Use Google Gemini Vision API (cloud-based)
            return geminiAI.analyzeCropImage(imageBase64);
    }
};

const normalizeDiseaseName = (name: string | undefined | null): string => {
    if (!name) return '';
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();
};

const diseaseNamesMatch = (a: string | undefined | null, b: string | undefined | null): boolean => {
    const aNorm = normalizeDiseaseName(a);
    const bNorm = normalizeDiseaseName(b);
    if (!aNorm || !bNorm) return false;
    return aNorm === bNorm || aNorm.includes(bNorm) || bNorm.includes(aNorm);
};

/**
 * Hybrid analysis: Combines custom model speed with Groq accuracy
 * 
 * Strategy:
 * 1. Run custom model first (fast, gives initial prediction)
 * 2. Send image + custom model prediction to Groq for validation
 * 3. Groq confirms or corrects the prediction with its own analysis
 * 4. Return the combined/validated result
 */
async function analyzeWithHybridMode(imageBase64: string): Promise<AICropAnalysis> {
    try {
        // Step 1: Get fast prediction from custom model
        console.log('🧠 [Hybrid] Step 1: Running custom CNN model...');
        let customResult: AICropAnalysis | null = null;

        try {
            customResult = await customModelAI.analyzeCropImage(imageBase64);
            console.log(`✓ [Hybrid] Custom model prediction: ${customResult.disease} (${customResult.confidence}%)`);
        } catch (error) {
            console.log('⚠️ [Hybrid] Custom model failed, falling back to Groq only');
        }

        // Step 2: Validate/enhance with Groq via secure backend proxy
        console.log('🔍 [Hybrid] Step 2: Validating with Groq LLaMA Vision (via backend proxy)...');

        try {
            // Get user's API key from settings (Profile > Settings)
            const userApiKey = localStorage.getItem('groq_api_key');

            // Use the secure backend proxy for Groq validation
            const response = await fetch(`${API_BASE_URL}/ai/analyze-crop`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageBase64,
                    userApiKey, // Pass user's key for the proxy
                    customPrediction: customResult ? {
                        disease: customResult.disease,
                        condition: (customResult as any).condition || null,
                        confidence: customResult.confidence,
                        crop: (customResult as any).crop || null,
                        topPredictions: (customResult as any).topPredictions || null
                    } : null
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                console.log('⚠️ [Hybrid] Groq validation failed, using custom model result');
                if (customResult) return customResult;
                throw new Error(data.error || 'Groq API request failed');
            }

            const groqResult = data.data;
            const sameDiagnosis = diseaseNamesMatch(groqResult?.disease, customResult?.disease);

            const customIsHighConfidence = !!customResult && customResult.confidence >= 88;
            const groqIsLowConfidence = !groqResult?.confidence || groqResult.confidence < 75;
            const customSaysHealthy = !!customResult && normalizeDiseaseName(customResult.disease).includes('healthy');
            const groqSaysHealthy = normalizeDiseaseName(groqResult?.disease).includes('healthy');

            // Conservative fusion:
            // If local model is highly confident and Groq is uncertain + disagreeing, keep local.
            const preferCustom =
                !!customResult &&
                (
                    (!sameDiagnosis && customIsHighConfidence && groqIsLowConfidence) ||
                    (customSaysHealthy && customResult.confidence >= 92 && !groqSaysHealthy && groqIsLowConfidence)
                );

            const primary = preferCustom ? customResult : groqResult;
            const secondary = preferCustom ? groqResult : customResult;

            // Log the validation result
            if (customResult) {
                if (sameDiagnosis) {
                    console.log('✅ [Hybrid] Groq CONFIRMED custom model prediction!');
                } else {
                    console.log(`🔄 [Hybrid] Groq CORRECTED prediction: ${customResult.disease} → ${groqResult.disease}`);
                }
            }

            if (preferCustom) {
                console.log('🛡️ [Hybrid] Keeping custom model result due to higher confidence and disagreement');
            }

            // Build final result matching AICropAnalysis interface
            const finalResult: AICropAnalysis = {
                disease: primary?.disease || secondary?.disease || 'Unknown',
                confidence: primary?.confidence || secondary?.confidence || 80,
                severity: (primary?.severity || secondary?.severity || 'Medium') as 'Low' | 'Medium' | 'High',
                description: primary?.description || secondary?.description || '',
                treatment: primary?.treatment || secondary?.treatment || [],
                prevention: primary?.prevention || secondary?.prevention || [],
                affectedArea: primary?.affectedArea || secondary?.affectedArea || 50
            };

            console.log(`✓ [Hybrid] Final result: ${finalResult.disease} (${finalResult.confidence}%)`);
            return finalResult;
        } catch (proxyError) {
            console.log('⚠️ [Hybrid] Backend proxy failed, using custom model result');
            if (customResult) return customResult;
            throw proxyError;
        }

    } catch (error) {
        console.error('❌ [Hybrid] Analysis failed:', error);
        throw error;
    }
}

// AI-powered agricultural insights using configured provider
export const getAgriculturalInsightsAI = async (weatherContext: string): Promise<string[]> => {
    const config = getModelConfig();
    const provider = config.chatbot;

    console.log(`🌾 [AI] Agricultural Insights using: ${provider.toUpperCase()}`);

    const prompt = `You are an agricultural weather advisor for Indian farmers. Based on this weather data:
${weatherContext}

Generate 3-5 practical, actionable farming alerts/recommendations. Consider:
- Irrigation needs based on temperature and humidity
- Disease/pest risks from current weather conditions
- Best farming activities for these conditions
- Crop protection measures if extreme weather
- Spraying/fertilizer application timing

Return ONLY a JSON array of strings (no markdown, no explanation). Each alert should:
- Start with a relevant emoji
- Be concise (under 100 characters)
- Be practical for Indian farmers

Example format: ["🌡️ High heat - water crops early morning", "💧 Good humidity for transplanting"]`;

    try {
        if (provider === 'groq') {
            // Use secure backend proxy for farming advice
            const response = await fetch(`${API_BASE_URL}/ai/farming-advice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: prompt,
                    language: 'english'
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to get AI insights');
            }

            // Parse JSON from response
            try {
                return JSON.parse(data.data.response.trim());
            } catch {
                return [data.data.response.trim()];
            }
        } else {
            // Use Gemini
            const result = await geminiAI.getFarmingAdvice(prompt, 'english');
            // Parse JSON from Gemini's response
            try {
                return JSON.parse(result.response.trim());
            } catch {
                // If Gemini doesn't return valid JSON, return as single item
                return [result.response.trim()];
            }
        }
    } catch (error) {
        console.error('Error generating AI insights:', error);
        throw error;
    }
};

// Centralized getFarmingAdvice using configured provider
export const getFarmingAdvice = async (query: string, language: string = 'english'): Promise<{ response: string; category: string }> => {
    const config = getModelConfig();
    const provider = config.chatbot;

    console.log(`💬 [AI] Farming Advice using: ${provider.toUpperCase()} (Language: ${language})`);

    if (provider === 'groq') {
        return groqAI.getFarmingAdvice(query, language);
    } else {
        const result = await geminiAI.getFarmingAdvice(query, language);
        return {
            response: result.response,
            category: result.category
        };
    }
};

// Centralized getAIInsights using configured provider
export const getAIInsights = async (prompt: string): Promise<string[]> => {
    const config = getModelConfig();
    const provider = config.chatbot;

    console.log(`🧠 [AI] Weather Analysis Insights using: ${provider.toUpperCase()}`);

    try {
        if (provider === 'groq') {
            // Use secure backend proxy for AI insights
            const response = await fetch(`${API_BASE_URL}/ai/farming-advice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: prompt,
                    language: 'english'
                }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || 'Failed to get AI insights');
            }

            const content = data.data.response || '';

            // Split response into individual insights
            const insights = content
                .split('\n')
                .filter((line: string) => line.trim().length > 0)
                .map((line: string) => line.replace(/^\*\s*|\d+\.\s*/, '').trim())
                .filter((line: string) => line.length > 10);

            return insights.slice(0, 6);
        } else {
            // Use Gemini's getAIInsights
            const { getAIInsights: geminiGetAIInsights } = await import('./gemini');
            return geminiGetAIInsights(prompt);
        }
    } catch (error) {
        console.error('Error getting AI insights:', error);
        throw new Error('Failed to generate AI insights');
    }
};

// Re-export the gemini functions for backward compatibility
export { geminiAI, groqAI };
export type { AICropAnalysis };
