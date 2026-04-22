# Rolewise Viva Guide: Frontend Role

## Role Mission
Build the user-facing application flow, connect UI with backend APIs, present AI outputs in understandable form, and maintain smooth user journey across auth, disease detection, weather, and booking features.

## Core Frontend Files to Know
- `frontend/src/App.tsx`: route-level page mapping
- `frontend/src/contexts/AuthContext.tsx`: login/register/session persistence
- `frontend/src/pages/DiseaseDetection.tsx`: image upload and diagnosis UI flow
- `frontend/src/lib/ai.ts`: provider abstraction and hybrid orchestration
- `frontend/src/lib/customModel.ts`: browser model loading and inference
- `frontend/src/pages/MachineryMarketplace.tsx`: listing and filters
- `frontend/src/pages/MachineryDetail.tsx`: booking initiation page
- `frontend/src/pages/BookingHistory.tsx`, `OwnerDashboard.tsx`: booking lifecycle visibility

## Frontend Architecture in Simple Terms
The frontend is route-driven React.  
Pages are feature modules.  
Shared state like auth is managed in context.  
Data is fetched through service layers or utility modules, then transformed into user-readable UI.

## Design Decisions You Can Explain
1. Context for auth to avoid repeated login state logic
2. AI provider abstraction so model backend can switch without rewriting pages
3. Structured result display (confidence, severity, treatment, prevention) for clarity
4. Service-style API modules for cleaner page code

## Deep Frontend Viva Q&A

### Q1: How is your frontend organized?
By routes and feature pages. Shared logic (auth/AI/services) is separated from visual components.

### Q2: How do you maintain login state after page refresh?
Token is stored in local storage and validated by calling `/auth/me` during app initialization.

### Q3: How do users trigger disease detection?
Upload image in disease page -> image is prepared -> provider selected from config -> result displayed with structured fields.

### Q4: Why provider abstraction in `ai.ts`?
It decouples UI from model vendor and allows custom/groq/gemini/hybrid switching.

### Q5: How does hybrid mode improve UX?
Users get fast local predictions while still benefiting from cloud validation, reducing uncertain outputs.

### Q6: How are failures handled in frontend?
Async calls are wrapped with error handling, and fallback behavior exists where possible (for example custom first then cloud fallback).

### Q7: How do you make complex AI outputs understandable?
By mapping model output to clear UI sections: diagnosis, severity, treatment steps, prevention actions.

### Q8: How is booking flow implemented in UI?
Marketplace list -> detail page with dates -> booking request -> history/owner dashboard for lifecycle updates.

### Q9: Why use modular pages instead of one huge page?
Separation improves maintainability, performance tuning, and role-wise development.

### Q10: How does frontend support multilingual interaction?
AI advice layer supports language parameter and multilingual voice/chat interfaces at component level.

### Q11: How do you prevent frontend from exposing server API keys?
Sensitive provider keys are not hardcoded into UI source; backend proxy endpoints are used for secured model calls.

### Q12: What would you improve next in frontend?
Stronger typed response contracts, better loading/error skeleton states, and consistency across weather modules.

## Trap Questions + Recovery

### Trap: “Frontend is just UI, where is engineering?”
Recovery: Engineering includes state architecture, provider abstraction, workflow orchestration, failure handling, and consistent API-contract integration.

### Trap: “Can your frontend run without backend?”
Recovery: Some local model inference can run in-browser, but integrated workflows like auth, persistence, bookings, and cloud advisory require backend.

## 90-second Frontend Answer Script
“The frontend is built as a route-based React application with clear separation between pages, shared contexts, and service logic. Authentication state is centralized in `AuthContext` and persisted across refresh through token validation. Disease detection UI integrates with an AI abstraction layer that supports multiple providers including hybrid mode. Machinery booking and history are implemented as end-to-end user workflows, not isolated forms. The frontend focuses on converting technical API outputs into clear farmer-friendly actions while keeping feature modules maintainable and extensible.”
