import { geminiAI, AICropAnalysis } from './gemini';
import { groqAI } from './groq';
import { customModelAI } from './customModel';

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

        // Step 2: Validate/enhance with Groq
        console.log('🔍 [Hybrid] Step 2: Validating with Groq LLaMA Vision...');

        const groqApiKey = localStorage.getItem('groq_api_key');
        if (!groqApiKey) {
            console.log('⚠️ [Hybrid] Groq API key not found, using custom model result only');
            if (customResult) return customResult;
            throw new Error('Groq API key required for hybrid mode');
        }

        // Create validation prompt that includes custom model's prediction
        const validationPrompt = customResult
            ? `Analyze this plant image. Our ML model predicted: "${customResult.disease}" with ${customResult.confidence}% confidence.

Please verify this diagnosis. If you agree, confirm it. If you disagree, provide the correct diagnosis.

Respond in JSON format:
{
    "agrees": true/false,
    "disease": "Correct disease name",
    "confidence": 0-100,
    "severity": "Low/Medium/High",
    "description": "Brief description",
    "treatment": ["Treatment 1", "Treatment 2"],
    "prevention": ["Prevention 1", "Prevention 2"],
    "affectedArea": 0-100
}`
            : `Analyze this plant image for any diseases. Respond in JSON format:
{
    "disease": "Disease name or 'Healthy Plant'",
    "confidence": 0-100,
    "severity": "Low/Medium/High",
    "description": "Brief description",
    "treatment": ["Treatment 1", "Treatment 2"],
    "prevention": ["Prevention 1", "Prevention 2"],
    "affectedArea": 0-100
}`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${groqApiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.2-90b-vision-preview',
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: validationPrompt },
                            {
                                type: 'image_url',
                                image_url: {
                                    url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                                }
                            }
                        ]
                    }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            console.log('⚠️ [Hybrid] Groq validation failed, using custom model result');
            if (customResult) return customResult;
            throw new Error('Groq API request failed');
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || '';

        // Parse Groq's response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            console.log('⚠️ [Hybrid] Could not parse Groq response, using custom model result');
            if (customResult) return customResult;
            throw new Error('Invalid Groq response format');
        }

        const groqResult = JSON.parse(jsonMatch[0]);

        // Log the validation result
        if (customResult && groqResult.agrees !== undefined) {
            if (groqResult.agrees) {
                console.log('✅ [Hybrid] Groq CONFIRMED custom model prediction!');
            } else {
                console.log(`🔄 [Hybrid] Groq CORRECTED prediction: ${customResult.disease} → ${groqResult.disease}`);
            }
        }

        // Build final result matching AICropAnalysis interface
        const finalResult: AICropAnalysis = {
            disease: groqResult.disease || customResult?.disease || 'Unknown',
            confidence: groqResult.confidence || customResult?.confidence || 80,
            severity: (groqResult.severity || customResult?.severity || 'Medium') as 'Low' | 'Medium' | 'High',
            description: groqResult.description || customResult?.description || '',
            treatment: groqResult.treatment || customResult?.treatment || [],
            prevention: groqResult.prevention || customResult?.prevention || [],
            affectedArea: groqResult.affectedArea || customResult?.affectedArea || 50
        };

        console.log(`✓ [Hybrid] Final result: ${finalResult.disease} (${finalResult.confidence}%)`);
        return finalResult;

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
            const groqApiKey = localStorage.getItem('groq_api_key');
            if (!groqApiKey) throw new Error('Groq API key not configured');

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are an agricultural weather advisor. Return only valid JSON arrays.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.5,
                    max_tokens: 300,
                }),
            });

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '[]';
            return JSON.parse(content.trim());
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
            const groqApiKey = localStorage.getItem('groq_api_key');
            if (!groqApiKey) throw new Error('Groq API key not configured');

            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are an agricultural expert. Provide practical advice.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content || '';

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
