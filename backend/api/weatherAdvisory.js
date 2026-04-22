/**
 * Weather Advisory API - Get AI crop recommendations based on weather and crops
 */

import express from 'express';
import { getDatabase, collections } from '../config/database.js';
import { CropAdvisoryService } from '../lib/cropAdvisory.js';
import { authenticateToken } from './users.js';

const router = express.Router();

const COLLECTIONS = {
  CROPS: 'farmerCrops',
  ACTIONS: 'cropActions'
};

/**
 * POST /api/weather-advice - Get AI recommendations based on weather + crops
 * Body: {
 *   weatherData: { current, daily, location },
 *   cropIds: [optional, specific crops to analyze]
 * }
 */
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { weatherData } = req.body;

    if (!weatherData) {
      return res.status(400).json({
        success: false,
        error: 'weatherData is required'
      });
    }

    const db = await getDatabase();
    const cropsCollection = db.collection(COLLECTIONS.CROPS);
    const actionsCollection = db.collection(COLLECTIONS.ACTIONS);

    // Get farmer's active crops
    const crops = await cropsCollection
      .find({
        userId: req.user.userId,
        status: { $in: ['sowing', 'growing', 'mature'] }
      })
      .toArray();

    if (crops.length === 0) {
      // Return generic weather advice if no crops
      return res.json({
        success: true,
        data: {
          todayActions: ['Monitor weather conditions'],
          monitoring: ['Weather forecast', 'Soil moisture'],
          riskAlerts: [],
          nextActions: ['Track your crops to get personalized advice'],
          summary: 'Add crops to get AI-powered weather recommendations',
          hasUserCrops: false
        }
      });
    }

    // Get recent actions (last 30 days) for context
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentActions = await actionsCollection
      .find({
        userId: req.user.userId,
        actionDate: { $gte: thirtyDaysAgo }
      })
      .sort({ actionDate: -1 })
      .limit(20)
      .toArray();

    // Initialize Groq API
    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return res.status(500).json({
        success: false,
        error: 'Groq API key not configured on server'
      });
    }

    const advisoryService = new CropAdvisoryService(groqApiKey);

    // Generate recommendations
    const advice = await advisoryService.generateWeatherAdvice(
      weatherData,
      crops,
      recentActions
    );

    if (!advice.success) {
      return res.status(500).json({
        success: false,
        error: advice.error || 'Failed to generate crop advice'
      });
    }

    // Optionally cache the recommendation
    try {
      const recommendationsCollection = db.collection('cropRecommendations');
      await recommendationsCollection.insertOne({
        userId: req.user.userId,
        crops: crops.map(c => c._id),
        weatherTimestamp: new Date(),
        recommendation: advice.data.summary,
        actions: advice.data.todayActions,
        monitoring: advice.data.monitoring,
        riskLevel: advice.data.riskAlerts.length > 0 ? 'high' : 'low',
        nextActions: advice.data.nextActions,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // TTL: 24 hours
      });
    } catch (cacheError) {
      console.warn('Failed to cache recommendation:', cacheError);
      // Not critical, continue
    }

    res.json({
      success: true,
      data: {
        ...advice.data,
        hasUserCrops: true,
        cropsCount: crops.length,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Error generating weather advice:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate weather advice: ' + error.message
    });
  }
});

/**
 * GET /api/weather-advice/last - Get last cached recommendation
 */
router.get('/last', authenticateToken, async (req, res) => {
  try {
    const db = await getDatabase();
    const recommendationsCollection = db.collection('cropRecommendations');

    const lastAdvice = await recommendationsCollection
      .findOne(
        { userId: req.user.userId },
        { sort: { createdAt: -1 } }
      );

    if (!lastAdvice) {
      return res.json({
        success: true,
        data: null,
        message: 'No cached recommendations available'
      });
    }

    res.json({
      success: true,
      data: lastAdvice
    });
  } catch (error) {
    console.error('Error fetching last recommendation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recommendation'
    });
  }
});

export default router;
