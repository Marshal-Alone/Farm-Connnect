"""
Training script for plant disease classification.

This script supports stronger transfer-learning backbones and two-stage training:
1) train classification head with frozen base
2) fine-tune selected layers with lower learning rate
"""

import os
import argparse
from datetime import datetime

import tensorflow as tf

from dataset import load_plant_village_dataset, save_class_labels
from model import (
    create_model,
    unfreeze_for_fine_tuning,
    print_model_summary,
    get_default_unfreeze_layers,
    get_supported_backbones,
)


def train_model(
    data_dir=None,
    epochs=15,
    fine_tune_epochs=10,
    output_dir="./saved_model",
    batch_size=32,
    unfreeze_layers=None,
    backbone="efficientnetb0",
    dense_units=None,
    dropout_rate=0.4,
):
    """
    Train and fine-tune the disease classifier.

    Args:
        data_dir: Local dataset path. If None, uses TensorFlow Datasets PlantVillage.
        epochs: Number of epochs for phase 1 (frozen backbone).
        fine_tune_epochs: Number of epochs for phase 2 (partial unfreeze).
        output_dir: Target directory for saved models and logs.
        batch_size: Mini-batch size.
        unfreeze_layers: Layers to unfreeze in phase 2 (None = auto per backbone).
        backbone: Transfer-learning backbone architecture.
        dense_units: Dense units in classifier head (None = recommended by backbone).
        dropout_rate: Dropout in classifier head.
    """
    print("\n" + "=" * 60)
    print("PLANT DISEASE CLASSIFICATION - TRAINING")
    print("=" * 60 + "\n")

    os.makedirs(output_dir, exist_ok=True)

    print("Step 1: Loading dataset...")
    print("-" * 40)
    train_ds, val_ds, class_names, class_weights = load_plant_village_dataset(
        data_dir=data_dir,
        batch_size=batch_size,
    )
    print(f"Classes: {len(class_names)}")
    if class_weights:
        print("Class balancing enabled (class_weight will be passed to model.fit)")
    print(f"Batch size: {batch_size}")
    print()

    if unfreeze_layers is None:
        unfreeze_layers = get_default_unfreeze_layers(backbone)
        print(f"Auto-selected unfreeze layers for {backbone}: {unfreeze_layers}")
    else:
        print(f"Using user-provided unfreeze layers: {unfreeze_layers}")
    print()

    print("Step 2: Creating model...")
    print("-" * 40)
    model, base_model = create_model(
        include_augmentation=True,
        backbone=backbone,
        dense_units=dense_units,
        dropout_rate=dropout_rate,
    )
    print_model_summary(model)
    print()

    print("Step 3: Configuring callbacks...")
    print("-" * 40)
    callbacks = [
        tf.keras.callbacks.ModelCheckpoint(
            filepath=os.path.join(output_dir, "best_model.keras"),
            monitor="val_accuracy",
            save_best_only=True,
            mode="max",
            verbose=1,
        ),
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=4,
            restore_best_weights=True,
            verbose=1,
        ),
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.2,
            patience=2,
            min_lr=1e-6,
            verbose=1,
        ),
        tf.keras.callbacks.CSVLogger(
            filename=os.path.join(output_dir, "training_log.csv"),
            append=False,
        ),
        tf.keras.callbacks.TensorBoard(
            log_dir=os.path.join(output_dir, "logs", datetime.now().strftime("%Y%m%d-%H%M%S")),
            histogram_freq=1,
        ),
    ]
    print("Callbacks configured.")
    print()

    print("Step 4: Phase 1 - transfer learning")
    print("-" * 40)
    print(f"Training {backbone} head for {epochs} epochs with frozen backbone...")
    history1 = model.fit(
        train_ds,
        epochs=epochs,
        validation_data=val_ds,
        callbacks=callbacks,
        class_weight=class_weights,
    )
    best_phase1 = max(history1.history.get("val_accuracy", [0.0]))
    print(f"Phase 1 complete. Best val_accuracy: {best_phase1:.4f}")
    print()

    print("Step 5: Phase 2 - fine tuning")
    print("-" * 40)
    print(f"Unfreezing last {unfreeze_layers} backbone layers for {fine_tune_epochs} epochs...")
    model = unfreeze_for_fine_tuning(
        model,
        base_model,
        num_layers_to_unfreeze=unfreeze_layers,
    )
    history2 = model.fit(
        train_ds,
        epochs=fine_tune_epochs,
        validation_data=val_ds,
        callbacks=callbacks,
        class_weight=class_weights,
    )
    best_phase2 = max(history2.history.get("val_accuracy", [0.0]))
    print(f"Phase 2 complete. Best val_accuracy: {best_phase2:.4f}")
    print()

    print("Step 6: Saving model artifacts")
    print("-" * 40)
    keras_path = os.path.join(output_dir, "plant_disease_model.keras")
    h5_path = os.path.join(output_dir, "plant_disease_model.h5")
    labels_path = os.path.join(output_dir, "class_labels.json")

    model.save(keras_path)
    model.save(h5_path)
    save_class_labels(labels_path)

    print(f"Saved Keras model: {keras_path}")
    print(f"Saved H5 model: {h5_path}")
    print(f"Saved class labels: {labels_path}")
    print()

    total_epochs = len(history1.history.get("loss", [])) + len(history2.history.get("loss", []))
    print("=" * 60)
    print("TRAINING COMPLETE")
    print("=" * 60)
    print(f"Backbone: {backbone}")
    print(f"Phase 1 best accuracy: {best_phase1:.2%}")
    print(f"Phase 2 best accuracy: {best_phase2:.2%}")
    print(f"Total epochs run: {total_epochs}")
    print("\nNext:")
    print("1) python ml/export.py --model ./saved_model/plant_disease_model.h5")
    print("2) Copy output files to frontend/public/models/plant-disease/")

    return model, history1, history2


def main():
    parser = argparse.ArgumentParser(description="Train plant disease classification model")

    parser.add_argument(
        "--data-dir",
        type=str,
        default=None,
        help="Path to local dataset directory (optional)",
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=15,
        help="Epochs for phase 1 (default: 15)",
    )
    parser.add_argument(
        "--fine-tune-epochs",
        type=int,
        default=10,
        help="Epochs for phase 2 (default: 10)",
    )
    parser.add_argument(
        "--output-dir",
        type=str,
        default="./saved_model",
        help="Output directory (default: ./saved_model)",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=32,
        help="Mini-batch size (default: 32). Use 16 if Colab runs out of memory.",
    )
    parser.add_argument(
        "--backbone",
        type=str,
        default="efficientnetb0",
        choices=get_supported_backbones(),
        help="Backbone architecture (default: efficientnetb0)",
    )
    parser.add_argument(
        "--unfreeze-layers",
        type=int,
        default=None,
        help="Layers to unfreeze in fine-tuning (default: auto per backbone)",
    )
    parser.add_argument(
        "--dense-units",
        type=int,
        default=None,
        help="Dense units in classifier head (default: auto per backbone)",
    )
    parser.add_argument(
        "--dropout-rate",
        type=float,
        default=0.4,
        help="Dropout rate in classifier head (default: 0.4)",
    )

    args = parser.parse_args()

    gpus = tf.config.list_physical_devices("GPU")
    if gpus:
        print(f"GPU detected: {gpus}")
    else:
        print("No GPU detected. Training on CPU will be slower.")
        print("Use Google Colab for faster training.")

    train_model(
        data_dir=args.data_dir,
        epochs=args.epochs,
        fine_tune_epochs=args.fine_tune_epochs,
        output_dir=args.output_dir,
        batch_size=args.batch_size,
        unfreeze_layers=args.unfreeze_layers,
        backbone=args.backbone,
        dense_units=args.dense_units,
        dropout_rate=args.dropout_rate,
    )


if __name__ == "__main__":
    main()
