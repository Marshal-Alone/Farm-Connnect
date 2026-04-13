# BTECHCSE801T Project Report
## FARMCONNECT: CROP DISEASE DETECTION AND MACHINERY RENTAL PLATFORM

Submitted to Rashtrasant Tukadoji Maharaj Nagpur University, Nagpur
in partial fulfillment of requirements for the award of the degree of
Bachelor of Technology in Computer Science and Engineering

Department of Computer Science and Engineering
Nagpur Institute of Technology, Nagpur
Academic Session: 2025-2026

Submitted by:
1. Marshal P. Alone
2. Vaishnavi D. Getme
3. Mrunali Umak
4. Sanskruti Patil
5. Aditya Kawale

Under the guidance of:
Mr. Tejas Dhule
Assistant Professor

---

## DECLARATION

We hereby declare that the project report entitled **"FarmConnect: Crop Disease Detection and Machinery Rental Platform"** is an original work carried out by us in the Department of Computer Science and Engineering, Nagpur Institute of Technology, Nagpur. This work has not been submitted previously, in full or part, for any degree or diploma in this or any other university.

We acknowledge all referenced material and sources used in this report.

Date: ____ / ____ / 2026

Signatures of Students:
1. ______________________
2. ______________________
3. ______________________
4. ______________________
5. ______________________

---

## CERTIFICATE

This is to certify that the BTECHCSE801T Project Report entitled **"FarmConnect: Crop Disease Detection and Machinery Rental Platform"** submitted by the students listed above is a bona fide work completed under my guidance during academic year 2025-2026 in partial fulfillment of the requirements for the award of Bachelor of Technology in Computer Science and Engineering.

Guide: ______________________
Project Coordinator: ______________________
Head of Department: ______________________

Date: ____ / ____ / 2026

---

## PROJECT APPROVAL SHEET

Project Title: **FarmConnect: Crop Disease Detection and Machinery Rental Platform**

Approved for B.Tech CSE Final Year Major Project evaluation.

Internal Examiner: ______________________
External Examiner: ______________________

Date: ____ / ____ / 2026

---

## ACKNOWLEDGEMENT

We express our sincere gratitude to **Mr. Tejas Dhule**, Assistant Professor, Department of Computer Science and Engineering, for his continuous technical guidance, reviews, and project direction throughout this work.

We thank the Head of Department, project coordinator, and all faculty members of the CSE department for academic support and infrastructure.

We acknowledge our teammates for disciplined collaboration across frontend development, backend APIs, AI integration, model training pipeline, testing, and documentation.

We also thank our institute and university for providing the platform and opportunity to execute this industry-relevant major project.

---

## ABSTRACT

Agriculture remains a strategic sector for India, both economically and socially. As reported in Economic Survey 2025-26, agriculture and allied activities contribute nearly one-fifth of national income while supporting 46.1% of the workforce [R1]. Despite this scale, farmers continue to face fragmented digital services for disease diagnosis, weather advisories, machinery access, and scheme awareness. FarmConnect addresses this gap by providing a unified web platform that combines crop disease detection, AI advisory, weather intelligence, machinery rental workflows, messaging, and government scheme discovery in one integrated system.

FarmConnect is implemented as a full-stack web application using React + TypeScript frontend and Node.js + Express + MongoDB backend. The disease module supports hybrid AI analysis through cloud vision models and a local TensorFlow.js model trained on PlantVillage-class labels. The weather module integrates forecast and alert data, while the machinery module supports listing, booking, owner approvals, and user communication. Multilingual voice input and chatbot responses improve accessibility for users with limited digital literacy.

The project evolved through 46 commits between September 2025 and February 2026 with feature milestones including AI integration, messaging, deployment split, and custom model support. Build validation confirms production build generation. This report documents architecture, methodology, implementation, calculations, outcomes, observed limitations, and future roadmap toward a production-grade digital agriculture platform.

**Keywords:** Smart Agriculture, Crop Disease Detection, TensorFlow.js, Groq Vision, Gemini Vision, WeatherAPI, Machinery Rental, Digital Agriculture Platform

---

## LIST OF ACRONYMS

| Sr. No. | Acronym | Full Form |
|---|---|---|
| 1 | AI | Artificial Intelligence |
| 2 | ML | Machine Learning |
| 3 | CNN | Convolutional Neural Network |
| 4 | TFJS | TensorFlow.js |
| 5 | API | Application Programming Interface |
| 6 | REST | Representational State Transfer |
| 7 | JWT | JSON Web Token |
| 8 | PWA | Progressive Web Application |
| 9 | STT | Speech-to-Text |
| 10 | TTS | Text-to-Speech |
| 11 | DB | Database |
| 12 | CRUD | Create, Read, Update, Delete |
| 13 | UI | User Interface |
| 14 | UX | User Experience |
| 15 | ODM | Object Document Mapping |

---

## LIST OF FIGURES

| Figure No. | Title |
|---|---|
| 1.1 | High-level FarmConnect platform concept |
| 4.1 | Overall system architecture (frontend-backend-external services) |
| 4.2 | Crop disease detection workflow |
| 4.3 | Machinery booking workflow |
| 4.4 | Hybrid AI inference flow |
| 5.1 | Confidence-to-severity mapping |
| 6.1 | Homepage module screenshot |
| 6.2 | Disease detection module screenshot |
| 6.3 | Machinery marketplace screenshot |
| 6.4 | Weather dashboard screenshot |
| 6.5 | Government schemes portal screenshot |

---

## LIST OF TABLES

| Table No. | Title |
|---|---|
| 2.1 | Literature techniques and relevance mapping |
| 3.1 | Problem statement and impact map |
| 4.1 | Technology stack |
| 4.2 | Backend API modules |
| 4.3 | Database collections |
| 5.1 | Mathematical models used in system |
| 5.2 | Software and hardware specifications |
| 6.1 | Functional verification matrix |
| 6.2 | Commit milestone timeline |
| 6.3 | Risk and limitation summary |

---

## LIST OF PUBLICATIONS

| Sr. No. | Authors | Paper Title | Publication | Status |
|---|---|---|---|---|
| 1 | Project Team | FarmConnect: Unified AI-assisted Digital Agriculture Platform | To be finalized by department format | Under preparation |

---

# CHAPTER 1: INTRODUCTION

## 1.1 Information about Project

FarmConnect is a full-stack digital agriculture platform designed to consolidate multiple farmer-facing services into a single workflow-driven application. The project addresses a practical problem observed in rural technology adoption: most available services are isolated tools rather than a connected operational system.

The implemented system includes these major modules:

1. AI crop disease detection from image input.
2. Weather forecasting with farming-relevant alerts.
3. Machinery marketplace with listing, booking, and owner approval flows.
4. Farmer-owner messaging linked to transactions.
5. Government scheme browsing with category and state filters.
6. Voice-enabled AI assistant in multiple languages.
7. User authentication and profile-driven personalization.

From source audit, the codebase is split into `frontend/` and `backend/` layers with 15 page components, 8 backend route modules, and a supporting ML training directory (`ml/`). The backend exposes REST endpoints for users, machinery, bookings, messages, weather, diseases, schemes, and AI proxy operations.

This project is not a prototype slideware system. It includes deployable infrastructure (`Dockerfile`, `docker-compose.yml`, `vercel.json`), production build scripts, and integrated route logic for end-to-end user flows.

## 1.2 Information about Industry

Indian agriculture has high structural importance and high operational friction simultaneously.

- Economic Survey 2025-26 reports that agriculture and allied activities contribute nearly one-fifth of national income and account for 46.1% of the workforce [R1].
- Telecom and internet penetration has improved access potential: TRAI Yearly Indicators 2024-25 reports 969.10 million internet subscribers as of 31 March 2025, including 407.69 million rural internet subscribers [R2].
- FAO highlights global plant health losses as a severe concern: up to 40% of global food crops are lost annually due to plant pests and diseases [R3].

This context creates a strong need for practical, low-friction digital systems that convert available connectivity into actionable farm decisions.

Digital agriculture products usually fail at one or more of the following:

1. They optimize one use case (for example weather) but ignore adjacent farmer workflows.
2. They assume high literacy and high app familiarity.
3. They do not provide integrated transaction pathways.
4. They are not resilient to low-resource environments.

FarmConnect is positioned as an integrated service platform to reduce this fragmentation.

## 1.3 Need of Project

The need for FarmConnect is driven by measurable and operational gaps:

1. **Disease response delay:** Visual diagnosis is often delayed or inaccessible.
2. **Decision fragmentation:** Weather, advisory, and market actions are disconnected.
3. **Mechanization barrier:** Small farmers cannot always purchase machinery outright.
4. **Information overload:** Scheme data exists but is hard to filter and trust.
5. **Usability barrier:** Voice and local-language support are essential in real usage.

Project necessity is therefore both technical and socio-economic:

- Technically, it validates a modular architecture combining AI inference, transactional modules, and real-time external data.
- Socially, it improves accessibility and reduces coordination costs for farmers.

---

# CHAPTER 2: LITERATURE REVIEW

## 2.1 Different Techniques

### 2.1.1 Vision-based crop disease detection

Two practical approaches dominate current systems:

1. Cloud multimodal APIs (vision LLMs and hosted models).
2. On-device or browser ML models.

The PlantVillage benchmark remains a foundational dataset for disease-classification pipelines. TensorFlow Datasets catalogs PlantVillage with 54,303 images and 38 classes [R4], and the original repository paper introduced an open-access plant health image resource to enable mobile diagnostics [R5].

MobileNetV2 is widely used for low-latency classification in constrained environments due to inverted residual and linear bottleneck design [R6].

### 2.1.2 Advisory interfaces and multimodal assistants

Advisory systems increasingly blend text and speech input. Browser speech APIs are practical but have compatibility and offline limitations; MDN explicitly notes SpeechRecognition is not baseline across all major browsers and may use server-based engines in some implementations [R7].

### 2.1.3 Real-time weather integration

Weather services are typically API-driven. WeatherAPI documents forecast endpoints (`/forecast.json`) with query parameters such as `q`, `days`, and optional `alerts`, `aqi` [R8]. Agriculture products map these values into irrigation and risk advisories.

### 2.1.4 Rural platform architecture patterns

Common architecture in production-grade agriculture products:

1. Client app for user interaction.
2. Middleware/API server for integration and auth.
3. Database for user and transaction persistence.
4. External data and AI services.

FarmConnect follows this pattern with React frontend, Express backend, MongoDB persistence, and AI/weather integrations.

## 2.2 Our Findings

From comparative analysis and codebase study, these findings are central:

1. A single AI provider is operationally risky (key limits, latency spikes, provider outages).
2. Pure cloud inference increases dependency and cost.
3. Pure local inference may degrade difficult-case accuracy.
4. Hybrid switching with fallback is a practical architecture.

FarmConnect implements configurable providers (`gemini`, `groq`, `custom`, `hybrid`) in centralized frontend AI routing, allowing dynamic selection by user settings and runtime fallback.

## 2.3 Motivation

The project is motivated by a gap between academic demos and field-ready integrated tools.

Most student projects stop at one module. FarmConnect intentionally links diagnosis -> advisory -> operational action -> transactional communication.

Motivation also includes engineering maturity:

1. Build deployable full-stack architecture.
2. Keep modules independently maintainable.
3. Use measurable milestones from commit history.
4. Align system behavior with secure-by-default production practices.

---

# CHAPTER 3: IDENTIFICATION OF PROBLEM

## 3.1 Problem Analysis

The core problem can be stated as:

> Farmers need a unified, low-friction, trustworthy digital platform that converts image, location, and transaction inputs into immediate, actionable farm operations.

### 3.1.1 Existing system limitations

| Area | Existing Gap | Impact |
|---|---|---|
| Disease diagnosis | Expert dependency, delay, fragmented tools | Crop loss risk increases with late treatment |
| Weather advisories | Generic data without action context | Poor irrigation/spraying decisions |
| Machinery access | No local sharing market workflow | High capex burden for small farmers |
| Communication | No integrated booking-linked chat | Coordination failures and cancellations |
| Scheme awareness | Dispersed information, low discoverability | Under-utilization of support schemes |
| Accessibility | Text-heavy UX, limited voice support | Lower adoption among low-literacy users |

### 3.1.2 Constraints identified in implementation

1. Intermittent connectivity and device limitations.
2. Need for multilingual and voice-friendly interaction.
3. AI API key and latency management.
4. Security risks in client-side storage models.

## 3.2 Objectives

### 3.2.1 Primary objectives

1. Build a unified agriculture service platform for disease, weather, machinery, and schemes.
2. Implement configurable AI diagnosis with hybrid fallback logic.
3. Provide transactional machinery booking with owner-side workflow.
4. Support voice-assisted interactions in multiple Indian languages.

### 3.2.2 Technical objectives

1. Design modular frontend-backend architecture.
2. Use MongoDB collections for scalable data partitioning.
3. Expose well-structured REST APIs.
4. Enable cloud deployment and containerized local setup.

### 3.2.3 Quality objectives

1. Maintain functional reliability across core routes.
2. Keep UI responsive on mobile-first usage.
3. Enforce basic security controls and identify hardening gaps.

---

# CHAPTER 4: METHODOLOGY

## 4.1 Working Principle

FarmConnect follows a service-oriented request-response model with specialized domain modules.

### 4.1.1 Architecture overview

1. **Presentation Layer:** React + TypeScript pages and components.
2. **Application Layer:** Express route handlers for each domain.
3. **Data Layer:** MongoDB collections for persistence.
4. **Intelligence Layer:** AI providers (Groq, Gemini, custom TFJS model).
5. **External Data Layer:** WeatherAPI service integration.

### 4.1.2 End-to-end example: disease detection

1. User uploads crop image in disease page.
2. Frontend reads image as Base64.
3. AI router reads model configuration from local settings.
4. Based on provider:
   - `custom`: run browser TensorFlow.js inference.
   - `groq`/`gemini`: call backend AI proxy endpoints.
   - `hybrid`: run custom prediction first, validate with Groq.
5. Response normalized into common diagnosis schema.
6. Result shown with confidence, severity, treatment, prevention.

## 4.2 Processes

### 4.2.1 Development process

The implementation was iterative with feature increments and refactoring milestones visible in git history (46 commits from 2025-09-14 to 2026-02-10).

Major engineering phases:

1. Initial stack setup and deployment.
2. Disease detection and weather features.
3. AI provider integration (Groq/Gemini).
4. Rental and booking systems.
5. Messaging integration.
6. Frontend/backend project restructuring.
7. Custom ML model integration and proxy hardening.

### 4.2.2 Runtime process flows

#### A. User authentication flow

1. Register/login request to `/api/auth/*`.
2. Password hash verification.
3. JWT issue with 7-day expiry.
4. Token used in protected requests.

#### B. Machinery booking flow

1. User browses machinery listings with filters.
2. Chooses date range and submits booking.
3. Server computes price, checks overlap, stores booking.
4. Owner views request and updates status.
5. Messaging module enables renter-owner coordination.

#### C. Weather advisory flow

1. Frontend sends location query.
2. Backend calls WeatherAPI `/forecast.json` endpoint.
3. Parsed forecast shown to user.
4. AI advisory layer generates context-specific recommendations.

## 4.3 Components and Constructional Details

## 4.3.1 Technology stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, Tailwind, shadcn/radix, React Router |
| Backend | Node.js, Express |
| Database | MongoDB Atlas / MongoDB server |
| AI | Groq API, Google Gemini API, TensorFlow.js custom model |
| Weather | WeatherAPI |
| Deployment | Vercel rewrite + hosted backend, Docker support |

## 4.3.2 Backend API modules

| Route Module | Base Path | Purpose |
|---|---|---|
| users.js | `/api/auth`, `/api/users` | Register, login, profile, token-auth |
| machinery.js | `/api/machinery` | Marketplace CRUD + availability |
| bookings.js | `/api/bookings` | Booking create, owner/user views, status, payment metadata |
| messages.js | `/api/messages` | Conversation and message management |
| weather.js | `/api/weather` | Forecast proxy with optional alerts/aqi |
| diseases.js | `/api/diseases` | Detection history persistence |
| schemes.js | `/api/schemes` | Schemes retrieval and filters |
| ai.js | `/api/ai` | Groq/Gemini proxy endpoints |

## 4.3.3 Data model collections

| Collection | Main Data |
|---|---|
| users | account and profile data |
| machinery | machine listing, pricing, availability, owner metadata |
| bookings | rental booking lifecycle |
| messages | message records |
| conversations | conversation metadata + unread counters |
| schemes | government scheme content |
| diseases | detection logs and recommendations |

## 4.3.4 AI component construction

### A. Cloud models

- Gemini image understanding documentation supports image input via inline data or file uploads [R9].
- Groq vision documentation supports `meta-llama/llama-4-scout-17b-16e-instruct` with specific size and resolution limits [R10].

### B. Custom model

- Based on MobileNetV2 transfer learning architecture.
- Training pipeline in Python under `ml/`.
- Export to TensorFlow.js model artifacts for browser inference.

### C. Hybrid mode

- Stage 1: local model predicts quickly.
- Stage 2: Groq validates/corrects prediction.
- Final response combines validated fields.

## 4.3.5 Security posture and controls

Implemented controls:

1. Password hashing via bcrypt.
2. JWT authentication middleware.
3. Backend AI proxy to reduce direct key exposure in client code.
4. Security headers in deployment config.

Hardening gaps observed:

1. Open CORS policy requires tightening for production.
2. Sensitive fallback DB URI in code should be removed.
3. Local storage usage for sensitive tokens/keys raises XSS risk.

These align with Express production security recommendations [R11] and OWASP HTML5 guidance that sensitive items and session identifiers should not be stored in local storage [R12].

---

# CHAPTER 5: CALCULATION AND SPECIFICATION

## 5.1 Calculations / Mathematical Modelling

### 5.1.1 Classification confidence model

For class logits `z_i`, probability of class `i` is:

`P(i) = exp(z_i) / sum(exp(z_j))`

Confidence shown in UI:

`Confidence(%) = round(max(P(i)) * 100)`

### 5.1.2 Severity mapping model

For non-healthy predictions:

- High severity if confidence >= 90
- Medium severity if 70 <= confidence < 90
- Low severity if confidence < 70

For healthy predictions, severity forced to Low.

### 5.1.3 Booking duration and pricing model

Given start date `S` and end date `E`:

`TotalDays = ceil(|E - S| / 86400000)` (minimum 1)

`BaseAmount = PricePerDay * TotalDays`

`FinalAmount = BaseAmount + DeliveryCharge + SecurityDeposit - Discount`

### 5.1.4 Date overlap availability logic

Requested interval `[S1, E1]` overlaps existing `[S2, E2]` if:

`(S1 <= E2) AND (E1 >= S2)`

Booking is allowed only when no overlap is found.

### 5.1.5 System throughput-oriented design rationale

The platform separates read-heavy and write-heavy paths:

1. Marketplace and schemes endpoints optimized for list reads and filtering.
2. Booking and messages optimized for transactional consistency and append/update operations.
3. AI inference separated into local and remote options to balance latency-cost-availability trade-offs.

## 5.2 Specifications / Ratings

### 5.2.1 Software specifications

| Item | Specification |
|---|---|
| Node runtime | Node.js 18+ |
| Frontend stack | React 18 + TypeScript + Vite |
| Backend | Express 4.x |
| Database driver | MongoDB Node driver 6.x |
| AI SDKs | OpenAI-compatible Groq + Google GenAI |
| Browser ML | TensorFlow.js 4.x |

### 5.2.2 Hardware specifications (development and testing)

| Environment | Minimum |
|---|---|
| Developer machine | Intel i5/Ryzen 5, 8 GB RAM, SSD |
| Recommended | Intel i7/Ryzen 7, 16 GB RAM |
| Farmer device target | Android smartphone with camera and mobile internet |

### 5.2.3 External API operational limits

From official documentation:

1. WeatherAPI supports forecast endpoint and `days` range 1-14 [R8].
2. Gemini inline image request guidance indicates total request size below 20 MB for inline method [R9].
3. Groq vision docs list model and image limits (URL image up to 20 MB, Base64 request limit 4 MB, max 5 images per request) [R10].

### 5.2.4 Project statistics (from repository audit)

| Metric | Value |
|---|---|
| Total commits | 46 |
| Commit range | 2025-09-14 to 2026-02-10 |
| Net LOC change | +49,015 |
| Most changed file groups | user profile, AI libs, docs, app routing |
| Frontend pages | 15 |
| Backend route modules | 8 |

---

# CHAPTER 6: RESULTS AND DISCUSSION

## 6.1 Simulation / Hardware Setup

### 6.1.1 Local setup used for validation

1. Frontend via Vite dev server.
2. Backend via Node server on configured API port.
3. MongoDB via Atlas or dockerized Mongo service.
4. AI integration tested through proxy routes.

### 6.1.2 Deployment setup

1. Frontend build output from `frontend/dist`.
2. Vercel rewrite forwards `/api/*` to hosted backend.
3. Docker compose supports local all-in-one orchestration.

## 6.2 Experimental Results

### 6.2.1 Functional verification matrix

| Module | Status | Observation |
|---|---|---|
| Authentication | Working | Register/login/JWT flow implemented |
| Disease detection | Working | Supports custom, Groq, Gemini, hybrid providers |
| Weather dashboard | Working | Forecast endpoint and advisory integration |
| Machinery marketplace | Working | Listing, create/edit/delete, filters, availability |
| Booking workflow | Working | Create, owner view, status updates, cancellation |
| Messaging | Working | Conversation and unread count flow implemented |
| Schemes portal | Working | Category/state/search filters |
| Build pipeline | Working | Production build generated successfully |

### 6.2.2 ML subsystem results

Training documentation in project reports indicates:

- Approx. 95% validation accuracy for the trained classification model.
- Browser inference target below 500 ms under favorable conditions.

Note: these values are reported by project ML documentation and scripts; independent benchmark rerun was not performed in this report session.

### 6.2.3 Commit-driven result progression

| Phase | Outcome |
|---|---|
| Initial setup | Base app and deployment established |
| AI integration | Groq/Gemini provider support added |
| Marketplace and booking | Machinery rental workflow operational |
| Messaging | User-to-user coordination channel integrated |
| Restructure | Clean frontend/backend separation |
| ML integration | Custom TFJS model and hybrid mode added |
| Security proxying | AI requests moved through backend routes |

## 6.3 Discussion

### 6.3.1 Strengths

1. Unified module composition for real workflows.
2. Configurable AI provider strategy with fallback options.
3. Practical transaction support (bookings + messaging).
4. Deployment readiness and modular route architecture.

### 6.3.2 Limitations observed

1. Health endpoint logging references include outdated ping mention.
2. Sensitive default DB URI fallback must be removed for production compliance.
3. Client-side storage of sensitive values requires redesign.
4. Some documentation artifacts are legacy and not fully synchronized with latest route behavior.

### 6.3.3 Impact potential

Given sector scale [R1], rural internet growth [R2], and disease-loss pressure [R3], FarmConnect has practical potential as an integrated digital farmer workflow platform, provided security hardening and production governance are completed.

---

# CHAPTER 7: CONCLUSION AND FUTURE SCOPE

## 7.1 Conclusion

FarmConnect demonstrates that a final-year CSE major project can move beyond isolated feature demos and deliver a cohesive full-stack agricultural platform. The system integrates disease diagnosis, advisory, weather intelligence, transaction workflows, and communication in one architecture.

From a software engineering perspective, the project validates:

1. Modular route-driven backend design.
2. Configurable AI inference with hybrid fallback.
3. Real data persistence and transaction lifecycle handling.
4. Continuous project evolution through structured commits.

From an application perspective, the project addresses real farmer pain points around fragmented services and delayed decisions.

## 7.2 Future Scope

1. Replace local-storage token model with secure httpOnly session architecture.
2. Add role-based authorization and endpoint-level policy checks.
3. Introduce observability stack (structured logs, metrics, traces).
4. Add automated test suites (unit + integration + API contract tests).
5. Integrate geospatial proximity search for machinery.
6. Add offline-first sync queue for low-connectivity usage.
7. Incorporate multilingual NLP fine-tuning for regional advisory quality.
8. Expand scheme data pipeline with periodic official-source synchronization.
9. Add payment gateway verification and settlement reconciliation.
10. Conduct formal field validation with farmer groups and usability scoring.

---

# REFERENCES

[R1] Government of India, "Economic Survey 2025-26, Chapter 6: Agriculture and Food Management," https://www.indiabudget.gov.in/economicsurvey/doc/eschapter/echap06.pdf

[R2] Telecom Regulatory Authority of India, "The Indian Telecom Services Yearly Performance Indicators 2024-2025," https://www.trai.gov.in/sites/default/files/2025-07/YIR_08072025_0.pdf

[R3] Food and Agriculture Organization (FAO), "The hidden health crisis: How plant diseases threaten global food security," https://www.fao.org/one-health/highlights/how-plant-diseases-threaten-global-food-security

[R4] TensorFlow Datasets, "plant_village dataset catalog," https://www.tensorflow.org/datasets/catalog/plant_village

[R5] D. P. Hughes and M. Salathe, "An open access repository of images on plant health to enable the development of mobile disease diagnostics," arXiv:1511.08060, https://arxiv.org/abs/1511.08060

[R6] M. Sandler et al., "MobileNetV2: Inverted Residuals and Linear Bottlenecks," arXiv:1801.04381, https://arxiv.org/abs/1801.04381

[R7] MDN Web Docs, "SpeechRecognition - Web Speech API," https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition

[R8] WeatherAPI Documentation, "Weather and Geolocation API JSON/XML docs," https://www.weatherapi.com/docs/

[R9] Google AI for Developers, "Gemini API Image understanding," https://ai.google.dev/gemini-api/docs/image-understanding

[R10] Groq Docs, "Images and Vision," https://console.groq.com/docs/vision

[R11] Express.js Documentation, "Production Best Practices: Security," https://expressjs.com/en/advanced/best-practice-security

[R12] OWASP Cheat Sheet Series, "HTML5 Security Cheat Sheet," https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html

[R13] Project Repository Source Audit Artifacts, FarmConnect workspace, April 2026:
- `project_audit/system_understanding_report.md`
- `project_audit/commit_analysis.md`
- `project_audit/findings.md`

---

# WEBSITES VISITED

1. https://www.indiabudget.gov.in/
2. https://www.trai.gov.in/
3. https://www.fao.org/
4. https://www.tensorflow.org/
5. https://arxiv.org/
6. https://ai.google.dev/
7. https://console.groq.com/docs/
8. https://www.weatherapi.com/docs/
9. https://developer.mozilla.org/
10. https://expressjs.com/
11. https://cheatsheetseries.owasp.org/

---

# APPENDIX

## Appendix A: Major API Endpoints (Implemented)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/auth/register` | POST | User registration |
| `/api/auth/login` | POST | User login |
| `/api/auth/me` | GET | Current user profile |
| `/api/machinery` | GET/POST | List/create machinery |
| `/api/machinery/:id` | GET/PUT/DELETE | Detail/update/delete machinery |
| `/api/bookings` | POST | Create booking |
| `/api/bookings/user/:userId` | GET | User booking history |
| `/api/bookings/owner/:ownerId` | GET | Owner booking requests |
| `/api/bookings/:id/status` | PUT | Update booking status |
| `/api/messages` | POST | Send message |
| `/api/messages/conversation/:userId/:otherUserId` | GET | Conversation messages |
| `/api/weather/forecast` | GET | Weather forecast proxy |
| `/api/diseases` | POST | Save disease detection |
| `/api/schemes` | GET | List schemes |
| `/api/ai/analyze-crop` | POST | Groq crop analysis proxy |
| `/api/ai/farming-advice` | POST | Groq text advisory proxy |
| `/api/ai/gemini/analyze-crop` | POST | Gemini crop analysis proxy |
| `/api/ai/gemini/farming-advice` | POST | Gemini advisory proxy |

## Appendix B: Key Collections

1. `users`
2. `machinery`
3. `bookings`
4. `messages`
5. `conversations`
6. `schemes`
7. `diseases`

## Appendix C: Commit Milestones (Selected)

| Date | Commit | Milestone |
|---|---|---|
| 2025-11-25 | 4576a7b | Groq API integration foundation |
| 2025-11-27 | 1eebbc3 | Voice assistant implementation |
| 2025-11-29 | 9d9877a | Rental system introduction |
| 2026-01-03 | 1d46d70 | Messaging functionality |
| 2026-01-12 | 274403e | Frontend/backend restructuring |
| 2026-01-14 | 0e3e86a | Custom model integration |
| 2026-01-15 | 5af3b10 | Secure AI proxy and hybrid engine |
| 2026-01-22 | 6e4ac3c | SEO and deployment refinements |

## Appendix D: Risk Register

| Risk | Category | Current Status | Mitigation |
|---|---|---|---|
| API key exposure | Security | Medium | Server-side secrets and key vault policy |
| Local storage token theft via XSS | Security | Medium | Migrate to httpOnly cookies + CSP |
| External API outages | Reliability | Medium | Retry strategy + graceful fallback |
| Documentation drift | Process | Medium | Versioned docs linked to releases |
| Model drift / false diagnosis | AI | Medium | Feedback loop + retraining schedule |

---

# ANNEXURE-A

Scanned copies (colour print) of conference/journal paper and certificates.

# ANNEXURE-B

Scanned copies (colour print) of copyright/patent certificates.

# ANNEXURE-C

Scanned copies (colour print) of participation certificates and project competition photographs.

# ANNEXURE-D

Group photograph with guide and project model.

# ANNEXURE-E

Student resumes (latest format as per institute).

---

## Note for Final Submission Formatting

1. Copy this content to institute Word template.
2. Apply page numbering and Roman numbering for preliminary pages.
3. Insert actual screenshots for figures listed in Chapter 6.
4. Replace signature placeholders and dates before printing.
5. Update publication status and annexures with final scanned proofs.
