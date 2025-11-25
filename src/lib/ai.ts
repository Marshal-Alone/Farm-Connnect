import { geminiAI, AICropAnalysis } from './gemini';
import { groqAI } from './groq';

export type ModelProvider = 'gemini' | 'groq';

export interface ModelConfig {
    diseaseDetection: ModelProvider;
    chatbot: ModelProvider;
}

const SETTINGS_KEY = 'farm-connect-model-settings';

const getDefaultConfig = (): ModelConfig => ({
    diseaseDetection: 'gemini',
    chatbot: 'gemini',
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

    if (provider === 'groq') {
        return groqAI.analyzeCropImage(imageBase64);
    } else {
        return geminiAI.analyzeCropImage(imageBase64);
    }
};

// Re-export the gemini functions for backward compatibility
export { geminiAI, groqAI };
export type { AICropAnalysis };
