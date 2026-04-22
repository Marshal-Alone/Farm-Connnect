/**
 * Crop Advisory Service - Groq-based weather recommendations
 */

import OpenAI from 'openai';

export class CropAdvisoryService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    if (!apiKey) {
      throw new Error('Groq API key is required for crop advisory');
    }
    this.client = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1'
    });
  }

  /**
   * Generate personalized weather advice based on farmer's crops and actions
   * @param {Object} weatherData - Current and forecast weather
   * @param {Array} crops - Farmer's active crops
   * @param {Array} cropActions - Recent actions taken by farmer
   * @returns {Promise} AI recommendations object
   */
  async generateWeatherAdvice(weatherData, crops, cropActions) {
    try {
      // Build context for Groq
      const cropContext = this.buildCropContext(crops, cropActions);
      const weatherContext = this.buildWeatherContext(weatherData);

      const prompt = this.buildPrompt(cropContext, weatherContext);

      // Verbose prompt logging for viva/debug visibility
      console.log('\n================ WEATHER ADVISORY AI PROMPT (START) ================');
      console.log(`Timestamp: ${new Date().toISOString()}`);
      console.log(`Crops Count: ${Array.isArray(crops) ? crops.length : 0}`);
      console.log(`Recent Actions Count: ${Array.isArray(cropActions) ? cropActions.length : 0}`);
      console.log('Prompt sent to Groq:');
      console.log(prompt);
      console.log('================ WEATHER ADVISORY AI PROMPT (END) ==================\n');

      console.log('Calling Groq for crop advisory...');

      const message = await this.client.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ]
      });

      // Parse the response
      const responseText = message.choices[0].message.content || '';
      const advice = this.parseAdviceResponse(responseText);

      return {
        success: true,
        data: advice
      };
    } catch (error) {
      console.error('Error generating crop advice:', error);
      return {
        success: false,
        error: error.message || 'Failed to generate crop advice'
      };
    }
  }

  /**
   * Build crop and action context for the prompt
   */
  buildCropContext(crops, cropActions) {
    if (!crops || crops.length === 0) {
      return 'No crops tracked. Generic weather advice will be provided.';
    }

    let context = 'Farmer\'s Active Crops:\n';
    crops.forEach((crop, idx) => {
      const sowDate = new Date(crop.sowDate);
      const daysFromSowing = Math.floor((new Date() - sowDate) / (1000 * 60 * 60 * 24));
      const expectedHarvest = crop.expectedHarvestDate 
        ? Math.ceil((new Date(crop.expectedHarvestDate) - new Date()) / (1000 * 60 * 60 * 24))
        : 'unknown';

      context += `\n${idx + 1}. ${crop.cropName} (${crop.variety || 'unspecified'})
  - Sown: ${sowDate.toDateString()} (${daysFromSowing} days ago)
  - Area: ${crop.sowingArea} hectares
  - Status: ${crop.status}
  - Days to harvest: ${expectedHarvest}
  - Location: ${crop.fieldLocation?.address || 'not specified'}
  - Notes: ${crop.notes || 'none'}`;
    });

    // Add recent actions
    if (cropActions && cropActions.length > 0) {
      context += '\n\nRecent Actions (last 30 days):\n';
      const recentActions = cropActions.slice(0, 10); // Last 10 actions
      recentActions.forEach((action, idx) => {
        const actionDate = new Date(action.actionDate);
        const daysAgo = Math.floor((new Date() - actionDate) / (1000 * 60 * 60 * 24));
        context += `\n${idx + 1}. ${action.actionType} (${daysAgo} days ago) - ${action.details}`;
        if (action.quantity) {
          context += ` [${action.quantity} ${action.quantityUnit}]`;
        }
      });
    }

    return context;
  }

  /**
   * Build weather context for the prompt
   */
  buildWeatherContext(weatherData) {
    if (!weatherData) {
      return 'Weather data not available.';
    }

    let context = 'Current & Forecast Weather:\n';

    if (weatherData.location) {
      context += `\nLocation:
  - Name: ${weatherData.location.name || 'unknown'}
  - Region: ${weatherData.location.region || 'unknown'}
  - Country: ${weatherData.location.country || 'unknown'}
  - Latitude: ${weatherData.location.lat ?? 'unknown'}
  - Longitude: ${weatherData.location.lon ?? 'unknown'}
  - Timezone: ${weatherData.location.timezone || 'unknown'}
  - Local Time: ${weatherData.location.localtime || 'unknown'}`;
    }

    if (weatherData.current) {
      context += `\nCurrent Conditions:
  - Temperature: ${weatherData.current.temperature}°C (feels like ${weatherData.current.feelsLike}°C)
  - Humidity: ${weatherData.current.humidity}%
  - Wind Speed: ${weatherData.current.windSpeed} km/h
  - UV Index: ${weatherData.current.uvIndex}
  - Visibility: ${weatherData.current.visibility} km`;
    }

    if (weatherData.daily && weatherData.daily.length > 0) {
      context += '\n\n7-Day Forecast:\n';
      weatherData.daily.slice(0, 3).forEach((day, idx) => {
        context += `\nDay ${idx + 1} (${new Date(day.date).toDateString()}):
  - High: ${day.tempMax}°C, Low: ${day.tempMin}°C
  - Precipitation Probability: ${day.precipitationProbability}%
  - Sunrise: ${day.sunrise}, Sunset: ${day.sunset}`;
      });
    }

    return context;
  }

  /**
   * Build the prompt for Groq
   */
  buildPrompt(cropContext, weatherContext) {
    return `You are an expert Indian agricultural advisor. Based on the farmer's crops and weather conditions, provide specific, actionable advice.

${cropContext}

${weatherContext}

IMPORTANT: Provide advice in the following JSON format ONLY (no extra text):
{
  "todayActions": ["action 1", "action 2"],
  "monitoring": ["thing to monitor", "another thing"],
  "riskAlerts": [
    {"severity": "high/medium/low", "alert": "description"}
  ],
  "nextActions": ["action with timing"],
  "summary": "1-2 line summary of the advisory"
}

Guidelines:
- If farmer just sowed, focus on weather monitoring and germination conditions
- If crop is in flowering/fruiting stage, focus on pest risks from humidity/temperature
- If rainfall expected, warn about waterlogging and fungal diseases
- Provide specific, actionable advice for THIS CROP at THIS STAGE
- Consider farmer's recent actions (don't repeat what they just did)
- Focus on the next 3 days
- Be concise and practical

Remember: Farmer is an Indian smallholder. Give advice that's practical with available resources.`;
  }

  /**
   * Parse the AI response and extract structured data
   */
  parseAdviceResponse(responseText) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        todayActions: parsed.todayActions || [],
        monitoring: parsed.monitoring || [],
        riskAlerts: parsed.riskAlerts || [],
        nextActions: parsed.nextActions || [],
        summary: parsed.summary || 'See detailed recommendations above',
        rawAdvice: responseText
      };
    } catch (error) {
      console.error('Error parsing advice response:', error);
      // Return raw text if JSON parsing fails
      return {
        todayActions: [],
        monitoring: [],
        riskAlerts: [],
        nextActions: [],
        summary: 'See recommendations below',
        rawAdvice: responseText
      };
    }
  }
}
