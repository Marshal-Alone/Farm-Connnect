# Plant Disease Detection - Complete ML Technical Documentation

> **Author**: Farm-Connect Development Team  
> **Version**: 2.0 (Comprehensive Edition)  
> **Last Updated**: January 2026

---

## Table of Contents

1. [Overview & All 38 Diseases](#1-overview--all-38-diseases)
2. [AI vs ML vs Deep Learning](#2-ai-vs-ml-vs-deep-learning)
3. [Types of Machine Learning](#3-types-of-machine-learning)
4. [CNN Explained in Depth](#4-cnn-explained-in-depth)
5. [MobileNetV2 Architecture](#5-mobilenetv2-architecture)
6. [Transfer Learning Complete Guide](#6-transfer-learning-complete-guide)
7. [Training Pipeline](#7-training-pipeline)
8. [Browser Deployment](#8-browser-deployment)
9. [Hybrid AI System](#9-hybrid-ai-system)
10. [Complete Glossary](#10-complete-glossary)

---

## 1. Overview & All 38 Diseases

### 1.1 The 14 Crop Types

| # | Crop Name | Scientific Name | Common in India |
|---|-----------|-----------------|-----------------|
| 1 | Apple | Malus domestica | Himachal Pradesh, Kashmir |
| 2 | Blueberry | Vaccinium corymbosum | Limited cultivation |
| 3 | Cherry | Prunus avium | Kashmir, Himachal |
| 4 | Corn (Maize) | Zea mays | Maharashtra, Karnataka, Bihar |
| 5 | Grape | Vitis vinifera | Maharashtra, Karnataka |
| 6 | Orange | Citrus sinensis | Maharashtra, Punjab |
| 7 | Peach | Prunus persica | Uttarakhand, HP |
| 8 | Bell Pepper | Capsicum annuum | Karnataka, HP |
| 9 | Potato | Solanum tuberosum | UP, West Bengal, Bihar |
| 10 | Raspberry | Rubus idaeus | Limited cultivation |
| 11 | Soybean | Glycine max | MP, Maharashtra |
| 12 | Squash | Cucurbita | Throughout India |
| 13 | Strawberry | Fragaria ananassa | Maharashtra, HP |
| 14 | Tomato | Solanum lycopersicum | Throughout India |

### 1.2 All 38 Disease Classes (Complete List)

| Index | Disease Name | Crop | Type | Severity |
|-------|--------------|------|------|----------|
| 0 | Apple Scab | Apple | Fungal | Medium |
| 1 | Black Rot | Apple | Fungal | High |
| 2 | Cedar Apple Rust | Apple | Fungal | Medium |
| 3 | Healthy | Apple | N/A | N/A |
| 4 | Healthy | Blueberry | N/A | N/A |
| 5 | Powdery Mildew | Cherry | Fungal | Medium |
| 6 | Healthy | Cherry | N/A | N/A |
| 7 | Gray Leaf Spot (Cercospora) | Corn | Fungal | High |
| 8 | Common Rust | Corn | Fungal | Medium |
| 9 | Northern Leaf Blight | Corn | Fungal | High |
| 10 | Healthy | Corn | N/A | N/A |
| 11 | Black Rot | Grape | Fungal | High |
| 12 | Esca (Black Measles) | Grape | Fungal | High |
| 13 | Leaf Blight (Isariopsis) | Grape | Fungal | Medium |
| 14 | Healthy | Grape | N/A | N/A |
| 15 | Huanglongbing (Citrus Greening) | Orange | Bacterial | Critical |
| 16 | Bacterial Spot | Peach | Bacterial | Medium |
| 17 | Healthy | Peach | N/A | N/A |
| 18 | Bacterial Spot | Bell Pepper | Bacterial | Medium |
| 19 | Healthy | Bell Pepper | N/A | N/A |
| 20 | Early Blight | Potato | Fungal | Medium |
| 21 | Late Blight | Potato | Fungal | Critical |
| 22 | Healthy | Potato | N/A | N/A |
| 23 | Healthy | Raspberry | N/A | N/A |
| 24 | Healthy | Soybean | N/A | N/A |
| 25 | Powdery Mildew | Squash | Fungal | Medium |
| 26 | Leaf Scorch | Strawberry | Fungal | Medium |
| 27 | Healthy | Strawberry | N/A | N/A |
| 28 | Bacterial Spot | Tomato | Bacterial | Medium |
| 29 | Early Blight | Tomato | Fungal | Medium |
| 30 | Late Blight | Tomato | Fungal | Critical |
| 31 | Leaf Mold | Tomato | Fungal | Medium |
| 32 | Septoria Leaf Spot | Tomato | Fungal | Medium |
| 33 | Spider Mites (Two-spotted) | Tomato | Pest | Medium |
| 34 | Target Spot | Tomato | Fungal | Medium |
| 35 | Yellow Leaf Curl Virus | Tomato | Viral | High |
| 36 | Mosaic Virus | Tomato | Viral | High |
| 37 | Healthy | Tomato | N/A | N/A |

**Summary**: 26 diseases + 12 healthy states = 38 classes

---

## 2. AI vs ML vs Deep Learning

### 2.1 What is Artificial Intelligence (AI)?

**Artificial Intelligence (AI)** is the broadest term. It refers to any system that can perform tasks that normally require human intelligence.

**Examples of AI:**
- Chess-playing programs
- Voice assistants (Siri, Alexa)
- Self-driving cars
- Our plant disease detector

### 2.2 What is Machine Learning (ML)?

**Machine Learning (ML)** is a *subset* of AI. Instead of programming explicit rules, we give the computer data and let it **learn patterns** automatically.

**Traditional Programming vs ML:**
```
Traditional: Input + Rules → Output
ML:          Input + Output → Rules (learned automatically)
```

**Example:**
- Traditional: "If leaf has brown spots AND size > 5mm → Early Blight"
- ML: Show 1000 images of Early Blight → Model learns the pattern

### 2.3 What is Deep Learning?

**Deep Learning** is a *subset* of ML that uses **neural networks with many layers** (hence "deep").

```
AI (Artificial Intelligence)
 └── ML (Machine Learning)
      └── Deep Learning
           └── CNN (Convolutional Neural Networks) ← WE USE THIS
```

**Why "Deep"?**
- "Shallow" networks: 1-2 layers
- "Deep" networks: 10+ layers
- Our MobileNetV2: **53 layers** (definitely deep!)

### 2.4 Visual Hierarchy

```
┌─────────────────────────────────────────────────────────┐
│                 ARTIFICIAL INTELLIGENCE                  │
│  (Any machine that mimics human intelligence)           │
│  ┌─────────────────────────────────────────────────┐    │
│  │            MACHINE LEARNING                      │    │
│  │  (Systems that learn from data)                  │    │
│  │  ┌─────────────────────────────────────────┐    │    │
│  │  │         DEEP LEARNING                    │    │    │
│  │  │  (Neural networks with many layers)     │    │    │
│  │  │  ┌─────────────────────────────────┐    │    │    │
│  │  │  │     CNN (Our Model)              │    │    │    │
│  │  │  │  (Specialized for images)        │    │    │    │
│  │  │  └─────────────────────────────────┘    │    │    │
│  │  └─────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Types of Machine Learning

### 3.1 The Three Main Types

| Type | Definition | Data Required | Our Use |
|------|------------|---------------|---------|
| **Supervised** | Learn from labeled examples | Input + Correct Answer | ✓ YES |
| Unsupervised | Find patterns without labels | Input only | ✗ NO |
| Reinforcement | Learn by trial and error | Rewards/Punishments | ✗ NO |

### 3.2 Supervised Learning (What We Use)

**Definition**: Teaching a model using labeled data where each input has a known correct output.

**Our Example:**
```
Input:  [Image of tomato leaf with brown spots]
Label:  "Tomato - Early Blight"
        ↓
Model learns: brown spots on tomato = Early Blight
```

**Why Supervised?**
- PlantVillage dataset has 87,000 images with labels
- Each image is tagged with the correct disease
- Model learns the mapping: image → disease

### 3.3 Unsupervised Learning (Not Used)

**Definition**: Finding patterns in data without labels.

**Example**: Clustering
```
Input: 1000 plant images (no labels)
Output: "I found 5 groups that look similar"
```

**Why We Don't Use It:**
- We have labeled data, so supervised is more accurate
- Clustering can't tell you "this is Early Blight"

### 3.4 Why Not Other Techniques?

| Technique | What It Does | Why Not for Us |
|-----------|--------------|----------------|
| **Clustering** (K-Means) | Groups similar items | Can't name diseases |
| **Segmentation** (U-Net) | Marks diseased pixels | Overkill, classification enough |
| **Object Detection** (YOLO) | Finds & locates objects | We analyze whole leaf |
| **Regression** | Predicts numbers | We predict categories |

---

## 4. CNN Explained in Depth

### 4.1 What is a Neural Network?

A **Neural Network** is a computing system inspired by the human brain. It consists of:

**Neuron (Node)**: Basic unit that receives inputs, processes them, and produces output.

```
Input1 ──┐
Input2 ──┼──→ [Neuron] ──→ Output
Input3 ──┘
```

**How a Neuron Works:**
```python
output = activation(w1*input1 + w2*input2 + w3*input3 + bias)
```
- **Weights (w)**: How important each input is
- **Bias**: Offset value
- **Activation**: Non-linear function (like ReLU)

### 4.2 What Makes CNN Special for Images?

**CNN = Convolutional Neural Network**

Regular neural networks treat each pixel independently. CNNs understand **spatial relationships** - pixels near each other matter!

**Key Idea**: A CNN slides small filters (kernels) across the image to detect features like edges, textures, and shapes.

### 4.3 CNN Layers Explained

#### Layer 1: Convolutional Layer

**What it does**: Applies small filters to detect patterns.

```
Image (224x224x3)
    ↓
[3x3 Filter] slides across image
    ↓
Feature Map (detecting edges, colors)
```

**Filter/Kernel**: A small matrix (e.g., 3×3) that slides across the image.

Example edge detection filter:
```
[-1  0  1]
[-2  0  2]
[-1  0  1]
```

#### Layer 2: Activation Function (ReLU)

**ReLU = Rectified Linear Unit**

```
ReLU(x) = max(0, x)
```
- If input is positive → keep it
- If input is negative → make it 0

**Why ReLU?**
- Adds non-linearity (lets model learn complex patterns)
- Fast to compute
- Prevents vanishing gradient problem

#### Layer 3: Pooling Layer

**What it does**: Reduces image size while keeping important features.

**Max Pooling (2×2)**:
```
[1  3  |  2  4]     [3  4]
[5  2  |  6  1]  →  [7  8]
[7  4  |  8  3]
[1  0  |  5  2]
```
Takes maximum value from each 2×2 region.

**Why Pool?**
- Reduces computation
- Makes model invariant to small translations
- Prevents overfitting

#### Layer 4: Batch Normalization

**What it does**: Normalizes layer inputs to have mean ≈ 0 and std ≈ 1.

**Why?**
- Faster training (can use higher learning rate)
- Reduces internal covariate shift
- Acts as regularization

#### Layer 5: Dropout

**What it does**: Randomly "turns off" neurons during training.

```
Training: [1] [X] [1] [X] [1]  (X = dropped out)
Inference: [1] [1] [1] [1] [1]  (all neurons active)
```

**Why?**
- Prevents overfitting
- Forces network to learn redundant representations

#### Layer 6: Fully Connected (Dense) Layer

**What it does**: Connects every neuron from previous layer to next layer.

```python
Dense(256, activation='relu')  # 256 neurons
Dense(38, activation='softmax')  # 38 output classes
```

#### Layer 7: Softmax (Output Layer)

**What it does**: Converts raw outputs to probabilities that sum to 1.

```
Raw outputs: [2.1, 0.5, -1.2, 0.8, ...]
After Softmax: [0.65, 0.12, 0.02, 0.15, ...]  (sum = 1.0)
```

**Formula:**
```
softmax(x_i) = exp(x_i) / Σ exp(x_j)
```

### 4.4 What is the "Head" of a Model?

**Head** = The final classification layers that make the actual prediction.

```
┌─────────────────────────────────────┐
│         BASE MODEL (Body)           │  ← Pre-trained MobileNetV2
│  [Conv] → [Conv] → ... → [Conv]     │    (feature extraction)
└─────────────────────────────────────┘
               ↓
┌─────────────────────────────────────┐
│           HEAD (Our Custom)         │  ← We add this
│  [GlobalAvgPool] → [Dense(256)]     │
│  → [Dropout] → [Dense(38)]          │    (classification)
└─────────────────────────────────────┘
               ↓
            Output: "Tomato - Early Blight"
```

**We replace the original head** (trained for ImageNet's 1000 classes) with our custom head (for 38 plant diseases).

---

## 5. MobileNetV2 Architecture

### 5.1 Why MobileNetV2?

| Factor | VGG16 | ResNet50 | MobileNetV2 | Our Choice |
|--------|-------|----------|-------------|------------|
| Parameters | 138M | 25M | **3.4M** | ✓ Smallest |
| Model Size | 528MB | 98MB | **14MB** | ✓ Browser-friendly |
| Speed | Slow | Medium | **Fast** | ✓ Real-time |
| Accuracy | 92% | 95% | 94% | ✓ Good enough |

### 5.2 MobileNetV2 Key Innovations

#### Depthwise Separable Convolution

**Regular Convolution**: One filter processes all channels together.
- Computation: H × W × C_in × C_out × K × K

**Depthwise Separable**: Split into two steps:
1. **Depthwise**: One filter per channel
2. **Pointwise**: 1×1 convolution to combine

**Result**: 8-9x fewer computations!

#### Inverted Residual Block

```
Traditional Residual:
Wide → Narrow → Wide (bottleneck in middle)

Inverted Residual (MobileNetV2):
Narrow → Wide → Narrow (expansion in middle)
```

**Why inverted?**
- Low-dimensional data → expand for processing → compress back
- More efficient for mobile/edge devices

### 5.3 MobileNetV2 Layer Structure

| Layer Type | Output Shape | Details |
|-----------|--------------|---------|
| Input | 224×224×3 | RGB image |
| Conv2D | 112×112×32 | Initial convolution |
| Bottleneck×1 | 112×112×16 | Inverted residual |
| Bottleneck×2 | 56×56×24 | Stride 2 (downsample) |
| Bottleneck×3 | 28×28×32 | More features |
| Bottleneck×4 | 14×14×64 | Deeper features |
| Bottleneck×3 | 14×14×96 | Abstract features |
| Bottleneck×3 | 7×7×160 | High-level features |
| Bottleneck×1 | 7×7×320 | Final bottleneck |
| Conv2D | 7×7×1280 | Expand channels |
| GlobalAvgPool | 1×1×1280 | Flatten to vector |
| **Our Head** | 38 | Classification |

---

## 6. Transfer Learning Complete Guide

### 6.1 What is Transfer Learning?

**Transfer Learning** = Using knowledge from one task to help with a different but related task.

**Analogy**: You learned to drive a car. Now learning to drive a truck is easier because many skills transfer (steering, braking, traffic rules).

### 6.2 Why Transfer Learning for Us?

**Without Transfer Learning:**
- Need millions of plant images
- Need weeks of training
- Need expensive GPU clusters

**With Transfer Learning:**
- Use MobileNetV2 pre-trained on 14 million ImageNet images
- Only need 87,000 plant images
- Train in ~1 hour on free Google Colab GPU

### 6.3 What is ImageNet?

**ImageNet** is a massive dataset:
- 14+ million images
- 1000 categories (dogs, cats, cars, planes, etc.)
- Used to benchmark image classification models

**MobileNetV2 on ImageNet**: Already knows how to detect edges, textures, shapes, objects.

### 6.4 What Features Transfer?

| CNN Depth | Features Learned | Transferable? |
|-----------|-----------------|---------------|
| Early layers (1-10) | Edges, colors, gradients | ✓ Universal |
| Middle layers (11-30) | Textures, patterns | ✓ Mostly |
| Late layers (31-50) | Object parts, shapes | ~ Partially |
| Final layers | ImageNet classes | ✗ Replace |

**Key insight**: A edge is a edge whether in a photo of a cat or a tomato leaf!

### 6.5 Two-Phase Training Strategy

#### Phase 1: Feature Extraction (Freeze Base)

```python
# Load pre-trained MobileNetV2
base_model = MobileNetV2(weights='imagenet', include_top=False)

# FREEZE all layers (don't modify pre-trained weights)
base_model.trainable = False

# Add our custom head
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(38, activation='softmax')  # 38 disease classes
])

# Train with higher learning rate (only head learns)
model.compile(optimizer=Adam(lr=0.001), ...)
model.fit(train_data, epochs=25)
```

**What happens:**
- Base model is frozen (weights don't change)
- Only our custom head trains
- Fast training (~30-40 minutes)
- Model learns to classify based on pre-trained features

#### Phase 2: Fine-Tuning (Unfreeze Top Layers)

```python
# UNFREEZE the base model
base_model.trainable = True

# But KEEP early layers frozen (they're universal)
for layer in base_model.layers[:-20]:
    layer.trainable = False

# Train with LOWER learning rate (don't destroy pre-trained knowledge)
model.compile(optimizer=Adam(lr=0.0001), ...)  # 10x smaller!
model.fit(train_data, epochs=15)
```

**What happens:**
- Top 20 layers of MobileNetV2 now train
- They adapt from general features to plant-specific features
- Lower learning rate prevents "catastrophic forgetting"
- Improves accuracy by 5-10%

---

*Continued in Part 2: TECHNICAL_DOCUMENTATION_PART2.md [I ADDED DATA HERE ONLY]*

# Plant Disease Detection - Technical Documentation Part 2

> Continuation of TECHNICAL_DOCUMENTATION.md

---

## 7. Training Pipeline

### 7.1 Dataset: PlantVillage (Complete Details)

**Source**: PlantVillage is an open-source dataset created by Penn State University.

| Property | Value | Details |
|----------|-------|---------|
| Total Images | 87,848 | High-quality leaf photos |
| Classes | 38 | 26 diseases + 12 healthy |
| Crops | 14 | Listed in Part 1 |
| Image Size | 256×256 | Resized to 224×224 |
| Format | JPG/PNG | RGB color |
| Split | 80/20 | Train/Validation |

**Training set**: 70,278 images (87,848 × 0.80)
**Validation set**: 17,570 images (87,848 × 0.20)

### 7.2 Data Preprocessing Pipeline

```python
def preprocess(image, label):
    """
    Preprocess a single image for training.
    
    Args:
        image: Raw image tensor (H×W×3)
        label: Integer class label (0-37)
    
    Returns:
        Preprocessed image, one-hot encoded label
    """
    
    # Step 1: Resize to 224×224 (MobileNetV2 input size)
    # Using bilinear interpolation for smooth resizing
    image = tf.image.resize(image, [224, 224])
    
    # Step 2: Convert to float32 and normalize to [0, 1]
    # Original: pixel values 0-255
    # After: pixel values 0.0-1.0
    image = tf.cast(image, tf.float32) / 255.0
    
    # Step 3: One-hot encode the label
    # Before: label = 29 (integer)
    # After: [0,0,0,...,1,...,0] (38-element vector with 1 at position 29)
    label = tf.one_hot(label, 38)
    
    return image, label
```

### 7.3 Data Augmentation (Detailed)

**What is Data Augmentation?**
Creating variations of existing images to artificially increase dataset size and prevent overfitting.

```python
data_augmentation = tf.keras.Sequential([
    # 1. Random Horizontal Flip
    # Randomly mirrors the image left-right
    # A diseased leaf looks the same flipped!
    layers.RandomFlip("horizontal"),
    
    # 2. Random Rotation
    # Rotates ±20% of 360° = ±72 degrees
    # Leaves can be photographed at any angle
    layers.RandomRotation(0.2),
    
    # 3. Random Zoom
    # Zooms in/out by up to 20%
    # Simulates different camera distances
    layers.RandomZoom(0.2),
    
    # 4. Random Contrast
    # Varies brightness/contrast by 20%
    # Simulates different lighting conditions
    layers.RandomContrast(0.2),
])
```

**Effective Dataset Size:**
- Original: 70,278 images
- With augmentation: Each image has many variations
- Effective: ~200,000+ unique training examples

### 7.4 Loss Function: Categorical Cross-Entropy

**What is a Loss Function?**
A mathematical formula that measures how wrong the model's predictions are. Lower loss = better predictions.

**Categorical Cross-Entropy Formula:**
```
Loss = -Σ y_true × log(y_pred)
```

**Example:**
```
True label: [0, 0, 1, 0, ...]  (class 2 is correct - index 2 has 1)
Prediction: [0.1, 0.2, 0.6, 0.1, ...]  (model predicts 60% for class 2)

Loss = -log(0.6) = 0.51  (lower is better)
```

**Perfect prediction**: Loss = 0
**Terrible prediction**: Loss → infinity

### 7.5 Optimizer: Adam

**What is an Optimizer?**
An algorithm that adjusts model weights to minimize loss.

**Adam = Adaptive Moment Estimation**

Key features:
1. **Adaptive learning rate**: Different for each parameter
2. **Momentum**: Remembers past gradients to smooth updates
3. **Works well out-of-the-box**: Good default choice

```python
optimizer = tf.keras.optimizers.Adam(learning_rate=0.001)
```

**Learning Rate**:
- Too high: Model bounces around, never converges
- Too low: Training takes forever
- 0.001: Good default for training new head
- 0.0001: Good for fine-tuning (10x lower)

### 7.6 Training Callbacks

**What are Callbacks?**
Functions that run during training to monitor progress and take actions.

```python
callbacks = [
    # 1. Early Stopping
    # Stops training if no improvement
    tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',        # Watch validation loss
        patience=5,                # Wait 5 epochs before stopping
        restore_best_weights=True  # Keep best model, not last
    ),
    
    # 2. Learning Rate Reduction
    # Reduces LR when stuck
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',  # Watch validation loss
        factor=0.2,          # Multiply LR by 0.2 (divide by 5)
        patience=3           # Wait 3 epochs before reducing
    )
]
```

### 7.7 Overfitting vs Underfitting

| Problem | Signs | Solutions |
|---------|-------|-----------|
| **Overfitting** | Train acc high, val acc low | Dropout, augmentation, early stopping |
| **Underfitting** | Both accuracies low | More layers, more epochs, higher LR |
| **Good Fit** | Both accuracies high & similar | We achieved this! |

**Our Model:**
- Training accuracy: ~97%
- Validation accuracy: ~95%
- Gap of ~2% is acceptable (slight overfitting, but good generalization)

---

## 8. Browser Deployment (TensorFlow.js)

### 8.1 Why Run ML in Browser?

| Server-side ML | Browser-side ML |
|----------------|-----------------|
| Requires internet | **Works offline** |
| Server costs | **Free (user's device)** |
| Data leaves device | **Privacy preserved** |
| Server latency | **Instant response** |

### 8.2 TensorFlow.js Conversion

**TensorFlow.js** is a JavaScript library that runs ML models in the browser.

**Conversion Process:**
```bash
# Step 1: Save trained model
model.save('saved_model/plant_disease.keras')

# Step 2: Export to SavedModel format
model.export('saved_model/tfjs_export')

# Step 3: Convert to TensorFlow.js Graph Model
tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    saved_model/tfjs_export \
    tfjs_graph_model/
```

**Why Graph Model (not Layers Model)?**
- **Layers Model**: Keras format, can have compatibility issues with Keras 3.x
- **Graph Model**: TensorFlow SavedModel format, more robust and faster

### 8.3 Output Files Explained

```
tfjs_graph_model/
├── model.json          # Model architecture + metadata
│                       # Contains: layer structure, input/output shapes
│                       # Size: ~160KB
│
├── group1-shard1of3.bin  # Model weights (binary)
├── group1-shard2of3.bin  # Weights split for faster loading
├── group1-shard3of3.bin  # Total: ~10MB
│                       
└── labels.json         # Our custom file: class names
                        # Maps index → disease name
```

### 8.4 Browser Inference Code Explained

```typescript
// customModel.ts

import * as tf from '@tensorflow/tfjs';

class CustomModelService {
    private model: tf.GraphModel | null = null;
    private labels: Record<string, LabelInfo> | null = null;
    
    /**
     * Load model into browser memory.
     * Called once when user first accesses disease detection.
     */
    async loadModel(): Promise<void> {
        // Choose compute backend
        // WebGL: Uses GPU, much faster (~500ms inference)
        // CPU: Fallback if WebGL unavailable (~2s inference)
        try {
            await tf.setBackend('webgl');
            console.log('Using GPU acceleration');
        } catch {
            await tf.setBackend('cpu');
            console.log('Using CPU (slower)');
        }
        await tf.ready();
        
        // Load model from public folder
        // This downloads model.json + all .bin shard files
        this.model = await tf.loadGraphModel('/models/plant-disease/model.json');
        
        // Load our class labels
        const response = await fetch('/models/plant-disease/labels.json');
        this.labels = await response.json();
        
        // Warm up: Run dummy prediction to initialize memory
        // First inference is always slow; this makes real predictions fast
        const warmup = tf.zeros([1, 224, 224, 3]);
        await this.model.execute(warmup);
        warmup.dispose();  // Free memory
    }
    
    /**
     * Preprocess image for model input.
     * 
     * Input: Base64 encoded image from user's camera/upload
     * Output: Tensor of shape [1, 224, 224, 3] with values 0-1
     */
    async preprocessImage(imageBase64: string): Promise<tf.Tensor4D> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            
            img.onload = () => {
                // Step 1: Convert HTML Image to tensor
                // fromPixels creates tensor with shape [H, W, 3]
                // Values are 0-255 (uint8)
                let tensor = tf.browser.fromPixels(img);
                
                // Step 2: Resize to 224x224
                // MobileNetV2 expects exactly this size
                tensor = tf.image.resizeBilinear(tensor, [224, 224]);
                
                // Step 3: Normalize to [0, 1]
                // Model was trained with normalized values
                tensor = tensor.div(255.0);
                
                // Step 4: Add batch dimension
                // Model expects [batch, height, width, channels]
                // We have 1 image, so batch = 1
                const batched = tensor.expandDims(0) as tf.Tensor4D;
                
                tensor.dispose();  // Free intermediate tensor
                resolve(batched);
            };
            
            img.onerror = () => reject(new Error('Failed to load image'));
            img.src = imageBase64;
        });
    }
    
    /**
     * Run disease detection on an image.
     */
    async analyzeCropImage(imageBase64: string): Promise<AnalysisResult> {
        // Preprocess
        const inputTensor = await this.preprocessImage(imageBase64);
        
        // Run inference
        // execute() runs the model and returns output tensor
        const predictions = this.model!.execute(inputTensor) as tf.Tensor;
        
        // Get probabilities as JavaScript array
        const probabilities = await predictions.data();
        
        // Find class with highest probability
        let maxIndex = 0;
        let maxProb = 0;
        for (let i = 0; i < probabilities.length; i++) {
            if (probabilities[i] > maxProb) {
                maxProb = probabilities[i];
                maxIndex = i;
            }
        }
        
        // Clean up tensors (IMPORTANT: prevents memory leaks)
        inputTensor.dispose();
        predictions.dispose();
        
        // Get disease info from labels
        const labelInfo = this.labels![maxIndex.toString()];
        
        return {
            disease: labelInfo.name,
            confidence: Math.round(maxProb * 100),
            crop: labelInfo.crop,
            severity: this.getSeverity(maxProb),
            treatment: this.getTreatment(labelInfo.condition),
            prevention: this.getPrevention(labelInfo.condition)
        };
    }
}
```

---

## 9. Hybrid AI System

### 9.1 The Problem with Single Models

| Model | Pros | Cons |
|-------|------|------|
| **Custom CNN** | Fast, offline | Limited accuracy (~85%) |
| **Groq LLaMA** | Very accurate (~95%) | Needs internet, API key |

**Solution**: Combine both! Use custom CNN for speed, Groq for validation.

### 9.2 Hybrid Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER UPLOADS IMAGE                        │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 1: CUSTOM CNN MODEL (Browser, ~1.3 seconds)           │
│  ─────────────────────────────────────────────────────────  │
│  Input: User's plant image                                  │
│  Process: TensorFlow.js inference                           │
│  Output: "Tomato - Early Blight" (84% confidence)           │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 2: GROQ LLAMA VISION API (Cloud, ~2 seconds)          │
│  ─────────────────────────────────────────────────────────  │
│  Input: Image + Custom model's prediction                   │
│  Prompt: "Our model says Early Blight. Is this correct?"    │
│  Process: LLaMA 3.2 90B Vision analyzes image               │
│  Output: "DISAGREE - This is Powdery Mildew" (92%)          │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  STEP 3: COMBINE RESULTS                                    │
│  ─────────────────────────────────────────────────────────  │
│  If Groq agrees: Return custom model result (confirmed)     │
│  If Groq disagrees: Return Groq's result (corrected)        │
│  Final: "Powdery Mildew" (92% confidence)                   │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    SHOW RESULT TO USER                       │
│  Disease: Powdery Mildew                                    │
│  Confidence: 92%                                            │
│  Treatment: Apply sulfur-based fungicide...                 │
└─────────────────────────────────────────────────────────────┘
```

### 9.3 Hybrid Mode Benefits

| Metric | Custom Only | Groq Only | Hybrid |
|--------|-------------|-----------|--------|
| Accuracy | ~85% | ~95% | **~97%** |
| Speed | 1.3s | 3s | **3.5s** |
| Offline | ✓ Yes | ✗ No | Partial |
| Cost | Free | API usage | API usage |

**Why higher accuracy?**
- Two models rarely make the same mistake
- Custom model provides context to Groq
- Groq can correct custom model errors

---

## 10. Complete Glossary

### A-E

| Term | Full Form | Definition |
|------|-----------|------------|
| **Accuracy** | - | Percentage of correct predictions: (correct/total) × 100 |
| **Activation Function** | - | Non-linear function applied after layer computation (ReLU, Sigmoid, Softmax) |
| **Adam** | Adaptive Moment Estimation | Optimization algorithm that adapts learning rate per parameter |
| **API** | Application Programming Interface | Way for programs to communicate (we use Groq API) |
| **Augmentation** | Data Augmentation | Creating variations of training images (flip, rotate, zoom) |
| **Backpropagation** | - | Algorithm to calculate gradients for training neural networks |
| **Batch** | Mini-batch | Subset of training data processed together (e.g., 32 images) |
| **Batch Normalization** | - | Normalizes layer inputs for faster, more stable training |
| **Bias** | - | Learnable offset added to neuron computation |
| **Binary** | - | Two classes (yes/no). We use multi-class instead |
| **Bottleneck** | - | Layer that compresses then expands data (MobileNetV2 uses inverted) |
| **Categorical** | - | Multiple classes (one-of-many). What we use |
| **Channel** | - | Color dimension of image. RGB has 3 channels |
| **Classification** | - | Predicting which category an input belongs to |
| **CNN** | Convolutional Neural Network | Neural network specialized for image processing |
| **Convolution** | - | Mathematical operation: sliding a filter across an image |
| **Cross-Entropy** | - | Loss function for classification problems |
| **Deep Learning** | - | Neural networks with many layers (subset of ML) |
| **Dense Layer** | Fully Connected Layer | Layer where every neuron connects to all previous neurons |
| **Depthwise Convolution** | - | Convolution applied to each channel separately (MobileNet) |
| **Dropout** | - | Randomly disabling neurons during training to prevent overfitting |
| **Epoch** | - | One complete pass through entire training dataset |

### F-L

| Term | Full Form | Definition |
|------|-----------|------------|
| **Feature** | - | Pattern or characteristic detected by the model |
| **Feature Extraction** | - | Using pre-trained model as fixed feature extractor |
| **Feature Map** | - | Output of a convolutional layer; represents detected patterns |
| **Filter** | Kernel | Small matrix that slides across image to detect patterns |
| **Fine-tuning** | - | Unfreezing and training some pre-trained layers |
| **Flatten** | - | Converting multi-dimensional tensor to 1D vector |
| **Forward Pass** | - | Computing output from input through all layers |
| **Frozen Layer** | - | Layer whose weights are not updated during training |
| **Gradient** | - | Direction and magnitude of loss change w.r.t. weights |
| **Gradient Descent** | - | Optimization algorithm that follows gradients to minimize loss |
| **Graph Model** | - | TensorFlow.js format for optimized inference |
| **GPU** | Graphics Processing Unit | Hardware for parallel computation (faster training) |
| **Head** | - | Final classification layers of a model |
| **Hyperparameter** | - | Settings chosen before training (learning rate, batch size) |
| **ImageNet** | - | Large image dataset (14M images, 1000 classes) |
| **Inference** | - | Using trained model to make predictions |
| **Input Layer** | - | First layer that receives raw data |
| **Inverted Residual** | - | MobileNetV2 block: narrow→expand→narrow |
| **Kernel** | Filter | Small matrix for convolution operation |
| **Label** | - | Correct answer for supervised learning |
| **Layer** | - | Building block of neural network |
| **Layers Model** | - | TensorFlow.js format (Keras-compatible) |
| **Learning Rate** | LR | How much to adjust weights each step |
| **Loss** | - | Measure of prediction error (lower = better) |

### M-R

| Term | Full Form | Definition |
|------|-----------|------------|
| **Max Pooling** | - | Taking maximum value from each region |
| **Mini-batch** | Batch | Subset of data for one training step |
| **ML** | Machine Learning | Systems that learn from data |
| **MobileNet** | - | Lightweight CNN architecture for mobile devices |
| **MobileNetV2** | - | Improved MobileNet with inverted residuals |
| **Model** | - | Trained algorithm that makes predictions |
| **Momentum** | - | Using past gradients to smooth weight updates |
| **Multi-class** | - | Classification with more than 2 classes (our case: 38) |
| **Neural Network** | NN | Computing system inspired by biological neurons |
| **Neuron** | Node | Basic unit that receives, processes, and outputs data |
| **Normalization** | - | Scaling values to a standard range (e.g., 0-1) |
| **One-hot Encoding** | - | Representing categories as binary vectors |
| **Optimizer** | - | Algorithm that updates weights to minimize loss |
| **Output Layer** | - | Final layer that produces predictions |
| **Overfitting** | - | Model memorizes training data, fails on new data |
| **Parameter** | Weight | Learnable value in the model |
| **Pixel** | - | Single point in an image |
| **Pointwise Convolution** | - | 1×1 convolution to combine channels |
| **Pooling** | - | Reducing spatial dimensions of feature maps |
| **Pre-trained** | - | Model already trained on a large dataset |
| **Prediction** | - | Model's output for a given input |
| **Preprocessing** | - | Preparing data before feeding to model |
| **Regularization** | - | Techniques to prevent overfitting |
| **ReLU** | Rectified Linear Unit | Activation function: max(0, x) |
| **Residual** | Skip Connection | Adding input to output (helps deep networks) |
| **RGB** | Red Green Blue | Color model with 3 channels |

### S-Z

| Term | Full Form | Definition |
|------|-----------|------------|
| **Shard** | - | Part of model weights file (split for faster loading) |
| **Sigmoid** | - | Activation function: 1/(1+e^-x), outputs 0-1 |
| **Softmax** | - | Activation that converts outputs to probabilities summing to 1 |
| **Stride** | - | Step size when sliding filter across image |
| **Supervised Learning** | - | Learning from labeled data |
| **Tensor** | - | Multi-dimensional array (generalization of matrix) |
| **TensorFlow** | TF | Google's ML framework |
| **TensorFlow.js** | TFJS | TensorFlow for JavaScript/browsers |
| **Test Set** | - | Data to evaluate final model performance |
| **Training** | - | Process of adjusting model weights |
| **Training Set** | - | Data used to train the model |
| **Transfer Learning** | - | Using pre-trained model for new task |
| **Underfitting** | - | Model too simple to learn the pattern |
| **Unsupervised Learning** | - | Learning patterns without labels |
| **Validation Set** | - | Data to tune hyperparameters and prevent overfitting |
| **Vanishing Gradient** | - | Gradients become too small in deep networks |
| **Weight** | - | Learnable parameter that determines connection strength |
| **WebGL** | Web Graphics Library | Browser API for GPU acceleration |

---

## Quick Reference: Presentation Answers

### "What type of ML did you use?"
> We used **Supervised Learning** with **Multi-class Classification**. We have 87,000 labeled images where each image has a known disease label. The model learns to map input images to one of 38 disease classes.

### "What is your CNN architecture?"
> We use **MobileNetV2**, a 53-layer CNN with only 3.4 million parameters. It uses **Inverted Residual Blocks** and **Depthwise Separable Convolutions** to be efficient enough to run in the browser. It takes 224×224×3 images and outputs 38 probabilities.

### "Explain Transfer Learning"
> Transfer Learning means using a model pre-trained on a large dataset (ImageNet: 14 million images) and adapting it for our task. MobileNetV2 already knows how to detect edges, textures, and shapes. We freeze these layers and add our own "head" (classification layers) for 38 plant diseases. This lets us train with only 87,000 images instead of millions.

### "What is the Head of a model?"
> The "Head" is the final classification layers. When we do transfer learning, we remove the original head (trained for ImageNet's 1000 classes) and add our own custom head with 38 outputs for plant diseases.

### "Why not clustering or segmentation?"
> **Clustering** is unsupervised—it groups similar items but can't label them. Since we have labeled data, supervised classification is more accurate. **Segmentation** identifies diseased pixels, which is overkill; we just need to know the disease type, not its exact location.

### "How does browser deployment work?"
> We convert the trained model to TensorFlow.js format. The model runs entirely in the user's browser using WebGL (GPU) or CPU. No server needed! This enables offline operation and protects user privacy since images never leave their device.

---

*End of Technical Documentation*

