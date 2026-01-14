# Code Explanation for Teacher

This document explains the key code components of our custom ML disease detection system.

---

## 1. Dataset Loading (`dataset.py`)

### Class Labels (38 disease classes)
```python
CLASS_LABELS = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    # ... 34 more classes
    "Tomato___healthy"
]
```

**Purpose**: Maps numeric predictions (0-37) to disease names.

### Data Augmentation
```python
def get_data_augmentation():
    return tf.keras.Sequential([
        layers.RandomFlip("horizontal"),    # Flip image left-right
        layers.RandomRotation(0.2),         # Rotate up to 20%
        layers.RandomZoom(0.2),             # Zoom in/out up to 20%
        layers.RandomContrast(0.2),         # Adjust contrast
        layers.RandomBrightness(0.2),       # Adjust brightness
    ])
```

**Purpose**: Creates variations of training images to help the model generalize better.

### Image Preprocessing
```python
def preprocess_image(image, label):
    # Resize to 224x224 (MobileNetV2 input size)
    image = tf.image.resize(image, [224, 224])
    
    # Normalize to [0, 1] range
    image = tf.cast(image, tf.float32) / 255.0
    
    return image, label
```

**Purpose**: Prepares images for model input by resizing and normalizing pixel values.

---

## 2. Model Architecture (`model.py`)

### Creating the Model
```python
def create_model():
    # Input layer
    inputs = layers.Input(shape=(224, 224, 3))
    
    # Load pre-trained MobileNetV2
    base_model = MobileNetV2(
        weights='imagenet',      # Use ImageNet pre-trained weights
        include_top=False,       # Remove original classifier
        input_shape=(224, 224, 3)
    )
    
    # Freeze base model weights
    base_model.trainable = False
    
    # Build classification head
    x = base_model(inputs)
    x = GlobalAveragePooling2D()(x)  # Reduce dimensions
    x = Dense(256, activation='relu')(x)  # Fully connected layer
    x = Dropout(0.5)(x)  # Prevent overfitting
    outputs = Dense(38, activation='softmax')(x)  # 38 disease classes
    
    model = Model(inputs, outputs)
    return model
```

**Key Concepts**:
- **Transfer Learning**: Use pre-trained MobileNetV2 as feature extractor
- **Frozen Layers**: Keep ImageNet features, train only our classifier
- **Softmax**: Output probability for each of 38 classes

### Fine-Tuning
```python
def unfreeze_for_fine_tuning(model, base_model):
    # Unfreeze base model
    base_model.trainable = True
    
    # Keep first layers frozen (they detect basic features)
    for layer in base_model.layers[:-20]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=Adam(learning_rate=0.0001),  # 10x smaller
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
```

**Purpose**: After initial training, unfreeze some layers to adapt pre-trained features to plant diseases.

---

## 3. Training Process (`train.py`)

### Training Loop
```python
# Phase 1: Train with frozen base
model.fit(
    train_dataset,
    epochs=10,
    validation_data=val_dataset,
    callbacks=[
        ModelCheckpoint(save_best_only=True),
        EarlyStopping(patience=3),
        ReduceLROnPlateau(factor=0.2)
    ]
)

# Phase 2: Fine-tune
model = unfreeze_for_fine_tuning(model, base_model)
model.fit(train_dataset, epochs=5, ...)
```

**Key Callbacks**:
- **ModelCheckpoint**: Save best model during training
- **EarlyStopping**: Stop if validation loss doesn't improve
- **ReduceLROnPlateau**: Lower learning rate when stuck

---

## 4. Model Export (`export.py`)

### TensorFlow.js Conversion
```python
# Command to convert
tensorflowjs_converter \
    --input_format=keras \
    --output_format=tfjs_layers_model \
    model.h5 \
    ./tfjs_model/
```

**Output**:
- `model.json`: Architecture and layer configuration
- `*.bin`: Sharded weight files (split for efficient loading)

---

## 5. Browser Inference (`customModel.ts`)

### Loading the Model
```typescript
import * as tf from '@tensorflow/tfjs';

// Load model (cached after first load)
const model = await tf.loadLayersModel('/models/plant-disease/model.json');

// Load class labels
const labels = await fetch('/models/plant-disease/labels.json').then(r => r.json());
```

### Image Preprocessing
```typescript
function preprocessImage(imageBase64: string): tf.Tensor4D {
    // Convert to tensor
    let tensor = tf.browser.fromPixels(img);
    
    // Resize to 224x224
    tensor = tf.image.resizeBilinear(tensor, [224, 224]);
    
    // Normalize to [0, 1]
    tensor = tensor.div(255.0);
    
    // Add batch dimension [1, 224, 224, 3]
    return tensor.expandDims(0);
}
```

### Running Inference
```typescript
async function analyzeCropImage(imageBase64: string): Promise<AICropAnalysis> {
    // Preprocess
    const inputTensor = await preprocessImage(imageBase64);
    
    // Predict
    const predictions = model.predict(inputTensor);
    const probabilities = await predictions.data();
    
    // Find highest probability class
    let maxIndex = 0;
    let maxProb = 0;
    for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] > maxProb) {
            maxProb = probabilities[i];
            maxIndex = i;
        }
    }
    
    // Get disease name from labels
    const diseaseName = labels[maxIndex].name;
    const confidence = Math.round(maxProb * 100);
    
    return {
        disease: diseaseName,
        confidence: confidence,
        // ... treatment, prevention, etc.
    };
}
```

---

## 6. AI Provider Routing (`ai.ts`)

```typescript
// Three AI providers
type ModelProvider = 'gemini' | 'groq' | 'custom';

export async function analyzeCropImage(imageBase64: string) {
    const config = getModelConfig();
    
    switch(config.diseaseDetection) {
        case 'custom':
            // Browser-based TensorFlow.js
            return customModelAI.analyzeCropImage(imageBase64);
        
        case 'groq':
            // Cloud API - Groq
            return groqAI.analyzeCropImage(imageBase64);
        
        case 'gemini':
            // Cloud API - Google
            return geminiAI.analyzeCropImage(imageBase64);
    }
}
```

**Purpose**: Allows users to switch between custom model and cloud APIs.

---

## Summary

| Component | File | Purpose |
|-----------|------|---------|
| Data Loading | `dataset.py` | Load PlantVillage dataset |
| Model Architecture | `model.py` | MobileNetV2 + custom classifier |
| Training | `train.py` | Two-phase training process |
| Export | `export.py` | Convert to TensorFlow.js |
| Browser Inference | `customModel.ts` | Run model in browser |
| Provider Routing | `ai.ts` | Switch between AI providers |

---

## Key Technical Terms

| Term | Explanation |
|------|-------------|
| **CNN** | Convolutional Neural Network - specialized for image processing |
| **Transfer Learning** | Using pre-trained model as starting point |
| **Fine-Tuning** | Adjusting pre-trained weights for specific task |
| **Softmax** | Converts outputs to probability distribution |
| **Dropout** | Randomly disables neurons during training to prevent overfitting |
| **TensorFlow.js** | JavaScript library for running ML in browsers |
| **Epoch** | One complete pass through the training data |
| **Batch Size** | Number of images processed together |
