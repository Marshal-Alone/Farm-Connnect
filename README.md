# 🌾 Farm Connect: Pathway to Progress

> A comprehensive, AI-powered agricultural support platform designed to empower Indian farmers through technology integration. Built for B.Tech CSE final year project at Nagpur Institute of Technology.

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Core Modules](#-core-modules)
- [API Endpoints](#-api-endpoints)
- [Database Schemas](#-database-schemas)
- [AI Integration](#-ai-integration)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Team](#-team)

---

## 🎯 Project Overview

**Farm Connect** addresses critical challenges faced by Indian farmers:

| Problem | Solution |
|---------|----------|
| Information fragmentation across multiple platforms | Unified single-interface platform |
| Delayed disease identification causing crop losses | AI-powered instant crop disease detection |
| Language barriers & low digital literacy | Multilingual voice interface (5 languages) |
| Limited access to government schemes | Searchable schemes portal with filters |
| High cost of agricultural machinery | Peer-to-peer machinery rental marketplace |
| Weather vulnerability & unpredictable farming | Real-time weather dashboard with AI insights |

### Target Users
- Small and marginal farmers in India
- Farmers with limited literacy (voice-enabled interface)
- Agricultural equipment owners (machinery listing)

---

## ✨ Key Features

### 1. 🔬 AI-Powered Disease Detection
- Upload crop images for instant analysis
- Disease identification with severity assessment
- Treatment recommendations & prevention strategies
- Configurable AI: **Groq LLM** (default) or **Google Gemini Vision AI**

### 2. 🌤️ Smart Weather Dashboard
- Real-time weather data via **WeatherAPI.com**
- 7-day forecast with agricultural context
- AI-generated farming alerts & recommendations
- Location-based or city search functionality

### 3. 🚜 Machinery Marketplace
- Browse & search available machinery
- Booking system with date selection
- Owner dashboard for equipment management
- Messaging between farmers and owners
- Review & rating system

### 4. 📋 Government Schemes Portal
- Consolidated agricultural scheme information
- Search & category filtering
- Scheme details with eligibility information
- Scraped from official government sources

### 5. 🎙️ Voice Interface & AI Chatbot
- **Voice Input**: Speech recognition in 5 languages
- **Text Chat**: Type queries directly
- **Languages**: Hindi, Marathi, Malayalam, Punjabi, English
- **Text-to-Speech**: Audio response output
- AI responses via Groq LLM (Gemini also supported)

### 6. 👤 User Profile & Dashboard
- Personal booking history
- Settings management (AI provider selection)
- Authentication with JWT tokens

### 7. 🛒 Kisan Bazaar
- Agricultural products marketplace
- Product listings with pricing

### 8. 📱 PWA Support
- Installable as mobile app
- Offline indicator
- Service worker for caching

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 18.3** | UI framework with hooks |
| **TypeScript 5.8** | Type-safe development |
| **Tailwind CSS 3.4** | Utility-first styling |
| **Shadcn/UI** | Component library (Radix primitives) |
| **React Router DOM 6** | Client-side routing |
| **TanStack React Query** | Server state management |
| **Lucide React** | Icon library |
| **Recharts** | Data visualization |
| **Vite 5** | Build tool & dev server |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime environment |
| **Express.js 4** | REST API framework |
| **MongoDB 6** | Document database |
| **JWT** | Authentication tokens |
| **bcrypt** | Password hashing |

### AI & External Services
| Service | Usage |
|---------|-------|
| **Groq API** (LLaMA 3.3 70B) | Default AI provider for disease detection & chatbot |
| **Google Gemini AI** | Alternative AI provider |
| **WeatherAPI.com** | Real-time weather data |
| **Web Speech API** | Voice recognition & synthesis |

---

## 📁 Project Structure

```
Farm-Connnect/
├── src/
│   ├── App.tsx                    # Main app with routing
│   ├── main.tsx                   # React entry point
│   ├── pages/                     # Page components
│   │   ├── HomePage.tsx           # Landing page
│   │   ├── DiseaseDetection.tsx   # AI crop analysis
│   │   ├── Weather.tsx            # Weather dashboard
│   │   ├── MachineryMarketplace.tsx
│   │   ├── MachineryDetail.tsx
│   │   ├── MachineryForm.tsx
│   │   ├── BookingHistory.tsx
│   │   ├── OwnerDashboard.tsx
│   │   ├── GovernmentSchemes.tsx
│   │   ├── UserProfile.tsx
│   │   └── KisanBazaar.tsx
│   ├── components/
│   │   ├── Layout.tsx             # App shell with navigation
│   │   ├── VoiceInterface.tsx     # Voice chatbot component
│   │   ├── SmartWeatherDashboard.tsx
│   │   ├── IndianFarmerWeatherDashboard.tsx
│   │   ├── LoginModal.tsx         # Auth modal
│   │   ├── MessagingPanel.tsx
│   │   ├── PaymentGateway.tsx
│   │   ├── ReviewForm.tsx
│   │   ├── PWAInstallPrompt.tsx
│   │   ├── OfflineIndicator.tsx
│   │   ├── homepage/              # Homepage sections
│   │   └── ui/                    # Shadcn UI components (49+)
│   ├── lib/
│   │   ├── ai.ts                  # Centralized AI provider logic
│   │   ├── gemini.ts              # Google Gemini integration
│   │   ├── groq.ts                # Groq LLM integration
│   │   ├── weather.ts             # Weather API service
│   │   ├── detections.ts          # Disease detection history
│   │   ├── otp.ts                 # OTP verification
│   │   ├── api/                   # Frontend API services
│   │   │   ├── machineryService.ts
│   │   │   ├── bookingService.ts
│   │   │   └── messageService.ts
│   │   ├── schemas/               # TypeScript interfaces
│   │   │   ├── machinery.schema.ts
│   │   │   ├── booking.schema.ts
│   │   │   ├── message.schema.ts
│   │   │   └── review.schema.ts
│   │   └── payment/               # Payment integration
│   ├── contexts/
│   │   └── AuthContext.tsx        # Auth state management
│   └── hooks/                     # Custom React hooks
├── api/                           # Backend API routes (serverless)
│   ├── users.js                   # User authentication
│   ├── machinery.js               # CRUD for machinery
│   ├── bookings.js                # Booking management
│   ├── messages.js                # Messaging system
│   ├── reviews.js                 # Review system
│   └── weather.js                 # Weather proxy
├── server.js                      # Express server entry
├── database.js                    # MongoDB connection
├── DOCS/
│   └── SYNOPSIS.md                # Detailed project documentation
├── public/                        # Static assets
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── vercel.json                    # Vercel deployment config
├── netlify.toml                   # Netlify config
└── render.yaml                    # Render config
```

---

## 🧩 Core Modules

### Disease Detection Module
**File**: `src/pages/DiseaseDetection.tsx`  
**AI Service**: `src/lib/ai.ts` → `src/lib/groq.ts` / `src/lib/gemini.ts`

```typescript
// Usage flow:
1. User uploads crop image
2. Image converted to base64
3. Sent to AI provider (Groq or Gemini)
4. Returns: disease name, confidence, severity, treatment, prevention
```

### Weather Dashboard Module
**File**: `src/components/SmartWeatherDashboard.tsx`  
**Service**: `src/lib/weather.ts`

```typescript
// Data flow:
1. Get user location (geolocation API) or city search
2. Fetch from /api/weather → WeatherAPI.com
3. Display current + 7-day forecast
4. AI generates agricultural insights
```

### Machinery Marketplace Module
**Files**: `src/pages/MachineryMarketplace.tsx`, `MachineryDetail.tsx`  
**Backend**: `api/machinery.js`, `api/bookings.js`

```typescript
// Features:
- List machinery with search/filter
- View details with availability calendar
- Book equipment with date selection
- Owner dashboard to manage listings
- Messaging between parties
```

### Voice Interface Module
**File**: `src/components/VoiceInterface.tsx`

```typescript
// Capabilities:
- Web Speech API for recognition
- SpeechSynthesis for TTS output
- 5 language support
- Sends queries to AI for responses
```

---

## 🔌 API Endpoints

### Users API (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | User registration |
| POST | `/login` | User authentication |
| GET | `/profile` | Get user profile |
| PUT | `/profile` | Update profile |

### Machinery API (`/api/machinery`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all machinery |
| GET | `/:id` | Get machinery details |
| POST | `/` | Add new machinery |
| PUT | `/:id` | Update machinery |
| DELETE | `/:id` | Delete machinery |

### Bookings API (`/api/bookings`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List user bookings |
| POST | `/` | Create booking |
| PUT | `/:id/status` | Update booking status |
| GET | `/owner` | Owner's bookings |

### Messages API (`/api/messages`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/:bookingId` | Get conversation |
| POST | `/` | Send message |

### Weather API (`/api/weather`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forecast` | Get weather data |

---

## 📊 Database Schemas

### Machinery Schema
```typescript
interface MachinerySchema {
    _id: string;
    name: string;
    type: string;           // "tractor", "harvester", etc.
    description: string;
    pricePerDay: number;
    location: string;
    ownerId: string;
    images: string[];
    availability: boolean;
    specifications: Record<string, string>;
    createdAt: Date;
}
```

### Booking Schema
```typescript
interface BookingSchema {
    _id: string;
    machineryId: string;
    renterId: string;
    ownerId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    status: "pending" | "confirmed" | "completed" | "cancelled";
    paymentStatus: "pending" | "paid" | "refunded";
    createdAt: Date;
}
```

### Message Schema
```typescript
interface MessageSchema {
    _id: string;
    bookingId: string;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: Date;
}
```

### Review Schema
```typescript
interface ReviewSchema {
    _id: string;
    machineryId: string;
    bookingId: string;
    userId: string;
    rating: number;         // 1-5
    comment: string;
    createdAt: Date;
}
```

---

## 🤖 AI Integration

### Provider Configuration
Users can switch AI providers in settings. Configuration stored in `localStorage`.

```typescript
// src/lib/ai.ts
interface ModelConfig {
    diseaseDetection: 'gemini' | 'groq';  // Default: 'groq'
    chatbot: 'gemini' | 'groq';           // Default: 'groq'
}
```

### Groq Integration
**File**: `src/lib/groq.ts`  
**Model**: `llama-3.3-70b-versatile`

```typescript
// Capabilities:
- analyzeCropImage(base64): Disease analysis from image
- getFarmingAdvice(query, language): Multilingual farming advice
- getAIInsights(prompt): Weather-based farming recommendations
```

### Gemini Integration
**File**: `src/lib/gemini.ts`  
**Models**: `gemini-1.5-flash`, `gemini-pro-vision`

```typescript
// Capabilities:
- analyzeCropImage(base64): Vision-based disease detection
- getFarmingAdvice(query, language): Advisory responses
- getAIInsights(prompt): Contextual farming insights
```

---

## 🐳 Docker Support

Run the entire Farm-Connect stack (Frontend, Backend, and MongoDB) with a single command:

```bash
# Start all services
docker compose up --build
```
The app will be accessible at `http://localhost:8080`.

---

## 🚀 Deployment

### 1. Hugging Face Spaces (100% Free)
Detailed guide: [walkthrough.md](./walkthrough.md)

1. Create a **Docker Space** on Hugging Face.
2. Push your repository.
3. Add `MONGODB_URI`, `JWT_SECRET`, and API keys as **Secrets** in Settings.
4. Hugging Face will build and serve your app on port 7860 automatically.

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose (optional, for one-command run)
- MongoDB database (if not using Docker)
- API keys (Groq, Gemini, WeatherAPI)

### Method 1: Docker (Fastest)
```bash
docker compose up --build
```

### Method 2: Manual Installation
```bash
# Clone the repository
git clone <repository-url>
cd Farm-Connnect

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev

# Start backend server (separate terminal)
npm run server
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run server` | Start Express backend |
| `npm run lint` | ESLint check |

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://...

# JWT Secret
JWT_SECRET=your-secret-key

# Weather API
VITE_WEATHER_API_KEY=your-weatherapi-key

# AI Providers (store in browser localStorage for frontend)
# groq_api_key - Groq API key
# gemini_api_key - Google Gemini API key
```

**Note**: AI API keys are stored in `localStorage` on the client side for security isolation.

---

## 👥 Team

**Department of Computer Science & Engineering**  
Nagpur Institute of Technology, Nagpur  
Session: 2025-2026

| Name | Role |
|------|------|
| Marshal Alone | Developer |
| Aditya Kawale | Developer |
| Vaishnavi Getme | Developer |
| Sanskruti Patil | Developer |
| Mrunali Umak | Developer |

**Project Guide**: Prof. Tejas Dhule, Assistant Professor

---

## 📄 Documentation

For detailed project documentation including literature survey, methodology, and architecture diagrams, see:
- [`DOCS/SYNOPSIS.md`](./DOCS/SYNOPSIS.md) - Complete project synopsis

---

## 📜 License

This project is developed as part of B.Tech final year academic project requirements.

---

<div align="center">

**Made with ❤️ for Indian Farmers**

</div>