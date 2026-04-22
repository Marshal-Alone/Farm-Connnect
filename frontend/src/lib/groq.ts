/**
 * Groq AI Service - Secure Proxy Version
 * API calls route through backend, with user API key fallback from Settings
 */

import { API_BASE_URL } from '../config/api';
import { customModelAI } from './customModel';

// Get user's API key from localStorage (set in Profile > Settings)
const getUserApiKey = () => localStorage.getItem('groq_api_key') || null;
const getAuthToken = () => localStorage.getItem('FarmConnect_token') || '';

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
    private async getCustomHint(imageBase64: string) {
        try {
            const hint = await Promise.race([
                customModelAI.analyzeCropImage(imageBase64),
                new Promise<null>((resolve) => setTimeout(() => resolve(null), 2500))
            ]);

            if (!hint) return null;

            return {
                disease: hint.disease,
                condition: (hint as any).condition || null,
                confidence: hint.confidence,
                crop: (hint as any).crop || null,
                topPredictions: (hint as any).topPredictions || null
            };
        } catch {
            return null;
        }
    }

    updateAPIKey(apiKey: string) {
        localStorage.setItem('groq_api_key', apiKey);
    }

    removeAPIKey() {
        localStorage.removeItem('groq_api_key');
    }

    async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
        try {
            console.log('🔬 [Groq] Sending image to secure backend proxy...');
            const customPrediction = await this.getCustomHint(imageBase64);

            const response = await fetch(`${API_BASE_URL}/ai/analyze-crop`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    imageBase64,
                    userApiKey: getUserApiKey(), // Send user's key as fallback
                    customPrediction
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
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('Groq API proxy error:', errorMsg);
            // Preserve specific error messages from the API
            throw new Error(errorMsg.includes('400') || errorMsg.includes('invalid')
                ? errorMsg
                : 'Could not get a diagnosis. Please check your connection and try again.');
        }
    }

    async getFarmingAdvice(query: string, language: string = 'english'): Promise<{ response: string; category: string }> {
        try {
            if (!getAuthToken()) {
                throw new Error('Access token required. Please log in to use Groq assistant.');
            }
            console.log('💬 [Groq] Sending query to secure backend proxy...');

            const response = await fetch(`${API_BASE_URL}/ai/farming-advice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
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
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            console.error('Groq API proxy error:', errorMsg);
            throw new Error(errorMsg.includes('400') || errorMsg.includes('invalid')
                ? errorMsg
                : 'Could not get farming advice. Please check your connection and try again.');
        }
    }
}

export const groqAI = new GroqAIService();
