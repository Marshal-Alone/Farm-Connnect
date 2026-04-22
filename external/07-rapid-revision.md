# Rapid Revision Guide (Night Before Viva)

## A) 30-Second Project Pitch
Farm-Connect is a full-stack agriculture platform that combines user authentication, crop disease analysis, weather-based advisory, and machinery rental booking. The technical core is a hybrid AI approach where local disease prediction is combined with backend AI validation. The backend is modular, data is persisted in MongoDB, and booking includes conflict checks to avoid double scheduling.

## B) 2-Minute Structured Pitch
This project is designed as an integrated farm operations platform, not as a single-feature demo. The frontend is built with React and the backend with Express and MongoDB. Authentication uses bcrypt password hashing and JWT authorization for identity-aware actions.  

For crop disease detection, the app supports custom model inference in the browser and backend AI analysis, then normalizes results into clear fields such as disease, severity, confidence, treatment, and prevention.  

The weather module provides more than raw weather values by generating practical recommendations. The machinery module includes booking lifecycle control and date-overlap conflict handling, which makes the system operationally meaningful.  

The key innovation is orchestration: combining diagnosis, advisory, and planning in one farmer-focused workflow.

## C) 15 Must-Memorize Technical Statements
1. Authentication is implemented with bcrypt and JWT.
2. Passwords are hashed before storage.
3. Disease detection supports local model, cloud model, and hybrid mode.
4. The ML pipeline is script-driven and reproducible.
5. Transfer learning is used to reduce training complexity.
6. Data pipeline follows a labeled PlantVillage-style workflow.
7. Booking conflicts are handled using interval overlap checks.
8. Booking uses lifecycle statuses for traceable operations.
9. API design is modular by domain route files.
10. AI outputs are normalized into app-safe structured responses.
11. Non-plant handling reduces false forced diagnoses.
12. Weather feature is advisory-oriented, not only display-oriented.
13. Integration quality is the main novelty of the project.
14. Current implementation works functionally, with clear hardening roadmap.
15. End-to-end workflow engineering is the core contribution.

## D) Mock Viva Grilling: Tough Questions and Better Answers

### 1) What if local model and cloud model disagree?
“The system uses confidence-guided arbitration. If local confidence is very high and cloud confidence is weak, local output can be retained. If cloud validation is more reliable for that case, the validated output is preferred. This reduces unstable results.”

### 2) What if your model fails on real farm photos?
“That is a known domain-shift issue in computer vision. To reduce this risk, I used hybrid validation and planned iterative retraining with real field images and feedback loops.”

### 3) Why should we trust your JWT setup?
“JWT is used as stateless identity verification. The token is signed server-side and validated on protected routes. This is suitable for modular API systems, and security can be further strengthened through secret management and broader route hardening.”

### 4) Can booking conflict logic fail under heavy parallel requests?
“Application-level overlap checks solve normal use cases. For high-concurrency environments, I would upgrade to atomic transaction-based conflict control to avoid race conditions.”

### 5) What is your innovation in exactly one line?
“I built a hybrid-AI, conflict-aware, integrated farm workflow platform that connects diagnosis, advisory, and operational planning in one system.”

### 6) Did you build only a prediction demo?
“No. I implemented end-to-end system behavior: auth, API layers, database persistence, disease pipeline, weather advisory integration, and machinery booking logic with conflict handling.”

## E) Last 10-Minute Checklist Before Viva
- Can you explain disease flow in 6 clear steps?
- Can you explain JWT flow from login to middleware verification?
- Can you explain booking overlap logic in one sentence?
- Can you answer “what is unique” without overclaiming?
- Can you state one limitation and one improvement for each module?

## F) Deep-Drill References (When teacher goes very deep)
- ML transfer learning deep drill: `08-ml-transfer-learning-masterclass.md`
- MongoDB architecture deep drill: `09-mongodb-end-to-end.md`
- Backend role drill: `10-rolewise-viva-backend.md`
- Frontend role drill: `11-rolewise-viva-frontend.md`
- Auth/security role drill: `12-rolewise-viva-auth-security.md`
- Database role drill: `13-rolewise-viva-database.md`
- ML/AI role drill: `14-rolewise-viva-ml-ai.md`
