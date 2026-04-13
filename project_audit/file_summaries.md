# File Summaries (Auto-generated)

Total readable files processed: 198

## .env.example
- lines: 8
- non_empty_lines: 6

## .github/copilot-instructions.md
- lines: 133
- non_empty_lines: 109
- headings_or_keys: # Farm Connect - AI Coding Agent Instructions, ## Architecture Overview, ### Tech Stack, ### Project Structure, ## Critical Data Flows, ### 1. Machinery Marketplace & Booking, ### 2. Disease Detection Pipeline, ### 3. AI Provider Switching

## .gitignore
- lines: 28
- non_empty_lines: 25

## DOCS/AI_CHAT/2026-01-14_ML_Model_Integration.md
- lines: 199
- non_empty_lines: 140
- headings_or_keys: # AI Chat History: Custom ML Model Integration, ## Chat 1: Initial ML Model Request, ### User:, ### AI Response:, ### User:, ### AI Response:, ## Chat 2: Model Loading Error, ### User:

## DOCS/AI_CHAT/2026-01-XX_API_Key_Security.md
- lines: 69
- non_empty_lines: 48
- headings_or_keys: # AI Chat History: Securing and Managing AI API Keys, ## Chat 1: Debugging Backend Logs, ### User:, ### AI Response:, ## Chat 2: Browser Console Visibility, ### User:, ### AI Response:, ## Key Technical Changes

## DOCS/AI_CHAT/2026-01-XX_Credits_Roles_Audit.md
- lines: 135
- non_empty_lines: 95
- headings_or_keys: # AI Chat History: Credits Page & Roles Documentation Audit, ## Chat 1: Refining AI Feature Credits, ### User:, ### AI Response:, ## Chat 2: Full Technical Audit Request, ### User:, ### AI Response:, ## Chat 3: WebSocket Question

## DOCS/AI_CHAT/2026-01-XX_Registration_Error_Fix.md
- lines: 44
- non_empty_lines: 29
- headings_or_keys: # AI Chat History: Fixing User Registration Error, ## Chat Log, ### User:, ### AI Response:, ## Key Technical Fixes, ### 1. Token Serialization (`backend/api/users.js`), ### 2. Robust Catch Block (`backend/api/users.js`)

## DOCS/API/API_INDEX.md
- lines: 283
- non_empty_lines: 224
- headings_or_keys: # API Documentation Index, ## 📚 Documentation Files, ### Main Documentation, ### API-Specific Guides, #### 1. [API_VERIFICATION_COMPLETE.md](./API/API_VERIFICATION_COMPLETE.md), #### 2. [API_VERIFICATION_GUIDE.md](./API/API_VERIFICATION_GUIDE.md), #### 3. [API_STATUS_SUMMARY.md](./API/API_STATUS_SUMMARY.md), ### Quick Reference

## DOCS/API/API_STATUS_SUMMARY.md
- lines: 109
- non_empty_lines: 84
- headings_or_keys: # API Route Status Summary, ## Routes by Status, ### ✅ FULLY WORKING (11 routes), ### ⚠️ PARTIALLY WORKING (5 routes), ### ❌ NOT VERIFIED / NOT IMPLEMENTED, ## Quick Verification Steps, ### Test Login (POST /api/auth/login), ### Test Machinery Listing (GET /api/machinery)

## DOCS/API/API_TESTING_CHECKLIST.md
- lines: 289
- non_empty_lines: 225
- headings_or_keys: # Farm Connect - API Testing Checklist, ## ✅ Frontend Testing Checklist (No Terminal Needed), ### 1. Authentication Tests, ### 2. Machinery Listing Tests, ### 3. Machinery Management Tests (Owner Only), ### 4. Booking Tests (Farmer/Renter), ### 5. Booking Management Tests (Owner Only), ### 6. Review Tests ⚠️ LIMITED DATA

## DOCS/API/API_TESTING_GUIDE.md
- lines: 1009
- non_empty_lines: 827
- headings_or_keys: # Farm Connect API Testing Guide, ## Prerequisites, # Terminal 1: Start Backend (port 4174), # Terminal 2: Start Frontend (port 8080), ## Authentication Endpoints, ### 1. POST /api/auth/register - Register New User, ### 2. POST /api/auth/login - User Authentication, ### 3. GET /api/auth/me - Get Current Logged-in User

## DOCS/API/API_VERIFICATION_COMPLETE.md
- lines: 357
- non_empty_lines: 287
- headings_or_keys: # Farm Connect - Verified API Routes Summary, ## Executive Summary, ## ✅ Fully Verified Routes (11), ### Authentication Routes, ### Machinery Routes, ### Booking Routes, ### Health Routes, ## ⚠️ Partially Working Routes (5)

## DOCS/API/API_VERIFICATION_GUIDE.md
- lines: 254
- non_empty_lines: 206
- headings_or_keys: # Farm Connect - API Verification Guide, ## Quick Reference: Verified API Routes, ### ✅ Fully Working Routes (11 verified), #### 1. **POST /api/auth/login** - User Authentication, #### 2. **GET /api/auth/me** - Get Current User, #### 3. **GET /api/machinery** - List All Machinery, #### 4. **GET /api/machinery/:id** - Get Machinery Details, #### 5. **POST /api/machinery** - Create New Machinery

## DOCS/FIXES/CROP_DISEASE_FIX.md
- lines: 121
- non_empty_lines: 97
- headings_or_keys: # Crop Disease Detection - Fixed! ✅, ## Problem, ## Solution Applied, ### 1. **Installed Correct Package**, ### 2. **Updated `src/lib/gemini.ts`**, #### Key Changes:, #### Updated Methods:, ### 3. **Enhanced Disease Detection**

## DOCS/FIXES/DASHBOARD_FIXES.md
- lines: 110
- non_empty_lines: 87
- headings_or_keys: # Dashboard Fixes - Manual Instructions, ## Issue 1: Delete Button Not Working (No Confirmation Dialog), ### Step 1: Add Delete Confirmation State, ### Step 2: Update Delete Handler, ### Step 3: Add Confirm Delete Function, ### Step 4: Add Delete Confirmation Dialog UI, ## Issue 2: Edit Button - Add Edit Mode to Detail Page, ## Testing

## DOCS/FIXES/REGISTRATION_FIX.md
- lines: 45
- non_empty_lines: 36
- headings_or_keys: # Fix: User Registration 500 Error, ## ⚠️ Problem Description, ## 🛠️ Root Cause, ## ✅ Solution Implemented, ### 1. Backend: Secure Token Generation, ### 2. Backend: Robust Error Logging, ### 3. Frontend: Resilient Fetch Logic, ## 📊 Verification Result

## DOCS/FIXES/SERVICE_WORKER_FIX.md
- lines: 139
- non_empty_lines: 109
- headings_or_keys: # Service Worker Cache Issue - FIXED! ✅, ## Problem, ## Solution Applied, ### 1. **Updated Service Worker Strategy** (`public/sw.js`), ### 2. **Created Smart Service Worker Registration** (`src/registerSW.ts`), ### 3. **Registered SW in Main Entry** (`src/main.tsx`), ## 🔧 IMPORTANT: Clear Your Browser Cache Now, ### Method 1: Manual Browser Cleanup (Recommended)

## DOCS/GUIDES/API_KEY_SECURITY.md
- lines: 149
- non_empty_lines: 109
- headings_or_keys: # API Key Security Implementation, ## Overview, ## Problem, ## Solution: Backend Proxy with User Key Support, ## API Key Priority Order, ## Backend Endpoints, ## Files Modified, ### Backend

## DOCS/GUIDES/DEPLOYMENT.md
- lines: 216
- non_empty_lines: 159
- headings_or_keys: # 🚀 Deployment Guide: Vercel (Frontend) + Render (Backend), ## 📋 Current Setup, ## ✅ Step 1: Deploy Backend to Render (Already Done), ## 🎯 Step 2: Deploy Frontend to Vercel, ### Method 1: Using Vercel CLI (Recommended), # Install Vercel CLI globally, # Login to Vercel, # Deploy to production

## DOCS/GUIDES/GROQ_VISION_IMPLEMENTATION.md
- lines: 550
- non_empty_lines: 431
- headings_or_keys: # Groq Vision Model Implementation, ## 📋 Overview, ## 🏗️ Architecture, ## 📁 File Structure, ## 🔧 Core Implementation, ### 1. Groq Client Setup (`groq.ts`), ### 2. Vision Analysis Method, ### 3. AI Router (`ai.ts`)

## DOCS/GUIDES/LOGGING_SUMMARY.md
- lines: 242
- non_empty_lines: 193
- headings_or_keys: # API Logging & Testing Summary, ## ✅ What's Been Done, ### 1. **Comprehensive Logging Added**, ### 2. **Complete Testing Guide Created**, ## 📝 Logging Format, ### Log Levels & Emojis, ### Example Log Output, ### Log Information Captured

## DOCS/GUIDES/MESSAGE REBUILD GUIDE.md
- lines: 237
- non_empty_lines: 195
- headings_or_keys: # The Definitive Messaging Rebuild Guide, ## 1. Architectural Strategy, ## 2. Step-by-Step Implementation, ### Step 1: Database Schema & Setup, #### Schema Documentation (`src/lib/schemas/message.schema.ts`), ### Step 2: Backend API Layer (`api/messages.js`), ### Step 3: Frontend Service Layer (`src/lib/api/messageService.ts`), ### Step 4: The Messaging Hub Logic (`UserProfile.tsx`)

## DOCS/GUIDES/MESSAGING_REBUILD_GUIDE.md
- lines: 237
- non_empty_lines: 195
- headings_or_keys: # The Definitive Messaging Rebuild Guide, ## 1. Architectural Strategy, ## 2. Step-by-Step Implementation, ### Step 1: Database Schema & Setup, #### Schema Documentation (`src/lib/schemas/message.schema.ts`), ### Step 2: Backend API Layer (`api/messages.js`), ### Step 3: Frontend Service Layer (`src/lib/api/messageService.ts`), ### Step 4: The Messaging Hub Logic (`UserProfile.tsx`)

## DOCS/GUIDES/VERIFICATION.md
- lines: 346
- non_empty_lines: 269
- headings_or_keys: # ✅ API Logging Implementation - Complete, ## 📝 What Was Done, ## 📂 Files Modified, ### 1. `/api/users.js` - Authentication & User Management, ### 2. `/api/machinery.js` - Machinery Management, ### 3. `/api/bookings.js` - Booking Management, ### 4. `/api/reviews.js` - Review System, ### 5. `/api/messages.js` - Messaging System

## DOCS/GUIDES/VERIFIED_ROUTES_QUICK_REF.txt
- lines: 170
- non_empty_lines: 134

## DOCS/ML/CODE_EXPLANATION.md
- lines: 272
- non_empty_lines: 212
- headings_or_keys: # Code Explanation for Teacher, ## 1. Dataset Loading (`dataset.py`), ### Class Labels (38 disease classes), # ... 34 more classes, ### Data Augmentation, ### Image Preprocessing, # Resize to 224x224 (MobileNetV2 input size), # Normalize to [0, 1] range

## DOCS/ML/README.md
- lines: 322
- non_empty_lines: 258
- headings_or_keys: # Custom Plant Disease Detection ML System, ## Table of Contents, ## Overview, ## Why Custom ML Model?, ## Technology Stack, ### Training Phase (Python), ### Deployment Phase (Browser), ## Model Architecture

## DOCS/ML/TECHNICAL_DOCUMENTATION.md
- lines: 1107
- non_empty_lines: 866
- headings_or_keys: # Plant Disease Detection - Complete ML Technical Documentation, ## Table of Contents, ## 1. Overview & All 38 Diseases, ### 1.1 The 14 Crop Types, ### 1.2 All 38 Disease Classes (Complete List), ## 2. AI vs ML vs Deep Learning, ### 2.1 What is Artificial Intelligence (AI)?, ### 2.2 What is Machine Learning (ML)?

## DOCS/ML/TRAINING_GUIDE.md
- lines: 253
- non_empty_lines: 187
- headings_or_keys: # How to Train the Disease Detection Model, ## Step-by-Step Guide for Training Custom CNN Model, ## Prerequisites, ## Step 1: Set Up Python Environment, # Navigate to the ML directory, # Create a virtual environment, # Activate it (Windows), # Activate it (Mac/Linux)

## DOCS/PPT/ppt_content.txt
- lines: 312
- non_empty_lines: 255

## DOCS/PRESENTATION/presentation.html
- lines: 1283
- non_empty_lines: 1167

## DOCS/PROJECT/DOCUMENTATION.md
- lines: 108
- non_empty_lines: 89
- headings_or_keys: # FarmConnect - Technical Documentation, ## Project Overview, ## Technology Stack, ### Charts — Developer note 🔧, ## Current Features, ### ✅ Core Infrastructure, ### ✅ AI-Powered Features, ### ✅ Core Pages

## DOCS/PROJECT/ROLES_AND_RESPONSIBILITIES copy.md
- lines: 145
- non_empty_lines: 111
- headings_or_keys: # Farm Connect - Project Roles & Responsibilities Guide, ## 📋 Table of Contents, ## Marshal Alone - Lead Developer, ### 📝 Responsibilities, ### 📁 100% File Ownership, ### 🎓 Key Viva Answer, ## Vaishnavi Getme - Core Developer, ### 📝 Responsibilities

## DOCS/PROJECT/ROLES_AND_RESPONSIBILITIES.md
- lines: 171
- non_empty_lines: 132
- headings_or_keys: # Farm Connect - Project Roles & Responsibilities Guide, ## 📋 Table of Contents, ## 📊 Project Contribution Scorecard, ## Marshal Alone - Lead Developer, ### 📝 Responsibilities, ### 📁 100% File Ownership, ### 🎓 Key Viva Answer, ## Vaishnavi Getme - Systems Architect & Co-Lead

## DOCS/PROJECT/SYNOPSIS.md
- lines: 1154
- non_empty_lines: 638

## DOCS/PROJECT/TODO.md
- lines: 188
- non_empty_lines: 155
- headings_or_keys: # FarmConnect - Development TODO, ## 🎯 Current Sprint: Advanced AI Integration & Real-World Connectivity, ### 🚀 Phase 4 Implementation Plan, #### 1. AI Enhancement & API Integration, #### 2. Voice & Multilingual Features, #### 3. Advanced Analytics & Insights, #### 4. Community & Marketplace Enhancements, #### 5. Financial Integration

## DOCS/README.md
- lines: 127
- non_empty_lines: 96
- headings_or_keys: # 📚 Farm-Connect Documentation, ## 📁 Folder Structure, ## 🤖 AI Chat Logs, ## 📂 API Documentation, ## 🔧 Fixes Documentation, ## 📖 Guides, ## 🤖 Machine Learning Documentation, ## 📋 Project Documentation

## DOCS/SEO/SEO-ANALYSIS-DOCUMENT.md
- lines: 360
- non_empty_lines: 304
- headings_or_keys: # FarmConnect SEO Implementation - Complete Code Analysis, ## Updated: 2026-01-22, ## Domain Strategy, ## 1. index.html (Full Source), ## 2. SEO.tsx (React Component for Per-Page SEO), ## 3. manifest.json (PWA Manifest), ## 4. sitemap.xml, ## 5. robots.txt

## DOCS/VIDEO/INVESTOR_PITCH_SCRIPT.md
- lines: 82
- non_empty_lines: 59
- headings_or_keys: # 💼 Farm Connect - 1 Minute Investor Pitch, ## 🎬 THE PITCH, ### 🔴 The Problem (10 sec), ### 🟢 Our Solution (15 sec), ### 📈 The Market (10 sec), ### ⚡ Our Traction (15 sec), ### 💰 The Ask (10 sec), ## 🎯 CHEAT SHEET

## DOCS/VIDEO/NEF_Innovation_Awards_2025_Submission.md
- lines: 56
- non_empty_lines: 37
- headings_or_keys: # Farm Connect: AI-Powered Crop Disease Detection, ## NEF Innovation Awards 2025, ## Project Overview, ## Team Composition, ## Prototype Readiness, ## Why This Matters

## DOCS/VIDEO/NES_VIDEO_RECORDING_GUIDE.md
- lines: 140
- non_empty_lines: 103
- headings_or_keys: # 🎬 NES Innovation Award - Complete Video Recording Guide, ## 📹 COMPLETE VISUAL FLOW, ### **(0–5 sec) INTRO**, ### **(5–15 sec) TECH STACK**, ### **(15–30 sec) AI MODEL & LOGIC**, ### **(30–45 sec) CORE FUNCTIONAL MODULES**, ### **(45–55 sec) VOICE & MULTILINGUAL**, ### **(55–60 sec) OUTCOME**

## DOCS/VIDEO/NES_VIDEO_SCRIPT.md
- lines: 103
- non_empty_lines: 75
- headings_or_keys: # 🎬 NES Innovation Award - 1 Minute Video Script, ## 📝 SCRIPT (Read while showing demo), ### Opening (5 seconds), ### 🤖 AI Models Used (15 seconds), ### 🛠️ Tech Stack & Framework (15 seconds), ### ⚙️ Backend/Frontend Logic (15 seconds), ### 📊 Key Outcomes & Outputs (10 seconds), ## 🎯 QUICK TALKING POINTS (Cheat Sheet)

## Dockerfile
- lines: 45
- non_empty_lines: 31

## README.md
- lines: 535
- non_empty_lines: 434
- headings_or_keys: # 🌾 Farm Connect: Pathway to Progress, ## 📋 Table of Contents, ## 🎯 Project Overview, ### Target Users, ## ✨ Key Features, ### 1. 🔬 AI-Powered Disease Detection, ### 2. 🌤️ Smart Weather Dashboard, ### 3. 🚜 Machinery Marketplace

## backend/api/ai.js
- lines: 467
- non_empty_lines: 395
- symbols_or_routes: getGroqClient, getGeminiClient, post /analyze-crop, post /farming-advice, post /gemini/analyze-crop, post /gemini/farming-advice
- signals: env-usage, auth-token

## backend/api/bookings.js
- lines: 469
- non_empty_lines: 409
- symbols_or_routes: generateBookingNumber, calculateDays, skip, post /, get /user/:userId, get /owner/:ownerId, get /:id, put /:id/status, post /:id/payment, delete /:id

## backend/api/diseases.js
- lines: 81
- non_empty_lines: 70
- symbols_or_routes: post /, get /user/:userId

## backend/api/machinery.js
- lines: 302
- non_empty_lines: 256
- symbols_or_routes: skip, get /, get /:id, post /, put /:id, delete /:id, get /:id/availability

## backend/api/messages.js
- lines: 325
- non_empty_lines: 286
- symbols_or_routes: generateConversationId, skip, post /, get /conversation/:userId/:otherUserId, get /conversations/:userId, put /:id/read, put /conversation/:conversationId/read-all, delete /:id

## backend/api/schemes.js
- lines: 77
- non_empty_lines: 63
- symbols_or_routes: get /, get /:id

## backend/api/users.js
- lines: 238
- non_empty_lines: 201
- symbols_or_routes: authenticateToken, generateToken, post /register, post /login, get /me
- signals: env-usage, auth-token

## backend/api/weather.js
- lines: 60
- non_empty_lines: 53
- symbols_or_routes: get /forecast
- signals: api-calls, env-usage

## backend/config/database.js
- lines: 50
- non_empty_lines: 42
- symbols_or_routes: connectToDatabase, getDatabase
- signals: env-usage

## backend/index.js
- lines: 177
- non_empty_lines: 152
- symbols_or_routes: formatDuration, post /api/ping, get /api/health, get *
- signals: env-usage

## backend/scripts/seedDemoMachinery.js
- lines: 302
- non_empty_lines: 293
- symbols_or_routes: seedDemoMachinery

## backend/scripts/seedDemoUsers.js
- lines: 92
- non_empty_lines: 82
- symbols_or_routes: seedDemoUsers

## backend/scripts/test-auth.js
- lines: 46
- non_empty_lines: 37
- symbols_or_routes: testAuth
- signals: api-calls, auth-token

## backend/tests/key-test.html
- lines: 400
- non_empty_lines: 346

## backend/tests/test-apis.js
- lines: 235
- non_empty_lines: 206
- symbols_or_routes: testEndpoint, runTests
- signals: api-calls

## backend/tests/test-populate-data.js
- lines: 376
- non_empty_lines: 365
- symbols_or_routes: populateData

## docker-compose.yml
- lines: 25
- non_empty_lines: 23

## frontend/components.json
- lines: 20
- non_empty_lines: 20
- headings_or_keys: key:$schema, key:style, key:rsc, key:tsx, key:tailwind, key:aliases

## frontend/eslint.config.js
- lines: 29
- non_empty_lines: 28

## frontend/index.html
- lines: 184
- non_empty_lines: 169

## frontend/postcss.config.js
- lines: 6
- non_empty_lines: 6

## frontend/public/favicon files/site.webmanifest
- lines: 1
- non_empty_lines: 1

## frontend/public/google8f43ddcd6bd4b600.html
- lines: 1
- non_empty_lines: 1

## frontend/public/health.html
- lines: 759
- non_empty_lines: 634

## frontend/public/manifest.json
- lines: 43
- non_empty_lines: 43
- headings_or_keys: key:name, key:short_name, key:description, key:start_url, key:display, key:background_color, key:theme_color, key:orientation, key:categories, key:icons, key:screenshots

## frontend/public/models/plant-disease/labels.json
- lines: 192
- non_empty_lines: 192
- headings_or_keys: key:0, key:1, key:2, key:3, key:4, key:5, key:6, key:7, key:8, key:9, key:10, key:11

## frontend/public/models/plant-disease/model.json
- lines: 1
- non_empty_lines: 1
- headings_or_keys: key:format, key:generatedBy, key:convertedBy, key:signature, key:modelTopology, key:weightsManifest

## frontend/public/placeholder.svg
- lines: 1
- non_empty_lines: 1

## frontend/public/robots.txt
- lines: 8
- non_empty_lines: 6

## frontend/public/sitemap.xml
- lines: 39
- non_empty_lines: 39

## frontend/public/sw.js
- lines: 95
- non_empty_lines: 87
- signals: api-calls

## frontend/src/App.css
- lines: 42
- non_empty_lines: 37

## frontend/src/App.tsx
- lines: 84
- non_empty_lines: 78
- symbols_or_routes: App
- signals: react-effects

## frontend/src/components/AIAnalyticsDashboard.tsx
- lines: 390
- non_empty_lines: 363
- symbols_or_routes: AIAnalyticsDashboard, loadAIRecommendations, loadWeatherAdvice, loadCropSuggestions, getMetricColor, getMetricBgColor, getRecommendationIcon
- signals: react-effects

## frontend/src/components/AdvancedFilters.tsx
- lines: 253
- non_empty_lines: 237
- symbols_or_routes: AdvancedFilters, handleFilterChange, handleReset, activeFiltersCount

## frontend/src/components/IndianFarmerWeatherDashboard.tsx
- lines: 953
- non_empty_lines: 871
- symbols_or_routes: IndianFarmerWeatherDashboard, getWeatherDescription, getWeatherIcon, getWindDirection, formatTime, getDayName, formatDate, getNearbyDistricts, useLocalStorage, useWeather, useLocationSearch, useMultipleWeather
- signals: api-calls, local-storage, react-effects

## frontend/src/components/Layout.tsx
- lines: 191
- non_empty_lines: 177
- symbols_or_routes: Layout, isActive, handleOpenLogin
- signals: react-effects

## frontend/src/components/LoginModal.tsx
- lines: 550
- non_empty_lines: 505
- symbols_or_routes: LoginModal, handleDemoLogin, resetForm
- signals: react-effects

## frontend/src/components/NotificationSystem.tsx
- lines: 215
- non_empty_lines: 197
- symbols_or_routes: NotificationSystem, markAsRead, markAllAsRead, deleteNotification, getNotificationIcon, formatTimestamp
- signals: react-effects

## frontend/src/components/OfflineIndicator.tsx
- lines: 18
- non_empty_lines: 15
- symbols_or_routes: OfflineIndicator

## frontend/src/components/PWAInstallPrompt.tsx
- lines: 94
- non_empty_lines: 83
- symbols_or_routes: PWAInstallPrompt, handleBeforeInstallPrompt, handleDismiss
- signals: react-effects

## frontend/src/components/PaymentGateway.tsx
- lines: 269
- non_empty_lines: 252
- symbols_or_routes: PaymentGateway, handleSubmit

## frontend/src/components/SEO.tsx
- lines: 45
- non_empty_lines: 40
- symbols_or_routes: SEO

## frontend/src/components/SmartWeatherDashboard.tsx
- lines: 600
- non_empty_lines: 553
- symbols_or_routes: SmartWeatherDashboard, generateFarmingAlerts, getRainIntensity, getWeatherIcon, getAlertIcon
- signals: react-effects

## frontend/src/components/UserProfile_WITH_DASHBOARD.tsx
- lines: 902
- non_empty_lines: 841
- symbols_or_routes: UserProfile, handleSave, handleSaveApiKey, handleRemoveApiKey, getCurrentApiKey, handleSaveGroqApiKey, handleRemoveGroqApiKey, getCurrentGroqApiKey, handleEditMachinery, handleSaveModelConfig, handleLogout
- signals: local-storage

## frontend/src/components/VoiceInterface.tsx
- lines: 385
- non_empty_lines: 351
- symbols_or_routes: VoiceInterface, handleTextQuery, speakResponse, startListening, stopListening, stopSpeaking
- signals: react-effects

## frontend/src/components/homepage/AIInsights.tsx
- lines: 326
- non_empty_lines: 310
- symbols_or_routes: AIInsights, downloadReport

## frontend/src/components/homepage/HeroSection.tsx
- lines: 113
- non_empty_lines: 102
- symbols_or_routes: HeroSection, handleVoiceQuery

## frontend/src/components/homepage/MachineryRental.tsx
- lines: 247
- non_empty_lines: 230
- symbols_or_routes: MachineryRental

## frontend/src/components/homepage/QuickActions.tsx
- lines: 171
- non_empty_lines: 161
- symbols_or_routes: QuickActions, handleActionClick

## frontend/src/components/ui/accordion.tsx
- lines: 56
- non_empty_lines: 49

## frontend/src/components/ui/alert-dialog.tsx
- lines: 139
- non_empty_lines: 126
- symbols_or_routes: AlertDialogHeader, AlertDialogFooter

## frontend/src/components/ui/alert.tsx
- lines: 59
- non_empty_lines: 53

## frontend/src/components/ui/aspect-ratio.tsx
- lines: 5
- non_empty_lines: 3

## frontend/src/components/ui/avatar.tsx
- lines: 48
- non_empty_lines: 43

## frontend/src/components/ui/badge.tsx
- lines: 36
- non_empty_lines: 31
- symbols_or_routes: Badge

## frontend/src/components/ui/breadcrumb.tsx
- lines: 115
- non_empty_lines: 105
- symbols_or_routes: BreadcrumbSeparator, BreadcrumbEllipsis

## frontend/src/components/ui/button.tsx
- lines: 60
- non_empty_lines: 55

## frontend/src/components/ui/calendar.tsx
- lines: 69
- non_empty_lines: 65
- symbols_or_routes: Calendar

## frontend/src/components/ui/card.tsx
- lines: 79
- non_empty_lines: 71

## frontend/src/components/ui/carousel.tsx
- lines: 260
- non_empty_lines: 231
- symbols_or_routes: useCarousel
- signals: react-effects

## frontend/src/components/ui/chart.tsx
- lines: 363
- non_empty_lines: 328
- symbols_or_routes: useChart, getPayloadConfigFromPayload, ChartStyle

## frontend/src/components/ui/checkbox.tsx
- lines: 28
- non_empty_lines: 25

## frontend/src/components/ui/collapsible.tsx
- lines: 9
- non_empty_lines: 5

## frontend/src/components/ui/command.tsx
- lines: 153
- non_empty_lines: 136
- symbols_or_routes: CommandDialog, CommandShortcut

## frontend/src/components/ui/context-menu.tsx
- lines: 198
- non_empty_lines: 181
- symbols_or_routes: ContextMenuShortcut

## frontend/src/components/ui/dialog.tsx
- lines: 120
- non_empty_lines: 108
- symbols_or_routes: DialogHeader, DialogFooter

## frontend/src/components/ui/drawer.tsx
- lines: 116
- non_empty_lines: 104
- symbols_or_routes: Drawer, DrawerHeader, DrawerFooter

## frontend/src/components/ui/dropdown-menu.tsx
- lines: 198
- non_empty_lines: 181
- symbols_or_routes: DropdownMenuShortcut

## frontend/src/components/ui/form.tsx
- lines: 176
- non_empty_lines: 152
- symbols_or_routes: useFormField

## frontend/src/components/ui/hover-card.tsx
- lines: 27
- non_empty_lines: 22

## frontend/src/components/ui/input-otp.tsx
- lines: 69
- non_empty_lines: 62

## frontend/src/components/ui/input.tsx
- lines: 22
- non_empty_lines: 19

## frontend/src/components/ui/label.tsx
- lines: 24
- non_empty_lines: 20

## frontend/src/components/ui/menubar.tsx
- lines: 234
- non_empty_lines: 216
- symbols_or_routes: MenubarShortcut

## frontend/src/components/ui/navigation-menu.tsx
- lines: 128
- non_empty_lines: 117

## frontend/src/components/ui/pagination.tsx
- lines: 117
- non_empty_lines: 107
- symbols_or_routes: Pagination, PaginationLink, PaginationPrevious, PaginationNext, PaginationEllipsis

## frontend/src/components/ui/popover.tsx
- lines: 29
- non_empty_lines: 24

## frontend/src/components/ui/progress.tsx
- lines: 26
- non_empty_lines: 23

## frontend/src/components/ui/radio-group.tsx
- lines: 42
- non_empty_lines: 38

## frontend/src/components/ui/resizable.tsx
- lines: 43
- non_empty_lines: 38
- symbols_or_routes: ResizablePanelGroup, ResizableHandle

## frontend/src/components/ui/scroll-area.tsx
- lines: 46
- non_empty_lines: 42

## frontend/src/components/ui/select.tsx
- lines: 158
- non_empty_lines: 145

## frontend/src/components/ui/separator.tsx
- lines: 29
- non_empty_lines: 26

## frontend/src/components/ui/sheet.tsx
- lines: 131
- non_empty_lines: 116
- symbols_or_routes: SheetHeader, SheetFooter

## frontend/src/components/ui/sidebar.tsx
- lines: 761
- non_empty_lines: 708
- symbols_or_routes: useSidebar, handleKeyDown, button
- signals: react-effects

## frontend/src/components/ui/skeleton.tsx
- lines: 15
- non_empty_lines: 13
- symbols_or_routes: Skeleton

## frontend/src/components/ui/slider.tsx
- lines: 26
- non_empty_lines: 23

## frontend/src/components/ui/sonner.tsx
- lines: 29
- non_empty_lines: 25
- symbols_or_routes: Toaster

## frontend/src/components/ui/switch.tsx
- lines: 27
- non_empty_lines: 24

## frontend/src/components/ui/table.tsx
- lines: 117
- non_empty_lines: 107

## frontend/src/components/ui/tabs.tsx
- lines: 53
- non_empty_lines: 47

## frontend/src/components/ui/textarea.tsx
- lines: 24
- non_empty_lines: 20

## frontend/src/components/ui/toast.tsx
- lines: 127
- non_empty_lines: 115

## frontend/src/components/ui/toaster.tsx
- lines: 33
- non_empty_lines: 31
- symbols_or_routes: Toaster

## frontend/src/components/ui/toggle-group.tsx
- lines: 59
- non_empty_lines: 51

## frontend/src/components/ui/toggle.tsx
- lines: 43
- non_empty_lines: 38

## frontend/src/components/ui/tooltip.tsx
- lines: 28
- non_empty_lines: 22

## frontend/src/components/ui/use-toast.ts
- lines: 3
- non_empty_lines: 2

## frontend/src/contexts/AuthContext.tsx
- lines: 158
- non_empty_lines: 138
- symbols_or_routes: AuthProvider, useAuth, logout
- signals: api-calls, local-storage, react-effects, auth-token

## frontend/src/hooks/use-mobile.tsx
- lines: 19
- non_empty_lines: 15
- symbols_or_routes: useIsMobile, onChange
- signals: react-effects

## frontend/src/hooks/use-toast.ts
- lines: 191
- non_empty_lines: 161
- symbols_or_routes: genId, dispatch, toast, useToast, addToRemoveQueue, reducer, update, dismiss
- signals: react-effects

## frontend/src/hooks/usePWA.ts
- lines: 31
- non_empty_lines: 24
- symbols_or_routes: usePWA, checkInstalled, isInWebApp, handleOnline, handleOffline
- signals: react-effects

## frontend/src/index.css
- lines: 129
- non_empty_lines: 96

## frontend/src/lib/ai.ts
- lines: 310
- non_empty_lines: 265
- symbols_or_routes: analyzeWithHybridMode, getDefaultConfig, getModelConfig, saveModelConfig
- signals: api-calls, local-storage, env-usage, ml-inference

## frontend/src/lib/api/bookingService.ts
- lines: 180
- non_empty_lines: 165
- symbols_or_routes: BookingService
- signals: api-calls

## frontend/src/lib/api/machineryService.ts
- lines: 164
- non_empty_lines: 149
- symbols_or_routes: MachineryService
- signals: api-calls

## frontend/src/lib/api/messageService.ts
- lines: 164
- non_empty_lines: 151
- symbols_or_routes: MessageService
- signals: api-calls

## frontend/src/lib/customModel.ts
- lines: 466
- non_empty_lines: 414
- symbols_or_routes: CustomModelService, labels, with
- signals: api-calls, ml-inference

## frontend/src/lib/detections.ts
- lines: 153
- non_empty_lines: 139
- symbols_or_routes: DetectionStorageService
- signals: api-calls, local-storage

## frontend/src/lib/gemini.ts
- lines: 185
- non_empty_lines: 156
- symbols_or_routes: getUserApiKey, GeminiAIService
- signals: api-calls, local-storage, env-usage

## frontend/src/lib/groq.ts
- lines: 103
- non_empty_lines: 85
- symbols_or_routes: getUserApiKey, GroqAIService
- signals: api-calls, local-storage, env-usage

## frontend/src/lib/otp.ts
- lines: 141
- non_empty_lines: 111
- symbols_or_routes: OTPService
- signals: local-storage

## frontend/src/lib/payment/paymentService.ts
- lines: 206
- non_empty_lines: 184
- symbols_or_routes: PaymentService
- signals: api-calls

## frontend/src/lib/schemas/booking.schema.ts
- lines: 103
- non_empty_lines: 90
- symbols_or_routes: generateBookingNumber

## frontend/src/lib/schemas/machinery.schema.ts
- lines: 69
- non_empty_lines: 67

## frontend/src/lib/schemas/message.schema.ts
- lines: 74
- non_empty_lines: 64
- symbols_or_routes: generateConversationId, isParticipant

## frontend/src/lib/utils.ts
- lines: 6
- non_empty_lines: 5
- symbols_or_routes: cn

## frontend/src/lib/weather.ts
- lines: 282
- non_empty_lines: 255
- symbols_or_routes: getCurrentLocation, mapWeatherResponse, getBasicInsights, getMockWeatherData
- signals: api-calls

## frontend/src/main.tsx
- lines: 14
- non_empty_lines: 12

## frontend/src/pages/BookingHistory.tsx
- lines: 248
- non_empty_lines: 226
- symbols_or_routes: BookingHistory, getStatusBadge
- signals: react-effects

## frontend/src/pages/Credits.tsx
- lines: 315
- non_empty_lines: 292
- symbols_or_routes: Credits, TeamCard
- signals: react-effects

## frontend/src/pages/DiseaseDetection.tsx
- lines: 662
- non_empty_lines: 618
- symbols_or_routes: DiseaseDetection, handleImageUpload, handleFileSelect, handleDrop, handleViewSimilarCases, getSeverityColor, getSeverityTextColor
- signals: react-effects

## frontend/src/pages/GovernmentSchemes.tsx
- lines: 441
- non_empty_lines: 413
- symbols_or_routes: GovernmentSchemes, handleApplyScheme, getStatusIcon, getStatusText
- signals: api-calls, react-effects

## frontend/src/pages/HomePage.tsx
- lines: 19
- non_empty_lines: 18
- symbols_or_routes: HomePage

## frontend/src/pages/Index.tsx
- lines: 14
- non_empty_lines: 12
- symbols_or_routes: Index

## frontend/src/pages/KisanBazaar.tsx
- lines: 452
- non_empty_lines: 421
- symbols_or_routes: KisanBazaar, handleContactSeller, handleAddToCart, getQualityColor

## frontend/src/pages/MachineryDetail.tsx
- lines: 459
- non_empty_lines: 425
- symbols_or_routes: MachineryDetail, calculateTotalCost, handleOpenChat
- signals: react-effects

## frontend/src/pages/MachineryForm.tsx
- lines: 559
- non_empty_lines: 525
- symbols_or_routes: MachineryForm, handleImageUpload, removeImage, addSpecification, updateSpecification, removeSpecification, addFeature, removeFeature
- signals: react-effects

## frontend/src/pages/MachineryMarketplace.tsx
- lines: 300
- non_empty_lines: 279
- symbols_or_routes: MachineryMarketplace, handleViewDetails, handleBookMachinery
- signals: react-effects

## frontend/src/pages/NotFound.tsx
- lines: 82
- non_empty_lines: 76
- symbols_or_routes: NotFound
- signals: react-effects

## frontend/src/pages/NotFoundPage.tsx
- lines: 47
- non_empty_lines: 44
- symbols_or_routes: NotFoundPage

## frontend/src/pages/OwnerDashboard.tsx
- lines: 587
- non_empty_lines: 548
- symbols_or_routes: OwnerDashboard, handleEditMachinery
- signals: react-effects

## frontend/src/pages/UserProfile.tsx
- lines: 1624
- non_empty_lines: 1538
- symbols_or_routes: UserProfile, handleDeleteMachinery, handleEditMachinery, getFilteredBookings, handleSaveApiKey, handleSaveGroqApiKey, handleSaveModelConfig, getCurrentApiKey, getCurrentGroqApiKey, handleLogout
- signals: local-storage, react-effects

## frontend/src/pages/Weather.tsx
- lines: 15
- non_empty_lines: 14
- symbols_or_routes: Weather

## frontend/src/registerSW.ts
- lines: 95
- non_empty_lines: 78
- symbols_or_routes: isPWAInstalled
- signals: env-usage

## frontend/src/utils/pwa.ts
- lines: 19
- non_empty_lines: 15
- symbols_or_routes: isPWAInstalled, isInWebApp, isPWASupported, getInstallPrompt, clearInstallPrompt

## frontend/src/vite-env.d.ts
- lines: 1
- non_empty_lines: 1

## frontend/tailwind.config.ts
- lines: 119
- non_empty_lines: 118

## frontend/tsconfig.app.json
- lines: 29
- non_empty_lines: 27

## frontend/tsconfig.json
- lines: 19
- non_empty_lines: 19
- headings_or_keys: key:files, key:references, key:compilerOptions

## frontend/tsconfig.node.json
- lines: 22
- non_empty_lines: 20

## frontend/vite.config.ts
- lines: 47
- non_empty_lines: 45
- signals: env-usage

## ml/PlantDiseaseTraining.ipynb
- lines: 550
- non_empty_lines: 550

## ml/README.md
- lines: 149
- non_empty_lines: 104
- headings_or_keys: # Plant Disease Detection ML Training, ## 🚀 Recommended: Train on Google Colab (Free GPU), ### Steps:, # Extract tfjs_model.zip and copy contents to:, ## ⚠️ Keras 3.x Compatibility Fix, # Re-export as Graph Model (compatible with browser TensorFlow.js), # Load the saved model, # Save as SavedModel format first

## ml/dataset.py
- lines: 215
- non_empty_lines: 174
- symbols_or_routes: def get_data_augmentation, def preprocess_image, def load_plant_village_dataset, def one_hot_encode, def save_class_labels

## ml/export.py
- lines: 238
- non_empty_lines: 188
- symbols_or_routes: def check_tensorflowjs, def export_to_tfjs, def create_model_metadata, def main

## ml/model.py
- lines: 196
- non_empty_lines: 144
- symbols_or_routes: def create_model, def unfreeze_for_fine_tuning, def create_inference_model, def print_model_summary

## ml/requirements.txt
- lines: 17
- non_empty_lines: 14

## ml/train.py
- lines: 242
- non_empty_lines: 196
- symbols_or_routes: def train_model, def main

## package-lock.json
- lines: 9916
- non_empty_lines: 9916
- headings_or_keys: key:name, key:version, key:lockfileVersion, key:requires, key:packages

## package.json
- lines: 103
- non_empty_lines: 103
- headings_or_keys: key:name, key:private, key:version, key:type, key:scripts, key:dependencies, key:devDependencies

## scripts/update-domain.js
- lines: 76
- non_empty_lines: 65

## vercel.json
- lines: 41
- non_empty_lines: 41
- headings_or_keys: key:outputDirectory, key:rewrites, key:headers

