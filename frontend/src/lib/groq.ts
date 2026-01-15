/**
 * Groq AI Service - Secure Proxy Version
 * API calls route through backend, with user API key fallback from Settings
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Get user's API key from localStorage (set in Profile > Settings)
const getUserApiKey = () => localStorage.getItem('groq_api_key') || null;

export interface AICropAnalysis {
    disease: string;
    confidence: number;
    severity: 'Low' | 'Medium' | 'High';
    description: string;
    treatment: string[];
    prevention: string[];
    affectedArea: number;
}

class GroqAIService {
    updateAPIKey(apiKey: string) {
        localStorage.setItem('groq_api_key', apiKey);
    }

    removeAPIKey() {
        localStorage.removeItem('groq_api_key');
    }

    async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
        try {
            console.log('🔬 [Groq] Sending image to secure backend proxy...');

            const response = await fetch(`${API_BASE_URL}/api/ai/analyze-crop`, {
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
                console.log(`🔑 [Groq] API key source: ${data.keySource}`);
            }
            console.log('✅ [Groq] Analysis received:', data.data.disease);
            return data.data;

        } catch (error) {
            console.error('Groq API proxy error:', error);
            throw new Error('Could not get a diagnosis. Please check your connection and try again.');
        }
    }

    async getFarmingAdvice(query: string, language: string = 'english'): Promise<{ response: string; category: string }> {
        try {
            console.log('💬 [Groq] Sending query to secure backend proxy...');

            const response = await fetch(`${API_BASE_URL}/api/ai/farming-advice`, {
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
                console.log(`🔑 [Groq] API key source: ${data.keySource}`);
            }
            console.log('✅ [Groq] Advice received');
            return data.data;

        } catch (error) {
            console.error('Groq API proxy error:', error);
            throw new Error('Could not get farming advice. Please check your connection and try again.');
        }
    }
}

export const groqAI = new GroqAIService();
