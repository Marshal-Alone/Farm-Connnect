import express from 'express';
import axios from 'axios';

const router = express.Router();
const BASE_URL = 'http://api.weatherapi.com/v1';

// GET /api/weather/forecast - Get forecast (includes current weather)
router.get('/forecast', async (req, res) => {
    try {
        const { q, days = 3 } = req.query;
        const apiKey = process.env.WEATHER_API;

        if (!apiKey) {
            return res.status(500).json({
                success: false,
                error: 'Weather API key not configured'
            });
        }

        if (!q) {
            return res.status(400).json({
                success: false,
                error: 'Location query (q) is required'
            });
        }

        const response = await axios.get(`${BASE_URL}/forecast.json`, {
            params: {
                key: apiKey,
                q,
                days,
                aqi: 'yes',
                alerts: 'yes'
            }
        });

        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        console.error('Error fetching weather data:', error.message);
        if (error.response) {
            res.status(error.response.status).json({
                success: false,
                error: error.response.data.error.message || 'Weather API error'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'Failed to fetch weather data'
            });
        }
    }
});

export default router;
