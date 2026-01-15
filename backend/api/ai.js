import express from 'express';
import OpenAI from 'openai';
import { GoogleGenAI, Type } from '@google/genai';

const router = express.Router();

// Get Groq API key - user key first, server env as fallback
const getGroqClient = (userApiKey = null) => {
    // Priority: 1. User-provided key from Settings, 2. Server env (Hugging Face secrets)
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

    console.log(`🔑 [Groq] Using API key from: ${keySource}`);

    const client = new OpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: apiKey,
    });

    return { client, keySource };
};

// POST /api/ai/analyze-crop - Analyze crop image for diseases
router.post('/analyze-crop', async (req, res) => {
    console.log('🔬 [POST /api/ai/analyze-crop] Request received');
    try {
        const { imageBase64, userApiKey, customPrediction } = req.body;

        if (!imageBase64) {
            return res.status(400).json({
                success: false,
                error: 'Image is required'
            });
        }

        const { client, keySource } = getGroqClient(userApiKey);

        // Ensure the image has proper data URL format
        let formattedImage = imageBase64;
        if (!imageBase64.startsWith('data:')) {
            formattedImage = `data:image/jpeg;base64,${imageBase64}`;
        }

        let prompt = `You are a specialized plant pathologist and entomologist. Analyze this image of a crop/plant for diseases and pest infestations.
      
      If the image is not a plant, indicate that clearly.
      If it is a healthy plant with no visible issues, state that.`;

        if (customPrediction) {
            prompt += `\n\nHYBRID ANALYSIS HINT: A local model prediction suggest this might be: "${customPrediction.disease}" (${customPrediction.confidence}% confidence). Use this as a starting point but do your own independent verification.`;
        }

        prompt += `
      
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
      For pests, set disease name to the specific pest (e.g., "Aphid Infestation", "Whitefly Attack", "Spider Mite Damage").
      
      Respond with a JSON object with this exact structure:
      {
        "isPlant": boolean (true if image is of a plant),
        "hasDisease": boolean (true if plant has disease OR pest infestation),
        "disease": string (name of disease/pest or "Healthy Plant"),
        "confidence": number (0-100),
        "severity": string ("Low", "Medium", or "High"),
        "description": string (brief description with visual evidence),
        "treatment": array of strings (treatment steps),
        "prevention": array of strings (prevention methods),
        "affectedArea": number (percentage 0-100)
      }`;

        const response = await client.chat.completions.create({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: prompt },
                        {
                            type: "image_url",
                            image_url: { url: formattedImage }
                        }
                    ]
                }
            ],
            max_tokens: 1500,
            temperature: 0.2,
        });

        const content = response.choices[0]?.message?.content;

        if (!content) {
            throw new Error("Empty response from AI");
        }

        // Extract JSON from response
        let jsonText = content.trim();
        const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        }

        const result = JSON.parse(jsonText);

        // Validate response
        if (typeof result.isPlant === 'undefined' || typeof result.disease === 'undefined') {
            throw new Error("Invalid response structure from AI");
        }

        // Handle non-plant images
        if (!result.isPlant) {
            return res.json({
                success: true,
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

        console.log('✅ [POST /api/ai/analyze-crop] Analysis complete:', result.disease);
        res.json({
            success: true,
            keySource,
            data: {
                disease: result.disease,
                confidence: Math.round(result.confidence),
                severity: result.severity,
                description: result.description,
                treatment: result.treatment,
                prevention: result.prevention,
                affectedArea: Math.round(result.affectedArea)
            }
        });

    } catch (error) {
        console.error('❌ [POST /api/ai/analyze-crop] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze image'
        });
    }
});

// POST /api/ai/farming-advice - Get farming advice
router.post('/farming-advice', async (req, res) => {
    console.log('💬 [POST /api/ai/farming-advice] Request received');
    try {
        const { query, language = 'english', userApiKey } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query is required'
            });
        }

        const { client, keySource } = getGroqClient(userApiKey);

        const languagePrompts = {
            hindi: 'कृपया हिंदी में जवाब दें।',
            marathi: 'कृपया मराठीत उत्तर द्या।',
            malayalam: 'ദയവായി മലയാളത്തിൽ ഉത്തരം നൽകുക.',
            punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।',
            english: 'Please respond in English.'
        };

        const languageInstruction = languagePrompts[language] || languagePrompts.english;

        const prompt = `You are a helpful farming assistant for Indian farmers. Answer the following question about farming, agriculture, crops, weather, or rural life.

${languageInstruction}

Keep your response concise (2-3 sentences), practical, and relevant to Indian farming context.

Question: ${query}`;

        const completion = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: "You are a knowledgeable farming assistant helping Indian farmers with agricultural advice."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
        });

        const responseText = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

        // Determine category
        const queryLower = query.toLowerCase();
        let category = 'general';
        if (queryLower.includes('weather') || queryLower.includes('मौसम') || queryLower.includes('rain')) {
            category = 'weather';
        } else if (queryLower.includes('crop') || queryLower.includes('फसल') || queryLower.includes('पीक')) {
            category = 'crops';
        } else if (queryLower.includes('fertilizer') || queryLower.includes('खाद') || queryLower.includes('pest')) {
            category = 'farming-practices';
        }

        console.log('✅ [POST /api/ai/farming-advice] Response generated');
        res.json({
            success: true,
            keySource,
            data: {
                response: responseText.trim(),
                category
            }
        });

    } catch (error) {
        console.error('❌ [POST /api/ai/farming-advice] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get farming advice'
        });
    }
});

// ============================================
// GEMINI AI ENDPOINTS (Google Gemini)
// ============================================

// Get Gemini API key - user key first, server env as fallback
const getGeminiClient = (userApiKey = null) => {
    // Priority: 1. User-provided key from Settings, 2. Server env (Hugging Face secrets)
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

    console.log(`🔑 [Gemini] Using API key from: ${keySource}`);

    const genAI = new GoogleGenAI({ apiKey });
    return { genAI, keySource };
};

// POST /api/ai/gemini/analyze-crop - Analyze crop image using Gemini
router.post('/gemini/analyze-crop', async (req, res) => {
    console.log('🔬 [POST /api/ai/gemini/analyze-crop] Request received');
    try {
        const { imageBase64, userApiKey } = req.body;

        if (!imageBase64) {
            return res.status(400).json({
                success: false,
                error: 'Image is required'
            });
        }

        const { genAI, keySource } = getGeminiClient(userApiKey);

        // Remove data URL prefix if present
        const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

        // Determine MIME type
        let mimeType = 'image/jpeg';
        if (imageBase64.includes('data:image/png')) {
            mimeType = 'image/png';
        } else if (imageBase64.includes('data:image/webp')) {
            mimeType = 'image/webp';
        }

        const diagnosisSchema = {
            type: Type.OBJECT,
            properties: {
                isPlant: { type: Type.BOOLEAN, description: "Is the image of a plant?" },
                hasDisease: { type: Type.BOOLEAN, description: "Does the plant have a disease?" },
                disease: { type: Type.STRING, description: "Disease name or 'Healthy Plant'" },
                confidence: { type: Type.NUMBER, description: "Confidence level (0-100)" },
                severity: { type: Type.STRING, description: "Low, Medium, or High" },
                description: { type: Type.STRING, description: "Brief description" },
                treatment: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Treatment steps" },
                prevention: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Prevention methods" },
                affectedArea: { type: Type.NUMBER, description: "Percentage affected (0-100)" }
            },
            required: ['isPlant', 'hasDisease', 'disease', 'confidence', 'severity', 'description', 'treatment', 'prevention', 'affectedArea']
        };

        const prompt = `You are a specialized plant pathologist. Analyze this crop/plant image for diseases and pests.
        If not a plant, set isPlant: false. If healthy, set hasDisease: false.
        Look for diseases (blight, rust, mildew) and pests (aphids, whiteflies, mites).
        Provide practical treatment and prevention for Indian farmers.`;

        const response = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: {
                parts: [
                    { text: prompt },
                    { inlineData: { data: base64Data, mimeType } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: diagnosisSchema,
                temperature: 0.2,
            },
        });

        const result = JSON.parse(response.text.trim());

        if (!result.isPlant) {
            return res.json({
                success: true,
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

        console.log('✅ [POST /api/ai/gemini/analyze-crop] Analysis complete:', result.disease);
        res.json({
            success: true,
            keySource,
            data: {
                disease: result.disease,
                confidence: Math.round(result.confidence),
                severity: result.severity,
                description: result.description,
                treatment: result.treatment,
                prevention: result.prevention,
                affectedArea: Math.round(result.affectedArea)
            }
        });

    } catch (error) {
        console.error('❌ [POST /api/ai/gemini/analyze-crop] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to analyze image'
        });
    }
});

// POST /api/ai/gemini/farming-advice - Get farming advice using Gemini
router.post('/gemini/farming-advice', async (req, res) => {
    console.log('💬 [POST /api/ai/gemini/farming-advice] Request received');
    try {
        const { query, language = 'english', userApiKey } = req.body;

        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Query is required'
            });
        }

        const { genAI, keySource } = getGeminiClient(userApiKey);

        const languageInstructions = {
            hindi: 'Respond in Hindi (Devanagari script)',
            marathi: 'Respond in Marathi (Devanagari script)',
            malayalam: 'Respond in Malayalam (Malayalam script)',
            punjabi: 'Respond in Punjabi (Gurmukhi script)',
            english: 'Respond in English'
        };

        const prompt = `You are an expert agricultural advisor for Indian farmers.
            The farmer asks: "${query}"
            ${languageInstructions[language] || 'Respond in English'}
            Provide practical, actionable advice for Indian farming conditions.
            Keep the response concise (2-4 sentences).`;

        const result = await genAI.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: { parts: [{ text: prompt }] },
            config: { temperature: 0.7 },
        });

        const responseText = result.text.trim();

        // Determine category
        const queryLower = query.toLowerCase();
        let category = 'general';
        if (queryLower.includes('weather') || queryLower.includes('rain') || queryLower.includes('मौसम')) {
            category = 'weather';
        } else if (queryLower.includes('disease') || queryLower.includes('pest') || queryLower.includes('बीमारी')) {
            category = 'disease';
        } else if (queryLower.includes('fertilizer') || queryLower.includes('खाद')) {
            category = 'fertilizer';
        } else if (queryLower.includes('crop') || queryLower.includes('फसल')) {
            category = 'crop';
        }

        console.log('✅ [POST /api/ai/gemini/farming-advice] Response generated');
        res.json({
            success: true,
            keySource,
            data: {
                response: responseText,
                category,
                language
            }
        });

    } catch (error) {
        console.error('❌ [POST /api/ai/gemini/farming-advice] Error:', error.message);
        res.status(500).json({
            success: false,
            error: error.message || 'Failed to get farming advice'
        });
    }
});

export default router;
