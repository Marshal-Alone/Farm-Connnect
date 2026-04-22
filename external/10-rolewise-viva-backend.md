# Rolewise Viva Guide: Backend Role

## Role Mission
Design and maintain server-side business logic, API contracts, module routing, and feature workflows across authentication, disease services, booking lifecycle, chat, and crop tracking.

## Core Backend Files to Know
- `backend/index.js`: Express app bootstrap, route mounting, middleware, health route
- `backend/api/users.js`: register/login/JWT verify/current user
- `backend/api/machinery.js`: machinery CRUD, filters, availability logic
- `backend/api/bookings.js`: booking creation, status transitions, cancellation/payment
- `backend/api/ai.js`: Groq/Gemini proxy routes and diagnosis normalization
- `backend/api/messages.js`: messaging and conversation state
- `backend/api/crops.js`: authenticated crop lifecycle + action logs
- `backend/api/diseases.js`: disease record persistence

## Backend Architecture Explanation
The backend follows route-module structure. Each feature has its own API file. Common database access comes through `getDatabase()` from config. The server mounts all APIs under `/api/*` paths and handles JSON parsing, CORS, logging, and error handling globally.

## Key Backend Decisions You Can Defend
1. Modular API separation by domain
2. Shared database utility instead of direct client creation in every file
3. Stateless token auth flow
4. Explicit status-driven booking lifecycle
5. Structured AI output normalization before sending to UI

## Deep Backend Viva Q&A

### Q1: How is your backend organized?
It is domain-modular. APIs are split by feature in `backend/api`. The main server file mounts each route group and handles common middleware.

### Q2: Why modular routing?
It keeps features isolated, easier to debug, test, and extend without creating one monolithic controller file.

### Q3: How do requests flow from frontend to DB?
Frontend calls REST endpoint -> route validates input -> route gets DB from singleton helper -> executes CRUD -> returns structured JSON.

### Q4: How do you handle errors?
Each route uses try/catch and sends controlled error responses. A global error middleware exists as final fallback.

### Q5: How do you keep API response format consistent?
Most routes return `{ success, data/error }` structure to simplify frontend handling.

### Q6: How is booking lifecycle controlled?
Booking starts pending, then transitions through confirmed, in-progress, completed, or cancelled, with timestamp fields updated per state.

### Q7: How do you avoid invalid status transitions?
Current code updates by requested status, and can be hardened further with explicit transition guards (future improvement).

### Q8: How is non-plant image handling done?
AI route normalization supports `isPlant=false`, returning safe “Not a Plant” style output instead of forcing disease prediction.

### Q9: Where do you implement pagination?
List endpoints like bookings and machinery use `skip`, `limit`, `countDocuments` and return pagination metadata.

### Q10: What middleware is critical in your backend?
JSON body parsing, CORS handling, request logging, and JWT verification for protected routes.

### Q11: Why not GraphQL?
REST is simpler for this project’s modular route setup and easier for team debugging and viva explanation.

### Q12: How does backend support frontend resilience?
Clear response envelopes and explicit status/error paths allow frontend to show user-friendly failure states.

## Trap Questions + Recovery

### Trap: “Your backend is only wrappers around third-party APIs.”
Recovery: Backend does orchestration and enforcement: normalization, validation, route-level business logic, booking lifecycle rules, persistence, and ownership filters.

### Trap: “Where is your scalability thinking?”
Recovery: Modular routes, pagination, index initialization, singleton DB connection, and clear roadmap for transaction-safe booking updates.

## 90-second Backend Answer Script
“The backend is implemented as domain-specific Express route modules mounted from a single app entry point. It handles authentication, machinery and booking workflows, disease analysis orchestration, chat messaging, and crop action tracking. Each route follows a structured flow: validate input, fetch database handle, perform scoped CRUD, and return standardized JSON. Booking is implemented as a state machine with status timestamps, and AI responses are normalized before frontend consumption. The architecture is modular and practical for scaling feature-wise without coupling everything into one controller.”
