import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (one level up from backend/)
dotenv.config({ path: join(__dirname, '..', '.env') });

import cors from 'cors';

// Import API routes
import machineryRoutes from './api/machinery.js';
import bookingsRoutes from './api/bookings.js';
import messagesRoutes from './api/messages.js';
import usersRoutes from './api/users.js';
import weatherRoutes from './api/weather.js';
import diseasesRoutes from './api/diseases.js';
import schemesRoutes from './api/schemes.js';
import aiRoutes from './api/ai.js';

const app = express();
const PORT = Number(process.env.PORT) || 4174;

// Keep-alive tracking
// const serverHealth = {
//     startTime: Date.now(),
//     lastPing: Date.now(),
//     nextPing: Date.now() + (10 * 60 * 1000), // 10 minutes
//     pingCount: 0,
//     pingInterval: 10 * 60 * 1000, // 10 minutes in milliseconds
//     status: 'active'
// };

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS middleware - MUST be before routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }

    next();
});

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// API Routes
app.use('/api/auth', usersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/machinery', machineryRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/diseases', diseasesRoutes);
app.use('/api/schemes', schemesRoutes);
app.use('/api/ai', aiRoutes);

// Serve static files from frontend/dist directory
app.use(express.static(join(__dirname, '..', 'frontend', 'dist')));

// Helper function to format duration
function formatDuration(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
}

// Keep-alive ping endpoint
app.post("/api/ping", (req, res) => {
    serverHealth.lastPing = Date.now();
    serverHealth.nextPing = Date.now() + serverHealth.pingInterval;
    serverHealth.pingCount++;
    serverHealth.status = 'active';

    console.log(`Keep-alive ping received (#${serverHealth.pingCount})`);

    res.status(200).json({
        message: "Pong",
        timestamp: serverHealth.lastPing,
        nextPing: serverHealth.nextPing
    });
});

// Health dashboard endpoint
app.get("/api/health", (req, res) => {
    const now = Date.now();
    const uptime = now - serverHealth.startTime;
    const timeSinceLastPing = now - serverHealth.lastPing;
    const timeUntilNextPing = serverHealth.nextPing - now;

    // Calculate uptime in a human-readable format
    const uptimeSeconds = Math.floor(uptime / 1000);
    const uptimeDays = Math.floor(uptimeSeconds / 86400);
    const uptimeHours = Math.floor((uptimeSeconds % 86400) / 3600);
    const uptimeMinutes = Math.floor((uptimeSeconds % 3600) / 60);
    const uptimeSecsRemaining = uptimeSeconds % 60;

    res.status(200).json({
        status: serverHealth.status,
        uptime: {
            milliseconds: uptime,
            formatted: `${uptimeDays}d ${uptimeHours}h ${uptimeMinutes}m ${uptimeSecsRemaining}s`
        },
        lastPing: {
            timestamp: serverHealth.lastPing,
            ago: timeSinceLastPing,
            formatted: formatDuration(timeSinceLastPing)
        },
        nextPing: {
            timestamp: serverHealth.nextPing,
            in: Math.max(0, timeUntilNextPing),
            formatted: formatDuration(Math.max(0, timeUntilNextPing))
        },
        pingCount: serverHealth.pingCount,
        pingInterval: {
            milliseconds: serverHealth.pingInterval,
            formatted: formatDuration(serverHealth.pingInterval)
        },
        startTime: serverHealth.startTime,
        apiEndpoints: {
            machinery: '/api/machinery',
            bookings: '/api/bookings',
            messages: '/api/messages',
            diseases: '/api/diseases',
            schemes: '/api/schemes'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📊 Health endpoint: http://localhost:${PORT}/api/health`);
    console.log(`💓 Ping endpoint: http://localhost:${PORT}/api/ping`);
    console.log(`🚜 Machinery API: http://localhost:${PORT}/api/machinery`);
    console.log(`📅 Bookings API: http://localhost:${PORT}/api/bookings`);
    console.log(`💬 Messages API: http://localhost:${PORT}/api/messages`);
});

