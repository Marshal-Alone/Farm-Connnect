
import { GoogleGenAI, Type } from "@google/genai";
import { DiagnosisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      resolve(result.split(',')[1]);
    };
    reader.onerror = (error) => reject(error);
  });
};

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
    diseaseName: {
      type: Type.STRING,
      description: "The common name of the identified plant disease. If healthy, state 'Healthy'."
    },
    description: {
      type: Type.STRING,
      description: "A brief, easy-to-understand description of the disease or the plant's healthy state."
    },
    possibleCauses: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of common causes for this disease (e.g., 'Overwatering', 'Fungal infection from high humidity')."
    },
    suggestedTreatment: {
      type: Type.ARRAY,
      items: {
        type: Type.STRING
      },
      description: "A list of actionable steps or treatments to help the plant recover."
    }
  },
  required: ['isPlant', 'hasDisease', 'diseaseName', 'description', 'possibleCauses', 'suggestedTreatment']
};

export const identifyDisease = async (imageFile: File): Promise<DiagnosisResult> => {
  const base64Image = await fileToBase64(imageFile);

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: imageFile.type,
    },
  };

  const textPart = {
    text: "You are a specialized plant pathologist. Analyze this image of a plant. Identify if it has any diseases. If the image is not a plant, indicate that. If it is a healthy plant, state that. Provide the disease name, a simple description, possible causes, and suggested treatments. Respond with the JSON schema provided.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
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
    if (typeof result.isPlant === 'undefined' || typeof result.diseaseName === 'undefined') {
        throw new Error("Invalid response structure from API.");
    }

    return result as DiagnosisResult;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Could not get a diagnosis from the AI model.");
  }
};
