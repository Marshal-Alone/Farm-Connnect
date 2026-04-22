# Farm-Connect Project Flow (Detailed Viva Version)

## What This Project Is
Farm-Connect is an integrated agriculture support platform. Instead of solving only one problem, it combines four practical farmer workflows in one system:

1. User authentication and profile identity
2. Crop disease analysis from uploaded images
3. Machinery rental and booking management
4. Weather-aware farming recommendations

The main design idea is integration: a farmer should not need separate apps for diagnosis, planning, and resource booking.

## Architecture in Simple Terms
- **Frontend (`frontend/src`)**: User interface built with React and TypeScript.
- **Backend (`backend/index.js`, `backend/api`)**: REST API server using Express.
- **Database (`backend/config/database.js`)**: MongoDB collections for users, machinery, bookings, diseases, crops, and recommendations.
- **ML and training scripts (`ml`)**: Training and export pipeline for disease model.
- **Model deployment assets (`frontend/public/models/plant-disease`)**: Browser-loadable model files for client-side prediction.

Think of it as:
- Frontend = what the user sees
- Backend = business rules and secure API handling
- Database = persistent memory of the platform
- ML layer = disease intelligence module

## End-to-End Flow 1: Authentication
1. User submits credentials to `/api/auth/register` or `/api/auth/login`.
2. Backend validates input and hashes password with `bcrypt`.
3. On success, backend returns a JWT token.
4. Frontend stores token and sends it in `Authorization: Bearer <token>`.
5. Protected routes verify token and attach user identity to `req.user`.

Why this matters in viva: this proves the platform supports identity-aware actions, not just public demo pages.

## End-to-End Flow 2: Disease Detection
1. User uploads crop image on disease page.
2. Frontend converts image to base64 and sends it for analysis.
3. In hybrid mode, local TensorFlow.js model predicts first.
4. Backend AI route (`/api/ai/analyze-crop` or Gemini path) validates and refines diagnosis.
5. App displays structured output: disease name, confidence, severity, treatment, prevention.
6. Detection history can be saved to `/api/diseases` for tracking past cases.

Why this matters: the app is not a raw chatbot response. It converts model output into structured, farmer-usable recommendations.

## End-to-End Flow 3: Machinery Booking
1. User browses machinery marketplace.
2. User selects start and end dates and creates booking via `/api/bookings`.
3. Backend checks if requested date range overlaps existing `bookedDates`.
4. If overlap exists, booking is rejected.
5. If valid, booking is created and machine calendar is blocked for those dates.
6. Booking status progresses through lifecycle states (pending, confirmed, active, completed/cancelled).

Why this matters: there is operational business logic, not only form submission.

## End-to-End Flow 4: Weather Advisory
1. Weather data is fetched from weather service.
2. Crop context is combined with weather context.
3. Backend advisory route (`/api/weather-advice`) generates practical actions:
   - what to do today
   - risks to watch
   - what to monitor next

Why this matters: weather feature is not just temperature display; it is decision support.

## Why the Overall Flow Is Valuable
- One unified platform for farm decision workflow
- Practical combination of AI + operations + planning
- Better usability because diagnosis, advisory, and booking are connected
- Strong viva point: this is systems engineering with multiple interacting modules
