# Farm-Connnect: Complete Technical Understanding Report

Generated: 2026-04-13
Repository: `c:\Users\marsh\OneDrive\Desktop\MAJOR PROJECT\Farm-Connnect`

## 1) Scope and Coverage Completed

- Git-tracked files enumerated: **250**
- Readable tracked text files processed line-by-line: **198**
- Non-text/binary tracked files cataloged: **52**
- Additional binary thesis/presentation docs parsed from tracked files (`.pdf`, `.pptx`, `.docx`): **7**
- Aggregate readable line volume (tracked text pass): **~44,026 lines**

Evidence artifacts:
- `project_audit/inventory.json`
- `project_audit/inventory_summary.json`
- `project_audit/coverage_report.md`
- `project_audit/all_text_snapshot.txt`
- `project_audit/docs_digest.md`
- `project_audit/tracked_binary_doc_extracts.md`
- `project_audit/commit_analysis.md`

## 2) System Architecture (As Implemented)

### Frontend
- Stack: React 18 + TypeScript + Vite + Tailwind + shadcn/radix UI.
- Entry + router:
  - `frontend/src/main.tsx`
  - `frontend/src/App.tsx`
- Core pages include:
  - Home, disease detection, weather, machinery listing/detail/form, bookings, owner dashboard, schemes, profile, bazaar, credits/team, not-found.
- AI orchestration:
  - `frontend/src/lib/ai.ts` routes disease/advice calls through provider config (`gemini`, `groq`, `custom`, `hybrid`).
  - `frontend/src/lib/customModel.ts` loads TFJS model from `frontend/public/models/plant-disease/`.
- Auth/session:
  - `frontend/src/contexts/AuthContext.tsx` handles login/register/me.

### Backend
- Stack: Node.js + Express + MongoDB native driver + JWT auth.
- Entry:
  - `backend/index.js`
- Route modules:
  - `backend/api/users.js` (auth/me)
  - `backend/api/machinery.js`
  - `backend/api/bookings.js`
  - `backend/api/messages.js`
  - `backend/api/weather.js`
  - `backend/api/diseases.js`
  - `backend/api/schemes.js`
  - `backend/api/ai.js` (Groq/Gemini proxy endpoints)
- DB singleton config:
  - `backend/config/database.js`

### ML Subsystem
- Local training/export pipeline under `ml/`:
  - `dataset.py`, `model.py`, `train.py`, `export.py`, `PlantDiseaseTraining.ipynb`
- Architecture: MobileNetV2 transfer learning to 38-class classifier.
- Browser inference path: TFJS model (`model.json` + shard bins) in public model directory.

### Deployment
- Frontend build/deploy tuned for Vercel.
- API rewrite in `vercel.json` points `/api/*` to hosted backend URL.
- Docker support present:
  - `Dockerfile`, `docker-compose.yml`

## 3) End-to-End Functional Flows

### Authentication
1. Frontend login/register through `AuthContext`.
2. Backend JWT issuance/verification in `users.js`.
3. Protected data calls rely on stored token in local storage.

### Disease Detection
1. User uploads crop image on `DiseaseDetection` page.
2. Provider selected via model config (`UserProfile` settings).
3. Calls backend proxy endpoints (`/api/ai/*`) for Groq/Gemini, or TFJS local model for offline/custom path.
4. Optional persistence of detections through `/api/diseases`.

### Machinery Marketplace + Booking
1. Listings CRUD via `/api/machinery`.
2. Booking creation/status/payment metadata via `/api/bookings`.
3. Owner dashboard consumes owner booking routes and approval actions.

### Messaging
1. Conversations/messages managed via `/api/messages` endpoints.
2. Frontend profile dashboard handles polling + unread management.

### Weather
1. Primary backend weather route proxies WeatherAPI (`/api/weather/forecast`).
2. Additional dashboard component also uses Open-Meteo directly in frontend for enhanced UI.

## 4) Commit-History Evolution (46 commits)

Date range: **2025-09-14 to 2026-02-10**

Major milestones:
- Initial setup + deployment + early UI/auth/PWA adjustments.
- Groq/Gemini AI provider integration and voice assistant.
- Machinery rental, booking, messaging feature growth.
- Project restructure into `frontend/` + `backend/` (Jan 2026).
- Custom ML model integration (`ml/` + TFJS artifacts).
- Security/proxy hardening for AI key handling.
- SEO/domain migration toward `farmbro.vercel.app`.
- Presentation and documentation asset expansion.

Commit analytics:
- Total lines added: 74,258
- Total lines deleted: 25,243
- Net LOC delta: 49,015

Reference: `project_audit/commit_analysis.md`

## 5) Current Health Check (Build/Test Evidence)

Command run:
- `npm run build` (root)

Observed:
- Build **passes** with Vite production output.
- Bundle warning: large JS chunk (~2.5 MB minified bundle).
- Dependency audit warning present (12 vulnerabilities reported by npm audit output).

## 6) Key Technical Risks / Gaps Identified

1. Runtime bug risk in backend health endpoints:
- In `backend/index.js`, `serverHealth` object appears commented out while `/api/ping` and `/api/health` still reference it.
- This can break health routes at runtime.

2. Sensitive default credential fallback in DB config:
- `backend/config/database.js` includes a hardcoded MongoDB URI fallback with credentials.
- This is unsafe for public code and thesis review scrutiny.

3. Token/API key client storage exposure:
- Frontend stores JWT and provider keys in local storage.
- This increases XSS blast radius compared to httpOnly-cookie approaches.

4. Integration mismatch / stubs:
- Frontend `paymentService` calls `/api/payment/*`, but payment routes are not present in current backend route mount list.

5. Duplicate/legacy UI artifacts:
- Coexisting pages/components indicate legacy paths (e.g., `NotFound.tsx` vs `NotFoundPage.tsx`, `UserProfile_WITH_DASHBOARD.tsx`).

6. Documentation drift risk:
- Some docs and quick references still mention removed/partial routes (e.g., reviews) or old paths.

## 7) External Research Collected (for Thesis Anchoring)

Technical/docs references checked:
- Groq Vision docs + changelog:
  - https://console.groq.com/docs/vision
  - https://console.groq.com/docs/changelog
- Gemini vision docs:
  - https://ai.google.dev/gemini-api/docs/vision
- WeatherAPI docs:
  - https://www.weatherapi.com/docs/
- TensorFlow Datasets PlantVillage:
  - https://www.tensorflow.org/datasets/catalog/plant_village
- TensorFlow.js save/load:
  - https://www.tensorflow.org/js/guide/save_load
- MobileNetV2 paper:
  - https://arxiv.org/abs/1801.04381
- MDN SpeechRecognition:
  - https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
- MongoDB connection string reference:
  - https://www.mongodb.com/docs/current/reference/connection-string/
- OWASP HTML5 security cheat sheet (storage guidance):
  - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
- Express production security best practices:
  - https://expressjs.com/en/advanced/best-practice-security
- India telecom/internet statistical report (TRAI):
  - https://www.trai.gov.in/sites/default/files/2025-07/YIR_08072025.pdf

## 8) Thesis-Readiness Position

This repository is now fully mapped at architecture, route, module, and historical levels with evidence artifacts in `project_audit/`.

For the next phase (college thesis file analysis), we are ready to:
- Compare existing college template requirements vs actual implementation.
- Align claims in synopsis/report with verifiable code and deployment evidence.
- Produce a professional BTech major-project thesis with accurate technical depth and defensible results.

## 9) Untracked Thesis Template Artifacts (Workspace)

- Additional thesis-template files were detected under:
  - `project_audit/0 Thesis/`
- They are not git-tracked project source, but were still parsed for readiness:
  - Extract report: `project_audit/thesis_templates_extract.md`
- Coverage note:
  - `.docx` templates extracted with structured XML parsing.
  - Legacy binary `.doc`/`.ppt` files were extracted with fallback text heuristics (partial/noisy output expected).
