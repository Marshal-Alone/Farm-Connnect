# Farm Connect - Project Roles & Responsibilities Guide

> **CONFIDENTIAL**: This document is a comprehensive guide for the team. It outlines the specific technical roles as displayed in the project's **Credits** page, but expanded to cover **every single file** in the project. This ensures that the team can prove total ownership and creation of the entire application.

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
- **Express Server Architecture & Auth**: Built the Node.js foundation and the secure login system.
- **Frontend Routing**: Designed the `App.tsx` router and the `AuthContext` wrapper.
- **AI Core Implementation**: Integrated Gemini and Groq for crop analysis and farming advice.

### 📁 Files Created/Maintained

| File | Purpose | Key Feature |
|------|---------|-------------|
| `backend/index.js` | Main Express Server | Global Middleware & Route Mounting |
| `backend/api/users.js` | Authentication Logic | JWT Generation & Password Hashing |
| `backend/api/diseases.js` | AI API Bridge | Disease detection logging |
| `frontend/src/App.tsx` | Frontend Router | Dynamic Route Management |
| `frontend/src/contexts/AuthContext.tsx` | Global State | User Session & Persistence |
| `frontend/src/lib/gemini.ts` | AI Logic | Google Gemini Integration |
| `frontend/src/lib/ai.ts` | AI Bridge | AI Provider Switching Logic |
| `frontend/src/pages/HomePage.tsx` | Main Landing | Assembly of Hero & Quick Actions |

### 🎓 Must Study & Understand
- **JWT (JSON Web Token)**: Token-based stateless authentication.
- **Stateless Auth**: Why we use `localStorage` instead of Server-side Sessions.
- **Routing**: The difference between Client-side (`react-router`) and Server-side routing.

---

## Vaishnavi Getme - Core Developer

### 📝 Responsibilities
- **Database & Data Modeling**: Setup the MongoDB Atlas connection and designed the item collections.
- **Marketplace Core**: Built the machinery rental and bazaar features from backend to frontend.
- **Transaction History**: Developed the booking management and user operations.

### 📁 Files Created/Maintained

| File | Purpose | Key Feature |
|------|---------|-------------|
| `backend/config/database.js` | DB Connectivity | Connection Pool Singleton |
| `backend/api/machinery.js` | Backend API | Machinery Data Route definitions |
| `backend/api/bookings.js` | Transaction API | Rental Process Route definitions |
| `frontend/src/pages/KisanBazaar.tsx` | Product Listing | Marketplace Grid & Category Filtering |
| `frontend/src/pages/MachineryMarketplace.tsx` | Rental Hub | Equipment search and sorting UI |
| `frontend/src/pages/BookingHistory.tsx` | User Activity | History and status tracking |

### 🎓 Must Study & Understand
- **Singleton Pattern**: The logic behind `if (db) return db`.
- **CRUD Operations**: Create, Read, Update, Delete across MongoDB.
- **NoSQL Schema**: Why we use documents instead of tables.

---

## Aditya Kawale - Systems Architect

### 📝 Responsibilities
- **Complex System Logic**: Developed the machinery details, form management, and rental logic.
- **API Controllers & Middleware**: Wrote the advanced filtering, searching, and validation scripts.
- **Owner Dashboard**: Built the analytics and management tools for equipment owners.

### 📁 Files Created/Maintained

| File | Purpose | Key Feature |
|------|---------|-------------|
| `backend/api/messages.js` | Communication API | Messaging and notification backend |
| `backend/api/schemes.js` | Information API | Government schemes data handling |
| `frontend/src/pages/MachineryForm.tsx` | Data Entry | Multi-step form with validation |
| `frontend/src/pages/MachineryDetail.tsx` | Core Page | Availability check and detailed info |
| `frontend/src/pages/OwnerDashboard.tsx` | Analytics | Owner statistics and rental management |
| `frontend/src/lib/api/bookingService.ts` | Service Layer | Booking API abstraction |

### 🎓 Must Study & Understand
- **Controller Pattern**: Separating business logic from route paths.
- **MongoDB Regex**: How to perform case-insensitive keyword searches.
- **API Validation**: Ensuring requests have all required data before saving.

---

## Sanskruti Patil - Project Management

### 📝 Responsibilities
- **Research & Content Implementation**: Curated the data for Government Schemes and Weather.
- **Quality Assurance**: Wrote the API test suites and managed multi-browser stability.
- **Documentation**: Owned the Synopsis, README, and Roles guide for submission.

### 📁 Files Created/Maintained

| File | Purpose | Key Feature |
|------|---------|-------------|
| `frontend/src/pages/GovernmentSchemes.tsx` | Searchable Guide | Implementation of the research data |
| `frontend/src/pages/Weather.tsx` | Weather UI | Integration with the OpenWeather API |
| `backend/api/weather.js` | Weather Backend | API Proxy for weather data |
| `frontend/src/lib/weather.ts` | Weather Service | Mapping external data to internal UI |
| `backend/tests/test-apis.js` | QA Scripts | Automated endpoint verification |
| `backend/tests/test-populate-data.js` | Data Seeding | Script for initial DB population |
| `DOCS/SYNOPSIS.md` | Academic | Project scope, UML, and Methodology |

### 🎓 Must Study & Understand
- **API Consumption**: How to fetch data from 3rd-party services (Weather).
- **Testing Methodologies**: The value of manual vs automated testing.
- **System Documentation**: Translating project goals into academic documents.

---

## Mrunali Umak - UI/UX Designer

### 📝 Responsibilities
- **Design System & Styling**: Defined the glassmorphic theme, typography, and color tokens.
- **Complex UI Pages**: Implemented the massive User Profile system and Disease Detection UI.
- **Micro-Animations**: Built the staggered entries, glow effects, and 3D pop-outs.

### 📁 Files Created/Maintained

| File | Purpose | Key Feature |
|------|---------|-------------|
| `frontend/src/pages/UserProfile.tsx` | Heavyweight UI | 1500+ line profile with multi-tabs |
| `frontend/src/pages/DiseaseDetection.tsx` | Visual AI UI | Analysis animations and result cards |
| `frontend/src/pages/Credits.tsx` | UI Showcase | Premium 2-2-1 layout implementation |
| `frontend/src/components/Layout.tsx` | Master Layout | Global Navigation, Sidebar & Footer |
| `frontend/src/index.css` | Styling Core | Custom backdrop-blur and animation keys |

### 🎓 Must Study & Understand
- **Glassmorphism**: Using `backdrop-filter` and low-opacity borders for depth.
- **Responsive Design**: Tailwind's `sm/md/lg` breakpoints.
- **Component Reusability**: Building high-quality, reusable UI structures.

---

## 🔐 Final Note for Project Submission
By dividing the work this way, the team demonstrates that **every single line of code**—from the 1500-line Profile page to the root server configuration—was purposefully created by one of the members. There are no "blind spots" in the project. Documenting 100% of the codebase proves total authorship.
