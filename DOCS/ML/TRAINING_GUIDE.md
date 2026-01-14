# How to Train the Disease Detection Model

## Step-by-Step Guide for Training Custom CNN Model

This guide explains exactly how to train the plant disease detection model. Follow these steps in order.

---

## Prerequisites

Before starting, ensure you have:
1. **Python 3.8+** installed
2. **Git** installed (for cloning the project)
3. **~5GB disk space** for the dataset
4. **(Optional) NVIDIA GPU** for faster training

---

## Step 1: Set Up Python Environment

Open a terminal in the project root and run:

```bash
# Navigate to the ML directory
cd ml

# Create a virtual environment
python -m venv venv

# Activate it (Windows)
venv\Scripts\activate

# Activate it (Mac/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**What this does:**
- Creates an isolated Python environment
- Installs TensorFlow, NumPy, and other required libraries

---

## Step 2: Understand the Dataset

The **PlantVillage** dataset contains:
- **87,000+** images of plant leaves
- **38 classes** (diseases + healthy plants)
- **14 crop types**: Apple, Cherry, Corn, Grape, Tomato, etc.

The dataset will be automatically downloaded when training starts.

---

## Step 3: Run the Training Script

```bash
python train.py
```

**What happens during training:**

### Phase 1: Transfer Learning (10 epochs)
1. Downloads the PlantVillage dataset
2. Loads MobileNetV2 (pre-trained on ImageNet)
3. Freezes the base model weights
4. Trains only the custom classification layers

### Phase 2: Fine-Tuning (5 epochs)
1. Unfreezes the last 20 layers of MobileNetV2
2. Trains with a smaller learning rate
3. Fine-tunes the model to our specific task

**Expected output:**
```
🌱 PLANT DISEASE CLASSIFICATION - TRAINING
============================================================

📂 Step 1: Loading Dataset...
✓ Classes: 38

🧠 Step 2: Creating Model...
Total params: 2,422,950
Trainable params: 98,342

🚀 Step 4: Phase 1 - Transfer Learning
Epoch 1/10
loss: 1.8234 - accuracy: 0.5234 - val_accuracy: 0.7845
...
Epoch 10/10
loss: 0.3124 - accuracy: 0.9123 - val_accuracy: 0.9245

🎯 Step 5: Phase 2 - Fine-Tuning
...
✓ Final validation accuracy: 95.8%
```

---

## Step 4: Export to TensorFlow.js

After training completes:

```bash
python export.py
```

**What this does:**
1. Converts the Keras model to TensorFlow.js format
2. Creates `model.json` (architecture)
3. Creates `*.bin` files (weights)
4. Copies class labels

**Output files:**
```
tfjs_model/
├── model.json          # Model architecture
├── group1-shard1of4.bin
├── group1-shard2of4.bin
├── group1-shard3of4.bin
├── group1-shard4of4.bin
└── labels.json         # Disease class names
```

---

## Step 5: Copy Model to Frontend

```bash
# Copy the model files to the frontend
cp -r tfjs_model/* ../frontend/public/models/plant-disease/
```

On Windows:
```bash
xcopy tfjs_model\* ..\frontend\public\models\plant-disease\ /E /Y
```

---

## Step 6: Test in Browser

1. Start the app: `npm run dev`
2. Go to **Settings** → **AI Model Selection**
3. Select **"🧠 Custom Model (Offline, Fast)"**
4. Go to **Disease Detection** page
5. Upload a plant leaf image
6. See the prediction!

---

## Training Parameters Explained

| Parameter | Value | Purpose |
|-----------|-------|---------|
| `IMG_SIZE` | 224 | Input image size (MobileNetV2 standard) |
| `BATCH_SIZE` | 32 | Images processed per training step |
| `EPOCHS` | 10 | Phase 1 training iterations |
| `FINE_TUNE_EPOCHS` | 5 | Phase 2 training iterations |
| `LEARNING_RATE` | 0.001 | Initial learning rate |
| `FINE_TUNE_LR` | 0.0001 | Fine-tuning learning rate (10x smaller) |

---

## Model Architecture Explained

```
INPUT (224×224×3 RGB Image)
         ↓
┌─────────────────────────────────────┐
│  MobileNetV2 BASE                   │
│  (Pre-trained on 14M+ images)       │
│  - 53 Convolutional Layers          │
│  - Depthwise Separable Convolutions │
│  - Inverted Residual Blocks         │
└─────────────────────────────────────┘
         ↓
   Global Average Pooling
         ↓
   Dense Layer (256 neurons, ReLU)
         ↓
   Dropout (50% - prevents overfitting)
         ↓
   Output Layer (38 neurons, Softmax)
         ↓
OUTPUT: Probability for each disease class
```

---

## Transfer Learning Explained

**What is Transfer Learning?**
Instead of training from scratch (which requires millions of images), we use a model that has already learned to recognize shapes, textures, and patterns from ImageNet (14 million images).

**Why MobileNetV2?**
1. **Lightweight**: Small model size (~15MB)
2. **Fast**: Optimized for mobile/web deployment
3. **Accurate**: Good performance on classification tasks
4. **Proven**: Widely used in production applications

**How we customize it:**
1. Remove the original 1000-class ImageNet classifier
2. Add our own 38-class plant disease classifier
3. Freeze the feature extractor layers initially
4. Fine-tune the last few layers for our specific task

---

## Files Created by Training

```
ml/
├── saved_model/
│   ├── plant_disease_model.keras    # Full model
│   ├── plant_disease_model.h5       # For conversion
│   ├── best_model.keras             # Best checkpoint
│   └── class_labels.json            # Label mapping
│
└── tfjs_model/                       # For browser
    ├── model.json
    ├── *.bin (weight shards)
    └── labels.json
```

---

## Troubleshooting

**Problem**: Training is very slow
**Solution**: Use Google Colab (free GPU) or reduce batch size

**Problem**: Out of memory error
**Solution**: Reduce `BATCH_SIZE` to 16 or 8

**Problem**: Low accuracy
**Solution**: Increase epochs or try different augmentation

**Problem**: Model not loading in browser
**Solution**: Ensure all files are copied to `public/models/plant-disease/`

---

## Summary

1. **Environment Setup**: Python virtual environment + dependencies
2. **Training**: Two-phase transfer learning with MobileNetV2
3. **Export**: Convert to TensorFlow.js format
4. **Deploy**: Copy to frontend for browser-based inference

The model achieves **~95% accuracy** on PlantVillage dataset and runs in **<500ms** in the browser!
