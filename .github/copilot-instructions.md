# Farm Connect - AI Coding Agent Instructions

**Project**: AI-powered agricultural support platform for Indian farmers with disease detection, machinery rental, weather insights, and government schemes portal.

## Architecture Overview

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn UI (Radix primitives)
- **Backend**: Node.js Express API
- **Database**: MongoDB (collections: machinery, bookings, reviews, messages, users, etc.)
- **AI/ML**: Groq LLM (default) or Google Gemini Vision AI for crop disease detection
- **APIs**: WeatherAPI.com, voice recognition, Razorpay (payment stub)

### Project Structure
```
src/
  pages/          # Route components (HomePage, DiseaseDetection, MachineryDetail, etc.)
  components/     # Reusable UI components, homepage sections
    ui/           # Shadcn UI component library
  lib/
    ai.ts         # AI model abstraction layer (Groq/Gemini switching)
    groq.ts       # Groq LLM integration for disease detection + chatbot
    gemini.ts     # Google Gemini Vision AI alternative
    api/          # Frontend service layer (machineryService, bookingService, etc.)
    schemas/      # TypeScript interfaces (MachinerySchema, BookingSchema, etc.)
  contexts/       # React Context (AuthContext with JWT token storage)
api/              # Express route handlers (machinery.js, bookings.js, etc.)
server.js         # Express server with CORS & middleware setup
database.js       # MongoDB connection & collection definitions
```

## Critical Data Flows

### 1. Machinery Marketplace & Booking
- **Machinery Creation** → Owner form uploads machinery → POST `/api/machinery` → MongoDB stored
- **Booking Flow** → Renter selects dates → POST `/api/bookings` (status: "pending") → Owner must approve → `bookingService.updateBookingStatus()`
- **Key Constraint**: Owners can ONLY see their own machinery; filter by `ownerId` in OwnerDashboard
- **Booked Dates**: Track in `machinery.bookedDates[]` to prevent double-booking

### 2. Disease Detection Pipeline
- User uploads crop image → `analyzeCropImage(imageBase64)` in `ai.ts`
- Config determines provider: `getModelConfig().diseaseDetection` (groq or gemini)
- **Groq Path**: Sends to Groq LLM with detailed plant pathology prompts
- **Gemini Path**: Uses Google Gemini Vision with base64 image → returns structured `AICropAnalysis`
- Response includes: disease name, severity (Low/Medium/High), treatment steps, prevention tips

### 3. AI Provider Switching
- Users set preferences in UserProfile Settings
- Config stored in localStorage: `farm-connect-model-settings`
- Both disease detection + chatbot can use different providers independently
- Groq requires API key in localStorage: `groq_api_key`; Gemini requires `gemini_api_key`

### 4. Authentication & User Context
- JWT token stored in localStorage: `FarmConnect_token`
- AuthContext provides `user` object (id, email, name, language, farmSize, crops)
- All API calls include `Authorization: Bearer {token}` header
- Token validation in backend via `/api/auth/me` on app load

## Key Conventions & Patterns

### API Service Layer (`src/lib/api/`)
Each service class encapsulates domain logic:
- `machineryService.getMachinery()`, `.createMachinery()`, `.updateMachinery()`
- `bookingService.createBooking()`, `.getOwnerBookings()`, `.updateBookingStatus()`
- Services use `/api` base URL (proxied to `http://localhost:4174` in dev)
- Responses always include `{ success: boolean, data?: T, error?: string }`

### Express Route Pattern (`api/*.js`)
```javascript
router.get('/:id', async (req, res) => {
  const db = await getDatabase();
  const collection = db.collection(collections.machinery);
  // Logic here
  res.json({ success: true, data: result });
});
```

### Schema Definitions (`src/lib/schemas/`)
TypeScript interfaces define MongoDB document structure. Keep in sync with backend inserts.
Example: `MachinerySchema` includes `ownerId`, `bookedDates[]`, `pricePerDay`, `images[]`, `specifications[]`

### Conditional Rendering in Components
Use user role determination: check if user listing appears in owner dashboard (i.e., machinery.ownerId === user.id) vs. browsing as renter

## Development Workflows

### Running the Project
```bash
npm run dev              # Frontend at localhost:8080, proxies /api to 4174
node server.js          # Backend API at localhost:4174 (set PORT=4174)
npm run build           # Production build with vite build
```

### Database Seeding
```bash
node scripts/seedDemoMachinery.js    # Populates demo machinery
node test-populate-data.js           # Populates sample machinery
```

### Adding New Features
1. **Frontend**: Create page in `src/pages/`, add route in `App.tsx`
2. **Service Layer**: Add methods in `src/lib/api/*Service.ts`
3. **Backend**: Add route handler in `api/*.js`
4. **Schema**: Update TypeScript interface in `src/lib/schemas/`
5. **Database**: Ensure MongoDB collection + fields exist

### Common Pitfalls
- **Owner Dashboard**: Must filter machinery by `ownerId === user.id` to avoid showing others' machines
- **Booking Status**: Always starts as "pending"; owner approval required before transitioning
- **Booked Dates Conflict**: Check `machinery.bookedDates[]` before confirming booking
- **AI Key Management**: Never commit API keys; users must add via Settings UI
- **CORS**: Backend sets `Access-Control-Allow-Origin: *` in middleware

## External Dependencies & Integration Points

| Service | Purpose | Config |
|---------|---------|--------|
| **WeatherAPI.com** | Real-time weather + 7-day forecast | API calls from `src/lib/weather.ts` |
| **Groq LLM** | Disease detection + chatbot (default) | API key from localStorage |
| **Google Gemini Vision AI** | Alternative disease detection | Optional, user-configurable |
| **MongoDB** | Persistent storage (machinery, bookings, etc.) | `MONGO_URI` env var |
| **Razorpay** | Payment gateway (stub implementation) | Payment integration in BookingSchema |

## Notes for AI Agents

- **TypeScript strict mode**: Project uses strict tsconfig; check interface compatibility
- **Shadcn UI**: All UI components in `src/components/ui/` are Radix-based; study existing usage patterns
- **Vite configuration**: API proxy for `/api` routes prevents CORS during dev
- **PWA Support**: Service worker at `public/sw.js`; offline indicator component in use
- **Multilingual (Not Yet Implemented)**: UI supports language selection; translation strings need addition
- **Voice Interface**: Voice input/output components exist but may need Web Speech API polyfill
- **Error Handling**: Use `useToast()` hook for user feedback; always check `response.success` in API calls

