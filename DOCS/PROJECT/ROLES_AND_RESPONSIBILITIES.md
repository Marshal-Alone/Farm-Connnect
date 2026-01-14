# Farm Connect - Project Roles & Responsibilities Guide

> **CONFIDENTIAL**: This document is the definitive master guide for the team. It maps **100% of the project's codebase** to specific roles accurately defined in the **Credits** page. This ensures total project ownership for academic submission.

---

## 📋 Table of Contents

1. [Marshal Alone - Lead Developer](#marshal-alone---lead-developer)
2. [Vaishnavi Getme - Core Developer](#vaishnavi-getme---core-developer)
3. [Aditya Kawale - Systems Architect](#aditya-kawale---systems-architect)
4. [Sanskruti Patil - Project Management](#sanskruti-patil---project-management)
5. [Mrunali Umak - UI/UX Designer](#mrunali-umak---uiux-designer)

---

## 📊 Project Contribution Scorecard

| Name | Role | Importance | Rationale |
| :--- | :--- | :---: | :--- |
| **Marshal Alone** | Lead Developer | **100 / 100** | **The Visionary**: Engineered the core infrastructure, JWT/OTP security, and AI Vision Engine. |
| **Vaishnavi Getme** | Systems Architect | **98 / 100** | **The Backend Lead**: Owns the MongoDB architecture, Chat systems, and Disease Detection system. |
| **Aditya Kawale** | Core Developer | **88 / 100** | **The Feature King**: Developed the entire Machinery/Booking transactional ecosystem. |
| **Sanskruti Patil** | Project Management | **78 / 100** | **The Research Lead**: Spearheaded technical research and academic documentation. |
| **Mrunali Umak** | UI/UX Designer | **75 / 100** | **The Aesthetic Lead**: Designed the premium glassmorphic UI and interactive components. |

---

## Marshal Alone - Lead Developer

### 📝 Responsibilities
- **Infrastructure & Routing**: Engineered the Express backend and Vite frontend routing.
- **System Security**: Implemented the JWT-based authentication and secure session flow.
- **AI Core & Vision Engine**: Integrated Google Gemini 2.0 and Groq multimodal vision for system reasoning.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `backend/index.js` | Express Server | Root Architecture |
| `backend/api/users.js` | Auth Backend | JWT & Security Logic |
| `frontend/src/App.tsx` | Main Router | Client-side Routing |
| `frontend/src/contexts/AuthContext.tsx` | State Provider | Session Persistence |
| `frontend/src/pages/HomePage.tsx` | Entry Page | Main Dashboard UI |
| `frontend/src/lib/gemini.ts` | AI Service | LLM System Integration |
| `frontend/src/lib/ai.ts` | AI Abstraction | Provider Switching Logic |
| `frontend/src/lib/otp.ts` | Identity Logic | Verification Simulation |

### 🎓 Key Viva Answer
**Q: Why did you use Docker for this project?**
> "We used Docker to ensure 'Environment Consistency'. By creating a Dockerfile, we package the app with its specific Node.js version and dependencies. This means the app will run exactly the same way on any machine, eliminating environment-related bugs."

---

## Vaishnavi Getme - Systems Architect & Co-Lead

### 📝 Responsibilities
- **Data & Storage Architecture**: Mastered the NoSQL MongoDB connectivity and singleton pools.
- **Messaging ecosystem**: Developed the full chat interface and server-side REST API logic.
- **Detection System Implementation**: Engineered the visual analysis UI and server-side detection persistence.
- **PWA Excellence**: Implemented offline support and installation prompts for mobile farmers.
- **Docker & DevOps**: Engineered the containerization strategy and deployment orchestration.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `Dockerfile` | Containerization | Deployment Architecture |
| `docker-compose.yml` | Orchestration | Multi-container setup |
| `backend/config/database.js` | MongoDB Config | Connection Pool Singleton |
| `backend/api/messages.js` | Chat Backend | Client-to-Owner Messaging |
| `backend/api/diseases.js` | Detection API | AI detection result logic |
| `frontend/src/pages/DiseaseDetection.tsx` | Visual AI | LLM-Driven Analysis UI |
| `frontend/src/components/PWAInstallPrompt.tsx` | PWA | App Install Logic |
| `frontend/src/components/OfflineIndicator.tsx`| PWA | Connection state UI |
| `frontend/src/lib/api/messageService.ts` | Service | Messaging API logic |

### 🎓 Key Viva Answer
**Q: What is a Singleton in your database config?**
> "It is a pattern that ensures we only ever open one connection to MongoDB. Reusing this single connection prevents the server from overloading during high traffic."

---

## Aditya Kawale - Core Developer

### 📝 Responsibilities
- **Machinery Ecosystem**: Built the machinery catalog, asset CRUD, and search engine.
- **Booking State Machine**: Engineered the transactional flow for rentals and conflicts.
- **Marketplace UI Engine**: Designed the rental hub, machinery display, and search filters.
- **QA & Verification**: Authored the testing suite and automated data seeding scripts.
- **System Feedback**: Implemented the visual notification tray and polling logic.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `backend/api/machinery.js` | Asset Backend | Machinery logic & CRUD |
| `backend/api/bookings.js` | Booking Backend | Transaction Data flow |
| `backend/tests/test-apis.js` | QA System | Automated API Testing |
| `backend/tests/test-populate-data.js` | Data Seeding | Initial Database population |
| `frontend/src/pages/MachineryMarketplace.tsx` | Rental Hub | Marketplace Grid UI |
| `frontend/src/pages/MachineryDetail.tsx` | Logic UI | Booking Overlap Verification |
| `frontend/src/pages/MachineryForm.tsx` | Input UI | Rental listing management |
| `frontend/src/pages/BookingHistory.tsx` | History | Transaction Tracker UI |
| `frontend/src/pages/OwnerDashboard.tsx` | Analytics | Business Stats Engine |
| `frontend/src/components/AdvancedFilters.tsx` | Search | Multi-category filtering |
| `frontend/src/components/NotificationSystem.tsx` | Feedback | Signal & Alert Logic |
| `frontend/src/components/PaymentGateway.tsx` | Checkout | Visual Payment Logic |
| `frontend/src/lib/api/machineryService.ts` | Data Layer | Asset API Communication |
| `frontend/src/lib/api/bookingService.ts` | Data Layer | Booking API Communication |

### 🎓 Key Viva Answer
**Q: Why use 'Polling' instead of WebSockets for your notifications?**
> "For this version, we implemented 'Short Polling' in `NotificationSystem.tsx` (refreshing every 30 seconds). While WebSockets provide true real-time updates, Polling is more reliable for a demo environment and doesn't require a persistent open connection, making it more battery-efficient for a mobile farmer's device."

---

## Sanskruti Patil - Project Management

### 📝 Responsibilities
- **Technical Feature Research**: Managed the research datasets for Weather and Government Schemes.
- **Documentation Lead**: Authored the primary system README and comprehensive technical reports.
- **Information Architecture**: Developed the Backend-to-Frontend flow for research modules.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `README.md` | Dev Guide | Technical Architecture |
| `frontend/src/pages/GovernmentSchemes.tsx` | Research UI | Scheme Search UI |
| `frontend/src/pages/Weather.tsx` | Weather UI | Dashboard Visualization |
| `frontend/src/lib/weather.ts` | Service | Data Transformation Logic |
| `frontend/src/components/SmartWeatherDashboard.tsx` | Component | Integrated Weather View |
| `frontend/src/components/IndianFarmerWeatherDashboard.tsx` | Component | Local Forecast UI |

### 🎓 Key Viva Answer
**Q: Why use a proxy for the Weather API?**
> "Security. By calling the Weather API through our backend (`weather.js`), we keep our private API keys hidden from the browser's Network tab."

---

## Mrunali Umak - UI/UX Designer

### 📝 Responsibilities
- **UI Architecture**: Designed the glassmorphism theme and complex tab-based interfaces.
- **Visual Feedback Design**: Developed the high-end detection interfaces and voice visualizers.
- **Responsive Excellence**: Engineered the mobile-first layouts for the heavyweight Profile and Detection systems.

### 📁 100% File Ownership

| File | Purpose | Feature |
|------|---------|---------|
| `frontend/src/pages/UserProfile.tsx` | Mega Module | 1500+ Line Profile System |
| `frontend/src/pages/Credits.tsx` | Showcase | Team Grid & Styles |
| `frontend/src/components/Layout.tsx` | App Shell | Glassmorphic Navigation |
| `frontend/src/components/LoginModal.tsx` | Interaction | Auth Overlay UI |
| `frontend/src/components/VoiceInterface.tsx` | Advanced UI | AI Voice Visualizers |
| `frontend/src/components/AIAnalyticsDashboard.tsx` | Viz | Data Charts & Visuals |
| `frontend/src/index.css` | Styling | Design Tokens & Global CSS |

### 🎓 Key Viva Answer
**Q: What is the benefit of Glassmorphism in your design?**
> "It adds depth and a premium 'high-tech' feel without cluttering the UI. By using background blurs and subtle borders, we create a clear hierarchy that feels alive and responsive."
