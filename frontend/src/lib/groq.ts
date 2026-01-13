import OpenAI from 'openai';

const getAPIKey = () => {
    const userAPIKey = localStorage.getItem('groq_api_key');
    return userAPIKey || import.meta.env.VITE_GROQ_API_KEY || '';
};

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
    private getClient() {
        const apiKey = getAPIKey();
        if (!apiKey) {
            throw new Error('Groq API key not configured. Please add it in Settings.');
        }
        return new OpenAI({
            baseURL: "https://api.groq.com/openai/v1",
            apiKey: apiKey,
            dangerouslyAllowBrowser: true,
        });
    }

    updateAPIKey(apiKey: string) {
        localStorage.setItem('groq_api_key', apiKey);
    }

    removeAPIKey() {
        localStorage.removeItem('groq_api_key');
    }

    async analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
        try {
            const client = this.getClient();

            const prompt = `You are a specialized plant pathologist and entomologist. Analyze this image of a crop/plant for diseases and pest infestations.
      
      If the image is not a plant, indicate that clearly.
      If it is a healthy plant with no visible issues, state that.
      
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
                            {
                                type: "text",
                                text: prompt
                            },
                            {
                                type: "image_url",
                                image_url: {
                                    url: imageBase64
                                }
                            }
                        ]
                    }
                ],
                max_tokens: 1500,
                temperature: 0.2,
            });

            const content = response.choices[0]?.message?.content;

            if (!content) {
                throw new Error("Empty response from Groq API");
            }

            // Try to extract JSON from the response
            let jsonText = content.trim();

            // If response contains markdown code blocks, extract the JSON
            const jsonMatch = jsonText.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
                jsonText = jsonMatch[1];
            }

            const result = JSON.parse(jsonText);

            // Basic validation
            if (typeof result.isPlant === 'undefined' || typeof result.disease === 'undefined') {
                throw new Error("Invalid response structure from Groq API.");
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
            console.error('Groq API error:', error);
            throw new Error('Could not get a diagnosis from the Groq model. Please check your API key and try again.');
        }
    }

    async getFarmingAdvice(query: string, language: string = 'english'): Promise<{ response: string; category: string }> {
        try {
            const client = this.getClient();

            const languagePrompts = {
                hindi: 'कृपया हिंदी में जवाब दें।',
                marathi: 'कृपया मराठीत उत्तर द्या।',
                malayalam: 'ദയവായി മലയാളത്തിൽ ഉത്തരം നൽകുക.',
                punjabi: 'ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ।',
                english: 'Please respond in English.'
            };

            const languageInstruction = languagePrompts[language as keyof typeof languagePrompts] || languagePrompts.english;

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

            const response = completion.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

            // Determine category based on keywords
            const queryLower = query.toLowerCase();
            let category = 'general';
            if (queryLower.includes('weather') || queryLower.includes('मौसम') || queryLower.includes('rain')) {
                category = 'weather';
            } else if (queryLower.includes('crop') || queryLower.includes('फसल') || queryLower.includes('पीक')) {
                category = 'crops';
            } else if (queryLower.includes('fertilizer') || queryLower.includes('खाद') || queryLower.includes('pest')) {
                category = 'farming-practices';
            }

            return {
                response: response.trim(),
                category
            };

        } catch (error) {
            console.error('Groq API error:', error);
            throw new Error('Could not get farming advice from Groq. Please check your API key and try again.');
        }
    }
}

export const groqAI = new GroqAIService();
