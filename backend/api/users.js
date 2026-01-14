import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { getDatabase, collections } from '../config/database.js';
import { ObjectId } from 'mongodb';


const router = express.Router();

// JWT Secret (should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'farmconnect_secret_key_change_in_production';

// Helper function to generate JWT token
function generateToken(user) {
    return jwt.sign(
        {
            userId: user._id.toString(),
            email: user.email,
            name: user.name
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
}

// POST /api/auth/register - Register new user
router.post('/register', async (req, res) => {
    console.log('📋 [POST /api/auth/register] Request received', { email: req.body.email, name: req.body.name, timestamp: new Date().toISOString() });
    try {
        const {
            name,
            email,
            password,
            phone,
            location,
            language,
            farmSize,
            crops
        } = req.body;

        // Validate required fields
        if (!name || !email || !password || !phone) {
            return res.status(400).json({
                success: false,
                error: 'Name, email, password, and phone are required'
            });
        }

        const db = await getDatabase();
        const usersCollection = db.collection(collections.users);

        // Check if user already exists
        const existingUser = await usersCollection.findOne({
            $or: [{ email }, { phone }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                error: 'User with this email or phone already exists'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = {
            name,
            email,
            password: hashedPassword,
            phone,
            location: location || 'India',
            language: language || 'hindi',
            farmSize: farmSize || 0,
            crops: crops || [],
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await usersCollection.insertOne(newUser);

        // Generate token
        const user = { ...newUser, _id: result.insertedId };
        const token = generateToken(user);

        // Remove password from response
        delete user.password;

        console.log('✅ [POST /api/auth/register] Success', { userId: user._id, email: user.email, timestamp: new Date().toISOString() });
        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('❌ [POST /api/auth/register] CRITICAL ERROR:', error);

        // Ensure we don't crash if res is already finished
        if (!res.headersSent) {
            res.status(500).json({
                success: false,
                error: error.message || 'Failed to register user',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined
            });
        }
    }
});

// POST /api/auth/login - Login user
router.post('/login', async (req, res) => {
    console.log('📋 [POST /api/auth/login] Request received', { identifier: req.body.identifier, timestamp: new Date().toISOString() });
    try {
        const { identifier, password } = req.body; // identifier can be email or phone

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email/phone and password are required'
            });
        }

        const db = await getDatabase();
        const usersCollection = db.collection(collections.users);

        // Find user by email or phone
        const user = await usersCollection.findOne({
            $or: [{ email: identifier }, { phone: identifier }]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({
                success: false,
                error: 'Invalid credentials'
            });
        }

        // Generate token
        const token = generateToken(user);

        // Remove password from response
        delete user.password;
        console.log('✅ [POST /api/auth/login] Success', { userId: user._id, email: user.email, timestamp: new Date().toISOString() });
        res.json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        console.error('❌ [POST /api/auth/login] Failed', { error: error.message, timestamp: new Date().toISOString() });
        console.error('Error logging in:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to login'
        });
    }
});

// Middleware to verify JWT token
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            error: 'Access token required'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                error: 'Invalid or expired token'
            });
        }

        req.user = user;
        next();
    });
}

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const db = await getDatabase();
        const usersCollection = db.collection(collections.users);

        // Convert userId to ObjectId
        let userId = req.user.userId;
        if (typeof userId === 'string' && ObjectId.isValid(userId)) {
            userId = new ObjectId(userId);
        }

        const user = await usersCollection.findOne(
            { _id: userId },
            { projection: { password: 0 } }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
});



export default router;
