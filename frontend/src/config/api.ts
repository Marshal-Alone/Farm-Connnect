/**
 * Centralized API Configuration
 * Update ONLY this file when changing backend URL
 */

// In development: uses Vite proxy (routes /api to backend)
// In production: uses VITE_API_URL from .env or direct URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

console.log('API_BASE_URL configured as:', API_BASE_URL);
