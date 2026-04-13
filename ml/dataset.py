"""
Dataset loader for PlantVillage plant disease dataset.

This module handles downloading, preprocessing, and augmenting the PlantVillage
dataset for training our custom disease detection model.

PlantVillage Dataset:
- 87,000+ images of plant leaves
- 38 classes (diseases and healthy plants)
- Crops: Apple, Cherry, Corn, Grape, Peach, Pepper, Potato, Strawberry, Tomato
"""

import tensorflow as tf
from tensorflow.keras import layers
import tensorflow_datasets as tfds
import json
import os

# Image dimensions for MobileNetV2
IMG_SIZE = 224
BATCH_SIZE = 32

# Disease class labels
CLASS_LABELS = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Blueberry___healthy",
    "Cherry_(including_sour)___Powdery_mildew",
    "Cherry_(including_sour)___healthy",
    "Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Orange___Haunglongbing_(Citrus_greening)",
    "Peach___Bacterial_spot",
    "Peach___healthy",
    "Pepper,_bell___Bacterial_spot",
    "Pepper,_bell___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    "Raspberry___healthy",
    "Soybean___healthy",
    "Squash___Powdery_mildew",
    "Strawberry___Leaf_scorch",
    "Strawberry___healthy",
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites_Two-spotted_spider_mite",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy"
]

NUM_CLASSES = len(CLASS_LABELS)


def get_data_augmentation():
    """
    Create data augmentation pipeline.
    
    Data augmentation helps the model generalize better by creating
    variations of training images (flips, rotations, zoom, etc.)
    """
    return tf.keras.Sequential([
        layers.RandomFlip("horizontal"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.2),
        layers.RandomContrast(0.2),
        layers.RandomBrightness(0.2),
    ], name='data_augmentation')


def preprocess_image(image, label):
    """
    Preprocess a single image for model input.
    
    Steps:
    1. Resize to 224x224 (MobileNetV2 input size)
    2. Keep pixel range in [0, 255] for MobileNetV2 preprocess_input
    """
    # Resize image
    image = tf.image.resize(image, [IMG_SIZE, IMG_SIZE])
    
    # Keep [0, 255] because model.py uses mobilenet_v2.preprocess_input
    image = tf.cast(image, tf.float32)
    
    return image, label


def _compute_class_weights(train_ds, num_classes):
    """
    Compute inverse-frequency class weights for imbalanced classes.

    Args:
        train_ds: Batched dataset with one-hot labels
        num_classes: Total class count

    Returns:
        Dict mapping class index -> weight
    """
    counts = [0] * num_classes

    for _, labels in train_ds:
        # Labels are one-hot in this project pipeline
        label_indices = tf.argmax(labels, axis=1).numpy().tolist()
        for idx in label_indices:
            counts[int(idx)] += 1

    total = sum(counts)
    class_weights = {}

    # Balanced weighting: total / (num_classes * class_count)
    for class_idx, class_count in enumerate(counts):
        safe_count = max(class_count, 1)
        class_weights[class_idx] = total / (num_classes * safe_count)

    return class_weights


def load_plant_village_dataset(data_dir=None, compute_class_weights=True, batch_size=BATCH_SIZE):
    """
    Load the PlantVillage dataset.
    
    If data_dir is provided, loads from local directory.
    Otherwise, downloads from TensorFlow Datasets.
    
    Args:
        batch_size: Training batch size (lower if GPU memory is limited)
    Returns:
        train_dataset: Training data (80%)
        val_dataset: Validation data (20%)
        class_names: List of class labels
        class_weights: Dict for class balancing during fit()
    """
    print("Loading PlantVillage dataset...")
    
    if data_dir and os.path.exists(data_dir):
        # Load from local directory
        print(f"Loading from local directory: {data_dir}")
        
        train_ds = tf.keras.utils.image_dataset_from_directory(
            data_dir,
            validation_split=0.2,
            subset="training",
            seed=42,
            image_size=(IMG_SIZE, IMG_SIZE),
            batch_size=batch_size,
            label_mode='categorical'
        )
        
        val_ds = tf.keras.utils.image_dataset_from_directory(
            data_dir,
            validation_split=0.2,
            subset="validation",
            seed=42,
            image_size=(IMG_SIZE, IMG_SIZE),
            batch_size=batch_size,
            label_mode='categorical'
        )
        
        class_names = train_ds.class_names

        # Keep pixel range as float32 [0, 255] to match MobileNetV2 preprocess_input
        def cast_only(image, label):
            return tf.cast(image, tf.float32), label

        train_ds = train_ds.map(cast_only, num_parallel_calls=tf.data.AUTOTUNE)
        val_ds = val_ds.map(cast_only, num_parallel_calls=tf.data.AUTOTUNE)

        train_ds = train_ds.shuffle(10000, seed=42, reshuffle_each_iteration=True)

    else:
        # Download from TensorFlow Datasets
        print("Downloading PlantVillage dataset from TensorFlow Datasets...")
        
        # Load entire dataset, then make a deterministic shuffled 80/20 split
        full_ds, info = tfds.load(
            'plant_village',
            split='train',
            with_info=True,
            as_supervised=True,
            shuffle_files=True
        )

        total_examples = int(info.splits['train'].num_examples)
        train_size = int(total_examples * 0.8)

        full_ds = full_ds.shuffle(total_examples, seed=42, reshuffle_each_iteration=False)
        train_ds = full_ds.take(train_size)
        val_ds = full_ds.skip(train_size)
        
        class_names = CLASS_LABELS
        
        # Preprocess and batch
        train_ds = train_ds.map(preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)
        val_ds = val_ds.map(preprocess_image, num_parallel_calls=tf.data.AUTOTUNE)
        
        # Convert labels to one-hot encoding
        def one_hot_encode(image, label):
            return image, tf.one_hot(label, NUM_CLASSES)
        
        train_ds = train_ds.map(one_hot_encode)
        val_ds = val_ds.map(one_hot_encode)
        
        train_ds = train_ds.batch(batch_size)
        val_ds = val_ds.batch(batch_size)

        train_ds = train_ds.shuffle(10000, seed=42, reshuffle_each_iteration=True)

    class_weights = None
    if compute_class_weights:
        print("Computing class weights for imbalanced training...")
        class_weights = _compute_class_weights(train_ds, len(class_names))
    
    # Optimize for performance
    train_ds = train_ds.prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.prefetch(tf.data.AUTOTUNE)
    
    print(f"Dataset loaded successfully!")
    print(f"Number of classes: {len(class_names)}")
    
    return train_ds, val_ds, class_names, class_weights


def save_class_labels(output_path='class_labels.json'):
    """
    Save class labels to JSON file for use in browser inference.
    
    This mapping is used by TensorFlow.js to convert model predictions
    (class indices) to human-readable disease names.
    """
    # Create user-friendly labels
    labels_dict = {}
    for i, label in enumerate(CLASS_LABELS):
        # Convert "Tomato___Late_blight" to "Tomato Late Blight"
        friendly_name = label.replace("___", " - ").replace("_", " ").title()
        labels_dict[str(i)] = {
            "name": friendly_name,
            "original": label,
            "crop": label.split("___")[0].replace("_", " "),
            "condition": label.split("___")[1].replace("_", " ") if "___" in label else "Unknown"
        }
    
    with open(output_path, 'w') as f:
        json.dump(labels_dict, f, indent=2)
    
    print(f"Class labels saved to {output_path}")
    return labels_dict


if __name__ == "__main__":
    # Test dataset loading
    train_ds, val_ds, class_names, class_weights = load_plant_village_dataset()
    
    # Save class labels
    save_class_labels()
    
    # Print sample info
    for images, labels in train_ds.take(1):
        print(f"Batch shape: {images.shape}")
        print(f"Labels shape: {labels.shape}")
