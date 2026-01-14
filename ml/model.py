"""
MobileNetV2-based CNN model for plant disease classification.

This module defines the neural network architecture using transfer learning.
We use MobileNetV2 pre-trained on ImageNet as the feature extractor,
and add custom classification layers for our 38 disease classes.

Why MobileNetV2?
- Lightweight: Only ~3.4M parameters
- Fast inference: Uses depthwise separable convolutions
- Accurate: 71.8% top-1 accuracy on ImageNet
- Mobile-friendly: Designed for resource-constrained devices
"""

import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.applications import MobileNetV2
from dataset import IMG_SIZE, NUM_CLASSES, get_data_augmentation


def create_model(include_augmentation=True):
    """
    Create the plant disease classification model.
    
    Architecture:
    1. Data Augmentation (optional, for training only)
    2. MobileNetV2 Base (frozen, pre-trained on ImageNet)
    3. Global Average Pooling
    4. Dense Layer (256 units, ReLU)
    5. Dropout (0.5)
    6. Output Layer (38 classes, Softmax)
    
    Args:
        include_augmentation: Whether to include data augmentation layer
        
    Returns:
        Compiled Keras model
    """
    
    # Input layer
    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3), name='input_image')
    
    x = inputs
    
    # Data augmentation (only during training)
    if include_augmentation:
        data_augmentation = get_data_augmentation()
        x = data_augmentation(x)
    
    # MobileNetV2 preprocessing (scales pixels to [-1, 1])
    x = tf.keras.applications.mobilenet_v2.preprocess_input(x)
    
    # Load MobileNetV2 as feature extractor
    # - weights='imagenet': Use pre-trained weights from ImageNet
    # - include_top=False: Remove the original classification layer
    # - pooling=None: We'll add our own pooling
    base_model = MobileNetV2(
        weights='imagenet',
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3)
    )
    
    # Freeze the base model (don't update weights during initial training)
    base_model.trainable = False
    
    # Pass through MobileNetV2
    x = base_model(x, training=False)
    
    # Global Average Pooling - reduces each feature map to a single value
    x = layers.GlobalAveragePooling2D(name='global_avg_pool')(x)
    
    # Dense layer with ReLU activation
    x = layers.Dense(256, activation='relu', name='fc1')(x)
    
    # Dropout for regularization (prevents overfitting)
    x = layers.Dropout(0.5, name='dropout')(x)
    
    # Output layer with softmax activation (probability distribution over classes)
    outputs = layers.Dense(NUM_CLASSES, activation='softmax', name='predictions')(x)
    
    # Create the model
    model = Model(inputs, outputs, name='PlantDiseaseClassifier')
    
    # Compile with optimizer, loss function, and metrics
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    return model, base_model


def unfreeze_for_fine_tuning(model, base_model, num_layers_to_unfreeze=20):
    """
    Unfreeze the last few layers of the base model for fine-tuning.
    
    After initial training with frozen base, we can "fine-tune" by
    unfreezing some layers and training with a lower learning rate.
    This allows the model to adapt the pre-trained features to our
    specific task (plant disease classification).
    
    Args:
        model: The full classification model
        base_model: The MobileNetV2 base model
        num_layers_to_unfreeze: How many layers from the end to unfreeze
    """
    
    # Unfreeze the base model
    base_model.trainable = True
    
    # Freeze all layers except the last `num_layers_to_unfreeze`
    for layer in base_model.layers[:-num_layers_to_unfreeze]:
        layer.trainable = False
    
    # Recompile with lower learning rate for fine-tuning
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),  # 10x lower
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print(f"Fine-tuning enabled: {num_layers_to_unfreeze} layers unfrozen")
    print(f"Total trainable weights: {len(model.trainable_weights)}")
    
    return model


def create_inference_model(trained_model):
    """
    Create a model optimized for inference (no augmentation).
    
    This version is used for:
    1. Saving to TensorFlow.js format
    2. Making predictions on new images
    
    Args:
        trained_model: The trained model with augmentation
        
    Returns:
        Model without augmentation layer
    """
    
    # Get the weights from the trained model
    weights = trained_model.get_weights()
    
    # Create a new model without augmentation
    inference_model, _ = create_model(include_augmentation=False)
    
    # Copy weights (skip augmentation layer weights if any)
    inference_model.set_weights(weights)
    
    return inference_model


def print_model_summary(model):
    """Print detailed model architecture summary."""
    
    print("\n" + "="*60)
    print("PLANT DISEASE CLASSIFICATION MODEL")
    print("="*60)
    
    model.summary()
    
    print("\n" + "-"*60)
    print("LAYER BREAKDOWN:")
    print("-"*60)
    
    trainable_count = 0
    non_trainable_count = 0
    
    for layer in model.layers:
        trainable = sum([tf.keras.backend.count_params(w) for w in layer.trainable_weights])
        non_trainable = sum([tf.keras.backend.count_params(w) for w in layer.non_trainable_weights])
        trainable_count += trainable
        non_trainable_count += non_trainable
        
        status = "✓ Trainable" if layer.trainable else "✗ Frozen"
        print(f"{layer.name:30} | {status:15} | Params: {trainable + non_trainable:,}")
    
    print("-"*60)
    print(f"Total trainable params: {trainable_count:,}")
    print(f"Total non-trainable params: {non_trainable_count:,}")
    print(f"Total params: {trainable_count + non_trainable_count:,}")
    print("="*60 + "\n")


if __name__ == "__main__":
    # Create and display model
    model, base_model = create_model()
    print_model_summary(model)
    
    # Show what happens after fine-tuning
    print("\nAfter enabling fine-tuning:")
    model = unfreeze_for_fine_tuning(model, base_model)
    print(f"Trainable layers: {sum([1 for l in model.layers if l.trainable])}")
