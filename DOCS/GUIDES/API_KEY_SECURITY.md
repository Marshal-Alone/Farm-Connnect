# API Key Security Implementation

> **Date**: January 2026  
> **Status**: ✅ Implemented

## Overview

This document describes the security implementation for protecting API keys (Groq and Gemini) from exposure in the browser's Network tab, while still allowing users to configure their own keys in Profile Settings.

## Problem

Previously, API calls to Groq and Gemini were made directly from the browser, exposing API keys in:

- Network tab request headers (`Authorization: Bearer <KEY>`)
- Browser developer tools
- Client-side JavaScript

## Solution: Backend Proxy with User Key Support

All AI API calls now route through secure backend endpoints. API keys are never exposed in the browser.

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Browser   │ ──►   │   Backend   │ ──►   │  Groq/Gemini│
│  (Frontend) │       │   (Proxy)   │       │    APIs     │
└─────────────┘       └─────────────┘       └─────────────┘
      │                     │
      │  userApiKey sent    │  Uses key from:
      │  in request body    │  1. User's key (if provided)
      │  (not headers!)     │  2. Server .env (fallback)
```

## API Key Priority Order

The backend checks for API keys in this order:

| Priority | Source | Description |
|----------|--------|-------------|
| **1st** | User's key from Settings | Stored in localStorage, sent via request body |
| **2nd** | Server `.env` file | `GROQ_API_KEY` / `GEMINI_API_KEY` |
| **3rd** | Hugging Face secrets | Same env vars, set in Space settings |

> **Note**: User keys are still sent to the backend, but in the **request body** (not headers), so they're not visible as Bearer tokens in the Network tab.

## Backend Endpoints

| Endpoint | Provider | Function |
|----------|----------|----------|
| `POST /api/ai/analyze-crop` | Groq | Disease detection (vision) |
| `POST /api/ai/farming-advice` | Groq | Chatbot/farming advice |
| `POST /api/ai/gemini/analyze-crop` | Gemini | Disease detection (vision) |
| `POST /api/ai/gemini/farming-advice` | Gemini | Chatbot/farming advice |

All endpoints accept an optional `userApiKey` in the request body.

## Files Modified

### Backend
- **`backend/api/ai.js`** - AI proxy endpoints with user key support
- **`backend/index.js`** - Added AI routes registration

### Frontend
- **`frontend/src/lib/groq.ts`** - Sends `userApiKey` from localStorage
- **`frontend/src/lib/gemini.ts`** - Sends `userApiKey` from localStorage
- **`frontend/src/lib/ai.ts`** - Hybrid mode uses backend proxy

## User Settings Integration

Users can add their own API keys in **Profile > Settings > AI Model Keys**:

```javascript
// Frontend reads from localStorage
const userApiKey = localStorage.getItem('groq_api_key');

// Sends to backend (not exposed in headers!)
fetch('/api/ai/analyze-crop', {
  method: 'POST',
  body: JSON.stringify({ 
    imageBase64: '...',
    userApiKey: userApiKey  // Backend uses this first
  })
});
```

## Environment Variables

### Server `.env` (fallback keys)

```env
GROQ_API_KEY=gsk_your_groq_key_here
GEMINI_API_KEY=your_gemini_key_here
```

### Frontend (Vercel)

```env
VITE_API_URL=https://your-backend-url.com
```

## Deployment Checklist

### Hugging Face Backend
- [ ] Push updated backend code
- [ ] Add `GROQ_API_KEY` secret in Space settings (optional fallback)
- [ ] Add `GEMINI_API_KEY` secret in Space settings (optional fallback)
- [ ] Restart the Space

### Vercel Frontend
- [ ] Push updated frontend code
- [ ] Set `VITE_API_URL` to Hugging Face backend URL
- [ ] Redeploy

## Security Benefits

1. **API keys hidden from Network tab** - Not visible as Bearer tokens
2. **User flexibility** - Users can use their own keys via Settings
3. **Server fallback** - Works even if user has no key configured
4. **Rate limiting possible** - Can add middleware to backend endpoints
5. **Audit logging** - All AI requests logged on server

## How It Works

```javascript
// Backend: backend/api/ai.js

const getGroqClient = (userApiKey = null) => {
    // Priority: 1. User key, 2. Server env
    const apiKey = userApiKey || process.env.GROQ_API_KEY;
    return new OpenAI({ apiKey });
};

// Same pattern for Gemini
const getGeminiClient = (userApiKey = null) => {
    const apiKey = userApiKey || process.env.GEMINI_API_KEY;
    return new GoogleGenAI({ apiKey });
};
```

## Troubleshooting

### "API_KEY not configured"
1. Check if user has added key in **Profile > Settings > AI Model Keys**
2. If not, ensure server `.env` has the key
3. Restart backend server after adding server keys

### Frontend can't reach backend
- Check `VITE_API_URL` is set correctly
- Ensure backend CORS allows your frontend origin
- Check backend is running and accessible
