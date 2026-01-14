# Custom Plant Disease Detection ML System

This document explains how we built a custom machine learning model for detecting plant diseases, replacing the external API-based approach (Groq/Gemini) with our own trained model.

## Table of Contents
1. [Overview](#overview)
2. [Why Custom ML Model?](#why-custom-ml-model)
3. [Technology Stack](#technology-stack)
4. [Model Architecture](#model-architecture)
5. [Training Process](#training-process)
6. [Browser Deployment](#browser-deployment)
7. [Integration with App](#integration-with-app)

---

## Overview

Our Farm-Connect application initially used external AI APIs (Groq and Gemini) for plant disease detection. While these worked well, they had limitations:
- Required internet connectivity
- Depended on external API availability
- Incurred API costs at scale
- No control over model improvements

We developed our own Convolutional Neural Network (CNN) trained on the PlantVillage dataset to run entirely in the browser.

---

## Why Custom ML Model?

| Aspect | API-Based (Groq/Gemini) | Custom ML Model |
|--------|------------------------|-----------------|
| Internet Required | Yes | No (offline capable) |
| Response Time | 2-5 seconds | <1 second |
| Cost | Per-request pricing | Free (one-time training) |
| Privacy | Images sent to cloud | All processing local |
| Customization | Limited | Full control |

---

## Technology Stack

### Training Phase (Python)
- **TensorFlow/Keras**: Deep learning framework for model training
- **MobileNetV2**: Pre-trained CNN architecture (transfer learning)
- **PlantVillage Dataset**: 87,000+ labeled plant disease images

### Deployment Phase (Browser)
- **TensorFlow.js**: JavaScript ML library for browser inference
- **React**: Frontend framework integration
- **TypeScript**: Type-safe model service implementation

---

## Model Architecture

We use **Transfer Learning** with MobileNetV2:

```
┌─────────────────────────────────────────────────────────────┐
│                    INPUT IMAGE (224x224x3)                   │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              MobileNetV2 BASE (Pre-trained on ImageNet)      │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  Convolutional Layers (Feature Extraction)          │   │
│   │  - Depthwise Separable Convolutions                  │   │
│   │  - Inverted Residual Blocks                          │   │
│   │  - 53 Convolutional Layers                           │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                  GLOBAL AVERAGE POOLING                      │
│                  (Reduces spatial dimensions)                │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    DENSE LAYER (256 units)                   │
│                    Activation: ReLU                          │
│                    Dropout: 0.5                              │
└─────────────────────────┬───────────────────────────────────┘
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                 OUTPUT LAYER (38 classes)                    │
│                 Activation: Softmax                          │
│                 (Disease classification)                     │
└─────────────────────────────────────────────────────────────┘
```

### Why MobileNetV2?

1. **Lightweight**: Designed for mobile/edge devices
2. **Fast Inference**: Uses depthwise separable convolutions
3. **Accurate**: Pretrained on 14M+ ImageNet images
4. **Browser-Friendly**: Small model size (~14MB)

---

## Training Process

### Step 1: Environment Setup
```bash
cd ml
pip install -r requirements.txt
```

### Step 2: Dataset Preparation
The PlantVillage dataset contains:
- **38 classes** of plant diseases
- **87,000+ images** of healthy and diseased leaves
- Crops: Apple, Cherry, Corn, Grape, Peach, Pepper, Potato, Strawberry, Tomato

### Step 3: Data Augmentation
To improve model generalization:
```python
data_augmentation = tf.keras.Sequential([
    layers.RandomFlip("horizontal"),
    layers.RandomRotation(0.2),
    layers.RandomZoom(0.2),
    layers.RandomContrast(0.2),
])
```

### Step 4: Transfer Learning
```python
# Load pre-trained MobileNetV2 (without top classification layer)
base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

# Freeze base model weights
base_model.trainable = False

# Add custom classification head
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(38, activation='softmax')  # 38 disease classes
])
```

### Step 5: Training
```python
model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

model.fit(train_dataset, epochs=10, validation_data=val_dataset)
```

### Step 6: Fine-Tuning
After initial training, we unfreeze some layers for fine-tuning:
```python
base_model.trainable = True
# Freeze all layers except the last 20
for layer in base_model.layers[:-20]:
    layer.trainable = False

model.compile(optimizer=Adam(learning_rate=0.0001), ...)
model.fit(train_dataset, epochs=5, validation_data=val_dataset)
```

---

## Browser Deployment

### Model Conversion
Convert TensorFlow model to TensorFlow.js format:
```bash
tensorflowjs_converter --input_format=keras \
    ./saved_model/plant_disease_model.h5 \
    ./tfjs_model/
```

### Output Files
```
tfjs_model/
├── model.json       # Model architecture
├── group1-shard1of4.bin  # Weights (sharded)
├── group1-shard2of4.bin
├── group1-shard3of4.bin
└── group1-shard4of4.bin
```

### Browser Loading
```typescript
import * as tf from '@tensorflow/tfjs';

// Load model (cached after first load)
const model = await tf.loadLayersModel('/models/plant-disease/model.json');

// Run inference
const predictions = model.predict(preprocessedImage);
```

---

## Integration with App

### Model Provider Selection
Users can choose between three AI providers:

```typescript
type ModelProvider = 'gemini' | 'groq' | 'custom';

interface ModelConfig {
    diseaseDetection: ModelProvider;
    chatbot: ModelProvider;
}
```

### Inference Pipeline
```typescript
async function analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
    const config = getModelConfig();
    
    switch(config.diseaseDetection) {
        case 'custom':
            return customModelAI.analyzeCropImage(imageBase64);
        case 'groq':
            return groqAI.analyzeCropImage(imageBase64);
        case 'gemini':
            return geminiAI.analyzeCropImage(imageBase64);
    }
}
```

### Image Preprocessing
```typescript
function preprocessImage(imageBase64: string): tf.Tensor {
    // 1. Decode base64 to image
    const img = new Image();
    img.src = imageBase64;
    
    // 2. Convert to tensor
    let tensor = tf.browser.fromPixels(img);
    
    // 3. Resize to 224x224
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // 4. Normalize to [0, 1]
    tensor = tensor.div(255.0);
    
    // 5. Add batch dimension
    tensor = tensor.expandDims(0);
    
    return tensor;
}
```

---

## Disease Classes (38 Total)

| # | Class Name | Crop |
|---|------------|------|
| 1 | Apple Scab | Apple |
| 2 | Apple Black Rot | Apple |
| 3 | Apple Cedar Rust | Apple |
| 4 | Apple Healthy | Apple |
| 5 | Cherry Powdery Mildew | Cherry |
| 6 | Cherry Healthy | Cherry |
| 7 | Corn Cercospora Leaf Spot | Corn |
| 8 | Corn Common Rust | Corn |
| 9 | Corn Northern Leaf Blight | Corn |
| 10 | Corn Healthy | Corn |
| ... | ... | ... |
| 38 | Tomato Healthy | Tomato |

---

## Performance Metrics

| Metric | Value |
|--------|-------|
| Training Accuracy | ~98% |
| Validation Accuracy | ~95% |
| Model Size | ~15MB |
| Browser Inference Time | <500ms |
| Supported Image Formats | JPEG, PNG, WebP |

---

## Files Structure

```
Farm-Connect/
├── ml/                          # Python training code
│   ├── train.py                 # Main training script
│   ├── model.py                 # Model architecture
│   ├── dataset.py               # Data loading utilities
│   ├── export.py                # TensorFlow.js export
│   └── requirements.txt         # Python dependencies
│
├── frontend/
│   ├── src/lib/
│   │   ├── customModel.ts       # Browser ML inference
│   │   └── ai.ts                # AI provider routing
│   │
│   └── public/models/
│       └── plant-disease/       # TensorFlow.js model files
│           ├── model.json
│           └── *.bin
│
└── DOCS/ML/
    └── README.md                # This documentation
```

---

## Summary

We successfully implemented a custom CNN-based plant disease detection system that:

1. ✅ **Trains offline** using TensorFlow/Keras with PlantVillage dataset
2. ✅ **Runs in browser** using TensorFlow.js (no server required)
3. ✅ **Works offline** after initial model download
4. ✅ **Provides fast inference** (<500ms per image)
5. ✅ **Integrates seamlessly** with existing Groq/Gemini options
