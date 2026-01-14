"""
Training script for plant disease classification model.

This is the main entry point for training the CNN model.
It orchestrates:
1. Loading and preprocessing the PlantVillage dataset
2. Creating the MobileNetV2-based model
3. Training with transfer learning
4. Fine-tuning for improved accuracy
5. Saving the trained model

Usage:
    python train.py                    # Full training
    python train.py --epochs 5         # Custom epochs
    python train.py --data-dir ./data  # Custom data directory
"""

import os
import argparse
import tensorflow as tf
from datetime import datetime

from dataset import load_plant_village_dataset, save_class_labels
from model import create_model, unfreeze_for_fine_tuning, print_model_summary


def train_model(data_dir=None, epochs=10, fine_tune_epochs=5, output_dir='./saved_model'):
    """
    Main training function.
    
    Training happens in two phases:
    
    Phase 1: Transfer Learning (frozen base)
    - Train only the custom classification layers
    - MobileNetV2 weights are frozen
    - Higher learning rate (0.001)
    
    Phase 2: Fine-Tuning (partial unfreeze)
    - Unfreeze last 20 layers of MobileNetV2
    - Train with lower learning rate (0.0001)
    - Allows model to adapt features to our task
    
    Args:
        data_dir: Path to local dataset (or None to download)
        epochs: Number of epochs for Phase 1
        fine_tune_epochs: Number of epochs for Phase 2
        output_dir: Where to save the trained model
    """
    
    print("\n" + "="*60)
    print("🌱 PLANT DISEASE CLASSIFICATION - TRAINING")
    print("="*60 + "\n")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Step 1: Load Dataset
    print("📂 Step 1: Loading Dataset...")
    print("-"*40)
    train_ds, val_ds, class_names = load_plant_village_dataset(data_dir)
    print(f"✓ Classes: {len(class_names)}")
    print()
    
    # Step 2: Create Model
    print("🧠 Step 2: Creating Model...")
    print("-"*40)
    model, base_model = create_model(include_augmentation=True)
    print_model_summary(model)
    print()
    
    # Step 3: Setup Callbacks
    print("⚙️ Step 3: Setting up training callbacks...")
    print("-"*40)
    
    callbacks = [
        # Save best model based on validation accuracy
        tf.keras.callbacks.ModelCheckpoint(
            filepath=os.path.join(output_dir, 'best_model.keras'),
            monitor='val_accuracy',
            save_best_only=True,
            mode='max',
            verbose=1
        ),
        
        # Early stopping if validation loss doesn't improve
        tf.keras.callbacks.EarlyStopping(
            monitor='val_loss',
            patience=3,
            restore_best_weights=True,
            verbose=1
        ),
        
        # Reduce learning rate when plateauing
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.2,
            patience=2,
            min_lr=1e-6,
            verbose=1
        ),
        
        # TensorBoard logging
        tf.keras.callbacks.TensorBoard(
            log_dir=os.path.join(output_dir, 'logs', datetime.now().strftime("%Y%m%d-%H%M%S")),
            histogram_freq=1
        )
    ]
    print("✓ Callbacks configured: ModelCheckpoint, EarlyStopping, ReduceLROnPlateau, TensorBoard")
    print()
    
    # Step 4: Phase 1 - Transfer Learning
    print("🚀 Step 4: Phase 1 - Transfer Learning")
    print("-"*40)
    print(f"Training for {epochs} epochs with frozen MobileNetV2 base...")
    print()
    
    history1 = model.fit(
        train_ds,
        epochs=epochs,
        validation_data=val_ds,
        callbacks=callbacks
    )
    
    print("\n✓ Phase 1 Complete!")
    print(f"  Best validation accuracy: {max(history1.history['val_accuracy']):.4f}")
    print()
    
    # Step 5: Phase 2 - Fine-Tuning
    print("🎯 Step 5: Phase 2 - Fine-Tuning")
    print("-"*40)
    print(f"Unfreezing last 20 layers for {fine_tune_epochs} epochs...")
    print()
    
    model = unfreeze_for_fine_tuning(model, base_model, num_layers_to_unfreeze=20)
    
    history2 = model.fit(
        train_ds,
        epochs=fine_tune_epochs,
        validation_data=val_ds,
        callbacks=callbacks
    )
    
    print("\n✓ Phase 2 Complete!")
    print(f"  Final validation accuracy: {max(history2.history['val_accuracy']):.4f}")
    print()
    
    # Step 6: Save Final Model
    print("💾 Step 6: Saving Final Model...")
    print("-"*40)
    
    # Save in Keras format
    model_path = os.path.join(output_dir, 'plant_disease_model.keras')
    model.save(model_path)
    print(f"✓ Model saved to: {model_path}")
    
    # Also save in H5 format for TensorFlow.js conversion
    h5_path = os.path.join(output_dir, 'plant_disease_model.h5')
    model.save(h5_path)
    print(f"✓ H5 format saved to: {h5_path}")
    
    # Save class labels
    labels_path = os.path.join(output_dir, 'class_labels.json')
    save_class_labels(labels_path)
    print(f"✓ Class labels saved to: {labels_path}")
    
    # Step 7: Print Final Summary
    print("\n" + "="*60)
    print("🎉 TRAINING COMPLETE!")
    print("="*60)
    print(f"""
Summary:
  - Model saved to: {output_dir}
  - Phase 1 accuracy: {max(history1.history['val_accuracy']):.2%}
  - Phase 2 accuracy (fine-tuned): {max(history2.history['val_accuracy']):.2%}
  - Total epochs: {len(history1.history['loss']) + len(history2.history['loss'])}

Next steps:
  1. Run: python export.py
     (Converts model to TensorFlow.js format)
  
  2. Copy the tfjs_model folder to:
     frontend/public/models/plant-disease/
    """)
    
    return model, history1, history2


def main():
    """Parse command line arguments and run training."""
    
    parser = argparse.ArgumentParser(description='Train plant disease classification model')
    
    parser.add_argument(
        '--data-dir',
        type=str,
        default=None,
        help='Path to local PlantVillage dataset (downloads if not provided)'
    )
    
    parser.add_argument(
        '--epochs',
        type=int,
        default=10,
        help='Number of training epochs for Phase 1 (default: 10)'
    )
    
    parser.add_argument(
        '--fine-tune-epochs',
        type=int,
        default=5,
        help='Number of fine-tuning epochs for Phase 2 (default: 5)'
    )
    
    parser.add_argument(
        '--output-dir',
        type=str,
        default='./saved_model',
        help='Directory to save the trained model (default: ./saved_model)'
    )
    
    args = parser.parse_args()
    
    # Check GPU availability
    gpus = tf.config.list_physical_devices('GPU')
    if gpus:
        print(f"🎮 GPU detected: {gpus}")
        print("Training will use GPU acceleration!")
    else:
        print("⚠️ No GPU detected. Training will use CPU (slower).")
        print("Consider using Google Colab for faster training.")
    
    # Run training
    train_model(
        data_dir=args.data_dir,
        epochs=args.epochs,
        fine_tune_epochs=args.fine_tune_epochs,
        output_dir=args.output_dir
    )


if __name__ == "__main__":
    main()
