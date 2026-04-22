import express from 'express';
import OpenAI from 'openai';
import { GoogleGenAI, Type } from '@google/genai';

const router = express.Router();

const KNOWN_DISEASES_AND_PESTS = [
    'Healthy Plant',
    'Late Blight',
    'Early Blight',
    'Bacterial Spot',
    'Powdery Mildew',
    'Leaf Mold',
    'Septoria Leaf Spot',
    'Target Spot',
    'Black Rot',
    'Apple Scab',
    'Cedar Apple Rust',
    'Leaf Blight',
    'Leaf Scorch',
    'Common Rust',
    'Northern Leaf Blight',
    'Gray Leaf Spot',
    'Tomato Yellow Leaf Curl Virus',
    'Tomato Mosaic Virus',
    'Citrus Greening',
    'Aphid Infestation',
    'Whitefly Infestation',
    'Spider Mite Damage',
    'Thrips Infestation',
    'Mealybug Infestation',
    'Scale Insect Infestation'
];

const getGroqClient = (userApiKey = null) => {
    let keySource = 'none';
    let apiKey = null;

    if (userApiKey) {
        apiKey = userApiKey;
        keySource = 'User Settings';
    } else if (process.env.GROQ_API_KEY) {
        apiKey = process.env.GROQ_API_KEY;
        keySource = 'Server .env (GROQ_API_KEY)';
    } else if (process.env.VITE_GROQ_API_KEY) {
        apiKey = process.env.VITE_GROQ_API_KEY;
        keySource = 'Server .env (VITE_GROQ_API_KEY)';
    }

    if (!apiKey) {
        throw new Error('GROQ_API_KEY not configured. Add your key in Settings or configure server environment.');
    }

    const client = new OpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey
    });

    return { client, keySource };
};

const getGeminiClient = (userApiKey = null) => {
    let keySource = 'none';
    let apiKey = null;

    if (userApiKey) {
        apiKey = userApiKey;
        keySource = 'User Settings';
    } else if (process.env.GEMINI_API_KEY) {
        apiKey = process.env.GEMINI_API_KEY;
        keySource = 'Server .env (GEMINI_API_KEY)';
    } else if (process.env.VITE_GEMINI_API_KEY) {
        apiKey = process.env.VITE_GEMINI_API_KEY;
        keySource = 'Server .env (VITE_GEMINI_API_KEY)';
    }

    if (!apiKey) {
        throw new Error('GEMINI_API_KEY not configured. Add your key in Settings or configure server environment.');
    }

    const genAI = new GoogleGenAI({ apiKey });
    return { genAI, keySource };
};

const ensureDataUrlImage = (imageBase64) => {
    if (!imageBase64) return imageBase64;
    if (imageBase64.startsWith('data:')) return imageBase64;
    return `data:image/jpeg;base64,${imageBase64}`;
};

const extractJsonObject = (content) => {
    if (!content || typeof content !== 'string') {
        throw new Error('Empty response from AI');
    }

    const trimmed = content.trim();

    try {
        return JSON.parse(trimmed);
    } catch {
        // continue
    }

    const fenced = trimmed.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/i);
    if (fenced) {
        return JSON.parse(fenced[1]);
    }

    const firstBrace = trimmed.indexOf('{');
    const lastBrace = trimmed.lastIndexOf('}');
    if (firstBrace >= 0 && lastBrace > firstBrace) {
        return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    }

    throw new Error('Could not parse JSON from AI response');
};

const toNumberInRange = (value, fallback, min, max) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return fallback;
    return Math.max(min, Math.min(max, numeric));
};

const normalizeDiagnosis = (raw, fallbackDisease = 'Unknown') => {
    const disease = (raw?.disease && String(raw.disease).trim()) || fallbackDisease;
    const confidence = Math.round(toNumberInRange(raw?.confidence, 75, 0, 100));
    const affectedArea = Math.round(toNumberInRange(raw?.affectedArea, 40, 0, 100));

    const severityByConfidence = confidence >= 85 ? 'High' : confidence >= 65 ? 'Medium' : 'Low';
    const severityRaw = String(raw?.severity || '').trim();
    const severity = ['Low', 'Medium', 'High'].includes(severityRaw) ? severityRaw : severityByConfidence;

    const treatment = Array.isArray(raw?.treatment) ? raw.treatment.filter(Boolean).slice(0, 6) : [];
    const prevention = Array.isArray(raw?.prevention) ? raw.prevention.filter(Boolean).slice(0, 6) : [];

    return {
        isPlant: raw?.isPlant !== false,
        hasDisease: raw?.hasDisease ?? !disease.toLowerCase().includes('healthy'),
        disease,
        confidence,
        severity,
        description: String(raw?.description || '').trim(),
        treatment,
        prevention,
        affectedArea
    };
};

const logAIPrompt = (label, prompt, extra = {}) => {
    console.log(`\n================ ${label} (START) ================`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    if (Object.keys(extra).length > 0) {
        console.log('Metadata:', extra);
    }
    console.log('Prompt sent to AI:');
    console.log(prompt);
    console.log(`================ ${label} (END) ==================\n`);
};

router.post('/analyze-crop', async (req, res) => {
    try {
        const { imageBase64, userApiKey, customPrediction } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ success: false, error: 'Image is required' });
        }

        const { client, keySource } = getGroqClient(userApiKey);
        const formattedImage = ensureDataUrlImage(imageBase64);

        const cropHint = customPrediction?.crop ? `Likely crop from local model: ${customPrediction.crop}.` : '';
        const top1ConditionHint = customPrediction?.condition ? `Top-1 condition from local model: ${customPrediction.condition}.` : '';
        const topPredictionsHint = Array.isArray(customPrediction?.topPredictions) && customPrediction.topPredictions.length
            ? customPrediction.topPredictions
                .slice(0, 3)
                .map((p, i) => {
                    const label = p.condition || p.disease;
                    return `${i + 1}. ${label} (${p.confidence}%)`;
                })
                .join('\n')
            : '';

        const prompt = `You are a senior plant pathologist. Diagnose this crop image strictly from visible symptoms.

Return ONLY valid JSON with exact schema:
{
  "isPlant": boolean,
  "hasDisease": boolean,
  "disease": string,
  "confidence": number,
  "severity": "Low" | "Medium" | "High",
  "description": string,
  "treatment": string[],
  "prevention": string[],
  "affectedArea": number
}

Rules:
1) If image is not a plant leaf/crop, set isPlant=false.
2) If no clear disease/pest symptoms are visible, use disease="Healthy Plant" and hasDisease=false.
3) Prefer names from this list when possible:
${KNOWN_DISEASES_AND_PESTS.join(', ')}
4) Mention 1-2 visual clues in description.
5) Provide 3-5 concise treatment and prevention points each for Indian farming.
6) confidence and affectedArea must be in range 0-100.

Local model hints (for validation, not blind copy):
        ${customPrediction ? `Top-1: ${(customPrediction.condition || customPrediction.disease)} (${customPrediction.confidence}%)` : 'No local hint available'}
        ${top1ConditionHint}
        ${cropHint}
        ${topPredictionsHint ? `Top candidates:\n${topPredictionsHint}` : ''}`;

        logAIPrompt('GROQ CROP ANALYZE PROMPT', prompt, {
            route: '/api/ai/analyze-crop',
            hasCustomPrediction: !!customPrediction,
            hasUserApiKey: !!userApiKey
        });

        const response = await client.chat.completions.create({
            model: 'meta-llama/llama-4-scout-17b-16e-instruct',
            messages: [
                {
                    role: 'system',
                    content: 'You are an expert agronomist and plant pathologist. Output JSON only.'
                },
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: prompt },
                        { type: 'image_url', image_url: { url: formattedImage } }
                    ]
                }
            ],
            max_tokens: 1200,
            temperature: 0.1
        });

        const content = response.choices[0]?.message?.content;
        const parsed = extractJsonObject(content);
        const result = normalizeDiagnosis(parsed, customPrediction?.disease || 'Unknown');

        if (!result.isPlant) {
            return res.json({
                success: true,
                keySource,
                data: {
                    disease: 'Not a Plant',
                    confidence: 95,
                    severity: 'Low',
                    description: 'The uploaded image does not appear to be a plant. Please upload a clear image of a crop or plant.',
                    treatment: ['Upload a valid plant image'],
                    prevention: ['Ensure proper image capture'],
                    affectedArea: 0
                }
            });
        }

        let finalDisease = result.disease;
        if (
            customPrediction?.disease &&
            Number(customPrediction?.confidence) >= 90 &&
            result.confidence < 72
        ) {
            finalDisease = customPrediction.disease;
        }

        return res.json({
            success: true,
            keySource,
            data: {
                disease: finalDisease,
                confidence: result.confidence,
                severity: result.severity,
                description: result.description || 'Detected from visible disease/pest symptoms.',
                treatment: result.treatment.length ? result.treatment : ['Consult local agriculture expert for precise treatment'],
                prevention: result.prevention.length ? result.prevention : ['Monitor crop weekly and maintain field hygiene'],
                affectedArea: result.affectedArea
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze image'
        });
    }
});

router.post('/farming-advice', async (req, res) => {
    try {
        const { query, language = 'english', userApiKey } = req.body;
        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }

        const { client, keySource } = getGroqClient(userApiKey);
        const languagePrompts = {
            hindi: 'Respond in Hindi (Devanagari script).',
            marathi: 'Respond in Marathi (Devanagari script).',
            malayalam: 'Respond in Malayalam script.',
            punjabi: 'Respond in Punjabi (Gurmukhi script).',
            english: 'Respond in English.'
        };

        const prompt = `You are a helpful farming assistant for Indian farmers.
${languagePrompts[language] || languagePrompts.english}
Keep the answer concise (2-4 sentences), practical, and relevant.
Question: ${query}`;

        logAIPrompt('GROQ FARMING ADVICE PROMPT', prompt, {
            route: '/api/ai/farming-advice',
            language
        });

        const completion = await client.chat.completions.create({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'system', content: 'You are a knowledgeable farming assistant for Indian farmers.' },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 220
        });

        const responseText = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";
        const queryLower = query.toLowerCase();
        let category = 'general';
        if (queryLower.includes('weather') || queryLower.includes('rain')) category = 'weather';
        else if (queryLower.includes('crop')) category = 'crops';
        else if (queryLower.includes('fertilizer') || queryLower.includes('pest')) category = 'farming-practices';

        return res.json({
            success: true,
            keySource,
            data: { response: responseText.trim(), category }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get farming advice'
        });
    }
});

router.post('/gemini/analyze-crop', async (req, res) => {
    try {
        const { imageBase64, userApiKey } = req.body;
        if (!imageBase64) {
            return res.status(400).json({ success: false, error: 'Image is required' });
        }

        const { genAI, keySource } = getGeminiClient(userApiKey);
        const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

        let mimeType = 'image/jpeg';
        if (imageBase64.includes('data:image/png')) mimeType = 'image/png';
        else if (imageBase64.includes('data:image/webp')) mimeType = 'image/webp';

        const diagnosisSchema = {
            type: Type.OBJECT,
            properties: {
                isPlant: { type: Type.BOOLEAN },
                hasDisease: { type: Type.BOOLEAN },
                disease: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
                severity: { type: Type.STRING },
                description: { type: Type.STRING },
                treatment: { type: Type.ARRAY, items: { type: Type.STRING } },
                prevention: { type: Type.ARRAY, items: { type: Type.STRING } },
                affectedArea: { type: Type.NUMBER }
            },
            required: ['isPlant', 'hasDisease', 'disease', 'confidence', 'severity', 'description', 'treatment', 'prevention', 'affectedArea']
        };

        const prompt = `Analyze this crop image for disease or pest symptoms.
If image is not a plant, set isPlant=false.
If healthy, set disease='Healthy Plant' and hasDisease=false.
Return JSON only with actionable treatment and prevention.`;

        logAIPrompt('GEMINI CROP ANALYZE PROMPT', prompt, {
            route: '/api/ai/gemini/analyze-crop',
            mimeType,
            hasUserApiKey: !!userApiKey
        });

        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { data: base64Data, mimeType } }
                ]
            },
            config: {
                responseMimeType: 'application/json',
                responseSchema: diagnosisSchema,
                temperature: 0.2
            }
        });

        const parsed = extractJsonObject(response.text);
        const result = normalizeDiagnosis(parsed, 'Unknown');

        if (!result.isPlant) {
            return res.json({
                success: true,
                keySource,
                data: {
                    disease: 'Not a Plant',
                    confidence: 95,
                    severity: 'Low',
                    description: 'Please upload a clear image of a crop or plant.',
                    treatment: ['Upload a valid plant image'],
                    prevention: ['Ensure proper image capture'],
                    affectedArea: 0
                }
            });
        }

        return res.json({
            success: true,
            keySource,
            data: {
                disease: result.disease,
                confidence: result.confidence,
                severity: result.severity,
                description: result.description || 'Detected from visible disease/pest symptoms.',
                treatment: result.treatment.length ? result.treatment : ['Consult local agriculture expert for precise treatment'],
                prevention: result.prevention.length ? result.prevention : ['Monitor crop weekly and maintain field hygiene'],
                affectedArea: result.affectedArea
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze image'
        });
    }
});

router.post('/gemini/farming-advice', async (req, res) => {
    try {
        const { query, language = 'english', userApiKey } = req.body;
        if (!query) {
            return res.status(400).json({ success: false, error: 'Query is required' });
        }

        const { genAI, keySource } = getGeminiClient(userApiKey);
        const languageInstructions = {
            hindi: 'Respond in Hindi (Devanagari script).',
            marathi: 'Respond in Marathi (Devanagari script).',
            malayalam: 'Respond in Malayalam script.',
            punjabi: 'Respond in Punjabi (Gurmukhi script).',
            english: 'Respond in English.'
        };

        const prompt = `You are an expert agricultural advisor for Indian farmers.
Farmer question: "${query}"
${languageInstructions[language] || languageInstructions.english}
Provide practical and actionable advice in 2-4 sentences.`;

        logAIPrompt('GEMINI FARMING ADVICE PROMPT', prompt, {
            route: '/api/ai/gemini/farming-advice',
            language
        });

        const result = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: { temperature: 0.7 }
        });

        const responseText = String(result.text || '').trim() || 'Unable to generate response';
        const queryLower = query.toLowerCase();
        let category = 'general';
        if (queryLower.includes('weather') || queryLower.includes('rain')) category = 'weather';
        else if (queryLower.includes('disease') || queryLower.includes('pest')) category = 'disease';
        else if (queryLower.includes('fertilizer')) category = 'fertilizer';
        else if (queryLower.includes('crop')) category = 'crop';

        return res.json({
            success: true,
            keySource,
            data: {
                response: responseText,
                category,
                language
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to get farming advice'
        });
    }
});

export default router;
