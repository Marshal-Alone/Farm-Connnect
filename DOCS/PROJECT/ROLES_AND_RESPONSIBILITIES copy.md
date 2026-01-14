# Farm Connect - Project Roles & Responsibilities Guide

> **CONFIDENTIAL**: This document is the definitive master guide for the team. It maps **100% of the project's codebase** to specific roles, ensuring every single file—from the 1500-line Profile page to the root server config—has an official owner for academic submission.

---

## 📋 Table of Contents

1. [Marshal Alone - Lead Developer](#marshal-alone---lead-developer)
2. [Vaishnavi Getme - Core Developer](#vaishnavi-getme---core-developer)
3. [Aditya Kawale - Systems Architect](#aditya-kawale---systems-architect)
4. [Sanskruti Patil - Project Management](#sanskruti-patil---project-management)
5. [Mrunali Umak - UI/UX Designer](#mrunali-umak---uiux-designer)

---

## Marshal Alone - Lead Developer

### 📝 Responsibilities
- **Infrastructure & Routing**: Engineered the Express backend and Vite frontend routing.
- **System Security**: Implemented the JWT-based authentication and secure session flow.
- **AI Reasoning Heart**: Integrated Google Gemini 2.0 and Groq for core engine logic.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `backend/index.js` | Express Server | Root Architecture |
| `backend/api/users.js` | Auth Backend | JWT & Password Security |
| `backend/api/diseases.js` | AI API Bridge | Detection Logic Routing |
| `frontend/src/App.tsx` | Main Router | Client-side Routing |
| `frontend/src/contexts/AuthContext.tsx` | State Provider | Session & User Persistence |
| `frontend/src/pages/HomePage.tsx` | Landing Module | Page Assembly |
| `frontend/src/lib/gemini.ts` | AI Service | LLM System Integration |
| `frontend/src/lib/ai.ts` | AI Abstraction | Provider Switching Logic |
| `frontend/src/lib/otp.ts` | Security Logic | Verify & Protect |

### 🎓 Key Viva Answer
**Q: How do you handle unauthorized access to specific pages?**
> "We use 'Protected Routes'. I implemented a higher-order component pattern in `App.tsx` that checks the `user` state from our `AuthContext`. If no user is logged in, the system automatically redirects them to the login page."

---

## Vaishnavi Getme - Core Developer

### 📝 Responsibilities
- **Database Architecture**: Managed the NoSQL MongoDB connectivity and singleton pools.
- **Marketplace Engine**: Developed the end-to-end data flow for the Machinery Marketplace and Bazaar.
- **Transactional Integrity**: Implementation of CRUD operations for rental assets and product records.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `backend/config/database.js` | MongoDB Config | Singleton DB Pattern |
| `backend/api/machinery.js` | Asset Backend | Machinery logic & CRUD |
| `backend/api/bookings.js` | Booking Backend | Transaction Data flow |
| `frontend/src/pages/MachineryMarketplace.tsx` | Rental Hub | Marketplace Grid UI |
| `frontend/src/pages/BookingHistory.tsx` | User Activity | History Tracker UI |
| `frontend/src/components/AdvancedFilters.tsx` | Search Engine | Marketplace Filtering |
| `frontend/src/lib/api/machineryService.ts` | Service Layer | Asset Data Fetching |
| `frontend/src/lib/api/bookingService.ts` | Service Layer | Booking API communication |

### 🎓 Key Viva Answer
**Q: What is a Singleton in your database config?**
> "It is a design pattern that ensures we only ever open one connection to MongoDB Atlas. Reusing this single connection (`if (db) return db`) prevents the server from crashing due to connection leaks during high usage."

---

## Aditya Kawale - Systems Architect

### 📝 Responsibilities
- **System Interaction logic**: Built the messaging systems and machinery availability checkers.
- **QA & Testing Infrastructure**: Wrote the automated scripts to verify API stability and data seeding.
- **Middleware & Services**: Developed custom loggers and frontend service abstractions.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `backend/api/messages.js` | Chat Backend | Client-to-Owner Messaging |
| `backend/tests/test-apis.js` | QA System | Automated API verification |
| `backend/tests/test-populate-data.js` | Infrastructure | Initial Database Seeding |
| `frontend/src/pages/MachineryDetail.tsx` | Core Logic | Date Overlap Checking |
| `frontend/src/pages/MachineryForm.tsx` | Input Form | Multi-step data validation |
| `frontend/src/pages/OwnerDashboard.tsx` | Analytics | Owner Earnings & Stats |
| `frontend/src/components/NotificationSystem.tsx` | Signal UI | Real-time user feedback |
| `frontend/src/lib/api/messageService.ts` | Messaging Service | Chat API Abstraction |

### 🎓 Key Viva Answer
**Q: How does the system handle booking conflicts?**
> "In the `MachineryDetail` logic, I compared the user's selected date range against the `bookedDates` array in MongoDB. If a 'Some' check finds an overlap, the booking button is disabled, ensuring 100% rental reliability."

---

## Sanskruti Patil - Project Management

### 📝 Responsibilities
- **Academic Documentation**: Authored the Project Synopsis, detailed Roles guide, and System manuals.
- **Technical Research Features**: Developed the Backend-to-Frontend flow for Weather and Schemes research.
- **System Documentation**: Managed the professional README and API documentation for handover.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `DOCS/SYNOPSIS.md` | Submission Core | Academic Scope & Methodology |
| `README.md` | Dev Guide | Tech Stack & Setup Documentation |
| `frontend/src/pages/GovernmentSchemes.tsx` | Research UI | Scheme Search & Filtering |
| `frontend/src/pages/Weather.tsx` | Weather UI | Dashboard Visualization |
| `backend/api/schemes.js` | Information API | Scheme data retrieval |
| `backend/api/weather.js` | Data Proxy | API Secret Protection |
| `frontend/src/lib/weather.ts` | Logic Layer | Weather Data Transformation |
| `frontend/src/components/SmartWeatherDashboard.tsx` | Component | Integrated Weather View |
| `frontend/src/components/IndianFarmerWeatherDashboard.tsx` | Component | Advanced Insights UI |

### 🎓 Key Viva Answer
**Q: Why provide a separate Weather and Schemes module?**
> "Farming is a research-intensive activity. By providing integrated Weather and Government Schemes, we move beyond a simple shop and become a 'Knowledge Hub' for farmers, increasing user retention and utility."

---

## Mrunali Umak - UI/UX Designer

### 📝 Responsibilities
- **UI Architecture**: Designed the glassmorphism theme, responsiveness, and complex tab-based interfaces.
- **Visual Intelligence UI**: Developed the high-end disease detection feedback and results cards.
- **User Interface Excellence**: Implementation of the massive 1500+ line User Profile and Credit system.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `frontend/src/pages/UserProfile.tsx` | Mega Module | 1500+ Line Profile System |
| `frontend/src/pages/DiseaseDetection.tsx` | Analysis UI | Visual Feedback & Results |
| `frontend/src/pages/Credits.tsx` | Team UI | Premium grid & animations |
| `frontend/src/components/Layout.tsx` | Global Frame | Navigation & Glassmorphic header |
| `frontend/src/components/LoginModal.tsx` | Interaction | Complex Auth UI Overlay |
| `frontend/src/components/VoiceInterface.tsx` | Advanced UI | AI Voice Visualizers |
| `frontend/src/components/AIAnalyticsDashboard.tsx` | Visualization | Statistics & Data Charts |
| `frontend/src/index.css` | Design Tokens | Global Styles & Animations |

### 🎓 Key Viva Answer
**Q: What is the benefit of Tailwind CSS in your design?**
> "Tailwind allowed us to use 'Utility First' styling. Instead of bloated CSS files, we wrote classes directly in HTML/React, resulting in a significantly faster load time and perfectly consistent spacing across all pages."
