import { geminiAI, AICropAnalysis } from './gemini';
import { groqAI } from './groq';

export type ModelProvider = 'gemini' | 'groq';

export interface ModelConfig {
    diseaseDetection: ModelProvider;
    chatbot: ModelProvider;
}

const SETTINGS_KEY = 'farm-connect-model-settings';

const getDefaultConfig = (): ModelConfig => ({
    diseaseDetection: 'groq',
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

export const analyzeCropImage = async (imageBase64: string): Promise<AICropAnalysis> => {
    const config = getModelConfig();
    const provider = config.diseaseDetection;

    console.log(`🔬 [AI] Crop Disease Analysis using: ${provider.toUpperCase()}`);

    if (provider === 'groq') {
        return groqAI.analyzeCropImage(imageBase64);
    } else {
        return geminiAI.analyzeCropImage(imageBase64);
    }
};

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
