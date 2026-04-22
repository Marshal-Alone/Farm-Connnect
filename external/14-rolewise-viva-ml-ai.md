# Rolewise Viva Guide: ML and AI Role

## Role Mission
Build and integrate disease detection intelligence, maintain model training/deployment workflow, and provide robust diagnosis through hybrid inference.

## Core Files
- `ml/train.py`: full training control
- `ml/model.py`: architecture and fine-tuning utilities
- `ml/dataset.py`: dataset loading, augmentation, class weighting
- `frontend/src/lib/customModel.ts`: browser inference engine
- `frontend/src/lib/ai.ts`: provider selection and hybrid arbitration
- `backend/api/ai.js`: Groq/Gemini proxy and diagnosis normalization

## ML/AI System Design Summary
This role combines two layers:
1. Custom image classifier running locally in browser
2. Cloud AI verification/advisory through backend

This is a hybrid intelligence design for practical reliability.

## What transfer learning means in this role
- Start from pretrained backbone
- Add task-specific disease classifier head
- Train in two phases (freeze then unfreeze)
- Export to frontend runtime

## ML/AI Viva Q&A (deep)

### Q1: What exactly is your custom model contribution?
A complete training and deployment pipeline: dataset handling, model training, fine-tuning strategy, export, and browser inference integration.

### Q2: Why hybrid mode?
Local model gives speed/fallback; cloud AI gives contextual validation and richer recommendations, especially for uncertain images.

### Q3: How do you resolve model disagreement?
Confidence-aware arbitration logic chooses result conservatively based on agreement and confidence thresholds.

### Q4: How do you structure AI outputs for frontend?
Backend normalizes outputs into stable fields: disease, confidence, severity, description, treatment, prevention, affected area.

### Q5: Why normalize responses?
Different providers return different formats. Normalization makes UI logic deterministic and maintainable.

### Q6: How is non-plant safety handled?
System supports non-plant detection path to avoid force-predicting disease on unrelated images.

### Q7: Why not use only one model provider?
Single-provider dependency increases fragility. Hybrid architecture improves resilience and supports fallback behavior.

### Q8: How do you reduce noisy output?
Low temperature prompts, strict output schema expectations, and post-parse normalization are used in backend AI route.

### Q9: How do you explain confidence to non-technical users?
Confidence is a helpful certainty signal, not absolute truth. It is used along with validation logic before final recommendation.

### Q10: What are model limits you acknowledge?
Domain shift, image quality sensitivity, and class similarity confusion.

### Q11: What is your most important ML engineering decision?
Two-phase transfer learning and product-level hybrid arbitration.

### Q12: What is next step to improve real-world performance?
Collect local field dataset, retrain iteratively, and calibrate confidence thresholds using validation diagnostics.

## Trap Questions + Recovery

### Trap: “You only called an AI API.”
Recovery: We built custom model training and browser deployment plus orchestration and arbitration logic. API is one layer, not the whole system.

### Trap: “If accuracy is high, can farmers fully trust it blindly?”
Recovery: No ML system should be blind-trusted. We position model output as decision support, with preventive recommendations and expert consultation when severe.

## 90-second ML/AI role answer
“In the ML/AI role, I worked on both model engineering and product integration. On the model side, we implemented transfer learning with a two-stage training strategy and exported artifacts for TensorFlow.js browser inference. On the product side, we built a hybrid AI pipeline where local model output can be validated by backend cloud AI routes. We normalize AI responses into deterministic fields for UI and add safeguards for uncertain or non-plant cases. This makes the AI component practical, explainable, and more robust than a single-provider setup.”
