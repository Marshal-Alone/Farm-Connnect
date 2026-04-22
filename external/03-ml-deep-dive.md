# ML Deep Dive (Teacher-Satisfying Version)

## 1) What we built in ML, in one clear statement
We built a custom plant disease image classification pipeline using transfer learning, deployed it to the browser with TensorFlow.js, and integrated it with backend AI validation for a hybrid diagnosis flow.

## 2) Where this is implemented in code
- Training orchestration: `ml/train.py`
- Model architecture and fine-tuning controls: `ml/model.py`
- Dataset loading and class-weighting: `ml/dataset.py`
- Browser model inference: `frontend/src/lib/customModel.ts`
- Hybrid provider logic: `frontend/src/lib/ai.ts`
- Cloud validation endpoints: `backend/api/ai.js`

## 3) Transfer learning explained like a beginner
Imagine teaching a new student who already knows how to identify basic shapes, textures, and edges from millions of images.  
Instead of teaching from zero, we reuse that prior visual knowledge and only teach crop disease-specific classes.

That is exactly transfer learning:
- Use pretrained backbone (`MobileNetV2` or `EfficientNetB0`)
- Replace old top layer with our disease classifier head
- Train in controlled phases

## 4) Freeze and unfreeze: what it means practically
- **Freeze**: keep backbone weights unchanged, train only new classification head
- **Unfreeze**: allow selected deeper backbone layers to adapt to crop disease patterns

In this project:
- Phase 1 in `train.py`: backbone frozen, head training
- Phase 2 in `train.py`: last N layers unfreezed (`unfreeze_for_fine_tuning`) with lower learning rate

Why lower learning rate in phase 2:
- to preserve useful pretrained features
- to avoid destroying learned general vision patterns

## 5) Two-phase training flow from project code
1. Load dataset (`load_plant_village_dataset`)
2. Build model (`create_model`)
3. Train head (phase 1)
4. Unfreeze selected backbone depth (`get_default_unfreeze_layers`)
5. Fine-tune (phase 2)
6. Save `best_model.keras`, final `.keras`, `.h5`, and class label JSON

Callbacks used:
- ModelCheckpoint
- EarlyStopping
- ReduceLROnPlateau
- CSVLogger
- TensorBoard

This shows training discipline, not one-shot training.

## 6) Dataset explanation for viva
`dataset.py` supports:
- TensorFlow Datasets `plant_village` auto-download mode
- Local folder mode with validation split

It also:
- resizes images to 224x224
- creates one-hot labels
- computes class weights for imbalance
- uses prefetch for pipeline performance

## 7) Inference in the actual app
From `frontend/src/lib/customModel.ts`:
- model loaded from `/models/plant-disease/model.json`
- labels loaded from `/models/plant-disease/labels.json`
- image resized/padded to preserve aspect ratio
- graph model inference executed in browser
- top predictions ranked and confidence scores computed

The app can run local inference without sending image to server.

## 8) Hybrid mode (why this matters)
From `frontend/src/lib/ai.ts`, hybrid flow:
1. Run local custom model first
2. Send image + local hint to backend Groq route (`/api/ai/analyze-crop`)
3. Compare disease agreement and confidence
4. If local is highly confident and cloud is uncertain, keep local
5. Else use validated cloud result

This is an engineering reliability layer, not just API fallback.

## 9) Confidence score: what to say to teacher
Confidence means “how sure the model is about the selected class,” not “guaranteed correctness.”  
So we treat confidence as decision support and combine it with validation logic in hybrid mode.

## 10) Common tough viva questions with strong answers

### Q: Why transfer learning, not training from scratch?
Because training from scratch needs much larger data and compute. Transfer learning gives faster convergence and better baseline accuracy by reusing pretrained visual features.

### Q: Why two phases?
If we unfreeze everything from start, training can become unstable and overfit quickly. Two phases let us first learn disease-specific head, then carefully adapt deeper features.

### Q: How do you reduce overfitting?
Data augmentation, dropout, class weighting, early stopping, LR reduction, and validation monitoring are used in the training pipeline.

### Q: How do you ensure model is usable in product?
We export to TensorFlow.js format and run browser inference through `customModel.ts`, not just notebook-only evaluation.

### Q: What if model and cloud result disagree?
Hybrid arbitration logic checks agreement and confidence thresholds. The system can retain high-confidence local output if cloud confidence is low.

### Q: How does model detect non-plant images?
Backend cloud analysis includes non-plant checks and returns “Not a Plant” handling to avoid forced disease labeling.

## 11) Honest limitations to mention
- Field images can differ from dataset style (domain gap)
- Lighting and blur can reduce reliability
- Class confusion can occur among visually similar diseases

## 12) Improvement roadmap you can defend
- Collect local region field data
- Retrain with confusion-matrix guided hard class focus
- Add calibration and threshold tuning
- Add human feedback loop from corrected diagnoses

## 13) 45-second ready answer
“Our ML is not just API prompting. We implemented a transfer learning pipeline with two-phase training: frozen backbone head training, then controlled fine-tuning. We use a browser-deployed TensorFlow.js model for fast local inference and combine it with backend AI validation in hybrid mode. This improves reliability, especially when one source is uncertain. We also used augmentation, class weights, and callback-based training control to improve generalization.”
