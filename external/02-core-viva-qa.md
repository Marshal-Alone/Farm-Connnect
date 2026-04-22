# Core Viva Q&A (Detailed English Version)

## 1) How does your ML model work?
My disease detection module uses a hybrid approach. First, a local browser model (TensorFlow.js) predicts the crop disease from the uploaded image. Then, a backend AI route can validate or refine that result. This gives better reliability than depending on only one source. In short, local inference provides speed and fallback, while backend AI adds cross-checking and explanation quality.

## 2) How did you train the model?
The training workflow is in the `ml` folder, mainly `train.py`, `dataset.py`, and `model.py`. I used transfer learning, which means starting from a pretrained image model and adapting it to crop disease classes. The process has two phases:
- Phase 1: train only the top classification layers while keeping the backbone frozen
- Phase 2: unfreeze selected deeper layers and fine-tune with a lower learning rate

This approach is practical because it trains faster and usually gives better results than training from scratch on limited compute.

## 3) Where did your data come from?
The pipeline is based on a PlantVillage-style labeled crop disease dataset process. The dataset loader in `ml/dataset.py` handles label mapping and train/validation split. This gives a supervised learning setup where each image has a known disease class, which is necessary for classification training and evaluation.

## 4) How does the system know the uploaded image is a crop image and not random content?
The disease analysis path includes non-plant handling logic. If the image does not clearly represent a plant context, the system is designed not to force a disease diagnosis. This reduces the risk of giving a false recommendation from irrelevant images such as objects, buildings, or people.

## 5) Explain your disease detection flow end-to-end.
1. User uploads image in the frontend.
2. Image is converted to the required format.
3. Local model predicts probable disease and confidence.
4. Hybrid flow optionally calls backend AI for validation/refinement.
5. Output is normalized into structured fields: disease, severity, confidence, treatment, and prevention.
6. Result is shown to user and can be stored in disease history for future reference.

This is important because the app converts raw model output into actionable agricultural guidance.

## 6) How do you handle machinery rental conflicts?
In booking creation, the backend checks requested date range against already booked date ranges for that machine. The overlap condition is:
`requestStart <= existingEnd && requestEnd >= existingStart`

If overlap exists, booking is rejected. If no overlap exists, booking is created and the range is blocked. This prevents obvious double-booking.

## 7) What is your overall system flow?
User logs in, receives a token, and then accesses feature modules:
- disease diagnosis
- weather-aware recommendations
- machinery rental booking

The backend is split into route modules, and MongoDB stores feature-specific data collections. This creates a full-stack workflow, not just isolated screens.

## 8) Why did you use JWT instead of session authentication?
JWT is stateless, so backend services can verify identity per request without maintaining server-side session storage for each user. This simplifies API scaling and works cleanly for frontend clients that call REST endpoints directly.

## 9) What is JWT and how does it work in your project?
JWT (JSON Web Token) is a signed token containing user identity claims. After login/register, backend issues a token. Client sends it in the authorization header. Middleware verifies token signature and validity before allowing protected operations. If token is invalid or expired, access is denied.

## 10) What is unique in your project if others already do disease detection and weather?
The unique part is integrated workflow design. Instead of separate tools, this project combines:
- hybrid disease inference
- weather-to-action advisory
- machinery booking with conflict logic
- user identity flow across modules

The value is in orchestration and practical farmer usability, not in claiming a completely new ML algorithm.

## 11) If examiner says: “You are just calling APIs”
A strong response is:
“API calls are only one layer. The real engineering is in provider abstraction, confidence-based fusion, structured output normalization, persistence design, booking conflict control, and connecting all modules into one reliable farm workflow.”

## 12) What was your biggest technical challenge?
Two major challenges:
1. Converting uncertain AI outputs into deterministic app-friendly structured responses.
2. Handling booking overlap logic so machinery scheduling is practically usable.

Solving both required backend business rules, not only UI work.

## 13) Explain your backend contribution clearly.
I implemented and integrated domain-based API modules in Express, mounted under `/api/*`, and connected them to MongoDB operations. I handled practical flows such as auth, disease persistence, booking lifecycle, and communication APIs. The focus was making each feature usable as a complete request-response workflow, not only creating isolated endpoints.

## 14) Explain your frontend contribution clearly.
I built route-based feature pages and connected them to backend APIs with a consistent state flow. I used context-based auth persistence, AI provider abstraction, and user-readable result presentation. The main frontend contribution is translating technical outputs into farmer-friendly decisions.

## 15) Explain your database usage simply.
MongoDB is used as the central storage for users, machinery, bookings, disease records, crop logs, and chat. The backend uses a singleton connection helper so one shared DB connection is reused. APIs use find/insert/update/delete operations with pagination and indexed collections for better access speed.

## 16) How do you fetch and store data in MongoDB?
Store flow: request validation -> create document -> `insertOne` or `updateOne`.  
Fetch flow: filtered `find`/`findOne` -> sort/pagination -> JSON response.  
For booking and machinery, update operators like `$push`, `$pull`, and `$inc` are used to manage booked ranges and counters.

## 17) How do you explain roles in viva?
I explain roles in two layers:
1. Team role mapping as defined in project documentation
2. Technical role mapping by module ownership in code (backend/frontend/auth/database/ml-ai)

Then for each role I explain:
- mission
- key files
- implementation decisions
- likely examiner questions

## 18) Where is your strongest innovation argument?
Not “single feature novelty.”  
The strongest argument is system-level integration: hybrid disease intelligence + weather-linked advisory + conflict-aware machinery scheduling + modular backend and persistent history.

## 19) If examiner asks “what did you personally understand deeply?”
A strong answer is:
“I deeply understand the ML transfer learning pipeline, the hybrid inference decision flow, JWT auth lifecycle, MongoDB collection design, and booking conflict logic. I can explain both implementation and trade-offs.”

## 20) If examiner asks “what are current limitations?”
Current limitations include:
- partial hardening of auth coverage across all routes
- race-condition risk in booking writes under high concurrency
- domain shift risk for model on real field images

And I always follow this with a concrete improvement roadmap to show engineering maturity.
