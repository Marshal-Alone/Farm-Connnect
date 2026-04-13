"""
Transfer-learning model definitions for plant disease classification.

Supported backbones:
- mobilenetv2: fast and lightweight
- efficientnetb0: higher capacity, usually better validation accuracy
"""

import tensorflow as tf
from tensorflow.keras import layers, Model
from tensorflow.keras.applications import MobileNetV2, EfficientNetB0

from dataset import IMG_SIZE, NUM_CLASSES, get_data_augmentation


SUPPORTED_BACKBONES = {
    "mobilenetv2": {
        "builder": MobileNetV2,
        "preprocess": tf.keras.applications.mobilenet_v2.preprocess_input,
        "default_unfreeze_layers": 40,
        "recommended_dense_units": 256,
    },
    "efficientnetb0": {
        "builder": EfficientNetB0,
        "preprocess": tf.keras.applications.efficientnet.preprocess_input,
        "default_unfreeze_layers": 80,
        "recommended_dense_units": 384,
    },
}


def get_supported_backbones():
    """Return supported backbone names."""
    return tuple(SUPPORTED_BACKBONES.keys())


def get_default_unfreeze_layers(backbone="mobilenetv2"):
    """Return recommended fine-tuning depth for the selected backbone."""
    key = str(backbone).lower()
    if key not in SUPPORTED_BACKBONES:
        supported = ", ".join(get_supported_backbones())
        raise ValueError(f"Unsupported backbone '{backbone}'. Supported: {supported}")
    return SUPPORTED_BACKBONES[key]["default_unfreeze_layers"]


def _compile_model(model, learning_rate):
    """
    Compile model with stable multiclass configuration.

    - label smoothing reduces over-confidence
    - top-3 metric helps monitor near misses
    """
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=learning_rate),
        loss=tf.keras.losses.CategoricalCrossentropy(label_smoothing=0.05),
        metrics=[
            "accuracy",
            tf.keras.metrics.TopKCategoricalAccuracy(k=3, name="top3_accuracy"),
        ],
    )


def create_model(
    include_augmentation=True,
    backbone="mobilenetv2",
    dense_units=None,
    dropout_rate=0.4,
):
    """
    Create a plant disease classifier with configurable backbone.

    Args:
        include_augmentation: Whether to apply augmentation layer.
        backbone: Backbone architecture name.
        dense_units: Dense units in classifier head (None uses backbone default).
        dropout_rate: Dropout rate in classifier head.

    Returns:
        Tuple of (compiled model, base_model)
    """
    key = str(backbone).lower()
    if key not in SUPPORTED_BACKBONES:
        supported = ", ".join(get_supported_backbones())
        raise ValueError(f"Unsupported backbone '{backbone}'. Supported: {supported}")

    config = SUPPORTED_BACKBONES[key]
    dense_units = dense_units or config["recommended_dense_units"]

    inputs = layers.Input(shape=(IMG_SIZE, IMG_SIZE, 3), name="input_image")
    x = inputs

    if include_augmentation:
        x = get_data_augmentation()(x)

    # Input is expected in [0,255]; preprocessing is part of model graph.
    x = config["preprocess"](x)

    base_model = config["builder"](
        weights="imagenet",
        include_top=False,
        input_shape=(IMG_SIZE, IMG_SIZE, 3),
    )
    base_model.trainable = False

    x = base_model(x, training=False)
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(x)
    x = layers.Dense(
        dense_units,
        kernel_regularizer=tf.keras.regularizers.l2(1e-4),
        name="fc1",
    )(x)
    x = layers.BatchNormalization(name="fc1_bn")(x)
    x = layers.Activation("relu", name="fc1_relu")(x)
    x = layers.Dropout(dropout_rate, name="dropout")(x)
    outputs = layers.Dense(NUM_CLASSES, activation="softmax", name="predictions")(x)

    model = Model(inputs, outputs, name=f"PlantDiseaseClassifier_{key}")
    _compile_model(model, learning_rate=0.001)
    return model, base_model


def unfreeze_for_fine_tuning(model, base_model, num_layers_to_unfreeze=40):
    """
    Unfreeze selected trailing layers of the backbone for fine-tuning.
    """
    base_model.trainable = True
    total_layers = len(base_model.layers)
    num_layers_to_unfreeze = int(max(1, min(num_layers_to_unfreeze, total_layers)))

    for layer in base_model.layers[:-num_layers_to_unfreeze]:
        layer.trainable = False

    _compile_model(model, learning_rate=0.0001)

    print(f"Fine-tuning enabled: {num_layers_to_unfreeze} layers unfrozen")
    print(f"Total trainable weights: {len(model.trainable_weights)}")
    return model


def create_inference_model(trained_model, backbone="mobilenetv2"):
    """
    Create inference model without augmentation and copy learned weights.
    """
    weights = trained_model.get_weights()
    inference_model, _ = create_model(include_augmentation=False, backbone=backbone)
    inference_model.set_weights(weights)
    return inference_model


def print_model_summary(model):
    """Print detailed architecture and parameter counts."""
    print("\n" + "=" * 60)
    print("PLANT DISEASE CLASSIFICATION MODEL")
    print("=" * 60)
    model.summary()

    print("\n" + "-" * 60)
    print("LAYER BREAKDOWN")
    print("-" * 60)

    trainable_count = 0
    non_trainable_count = 0

    for layer in model.layers:
        trainable = sum(tf.keras.backend.count_params(w) for w in layer.trainable_weights)
        non_trainable = sum(tf.keras.backend.count_params(w) for w in layer.non_trainable_weights)
        trainable_count += trainable
        non_trainable_count += non_trainable
        status = "Trainable" if layer.trainable else "Frozen"
        print(f"{layer.name:30} | {status:10} | Params: {trainable + non_trainable:,}")

    print("-" * 60)
    print(f"Total trainable params: {trainable_count:,}")
    print(f"Total non-trainable params: {non_trainable_count:,}")
    print(f"Total params: {trainable_count + non_trainable_count:,}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    model, base_model = create_model(backbone="efficientnetb0")
    print_model_summary(model)
    model = unfreeze_for_fine_tuning(
        model,
        base_model,
        num_layers_to_unfreeze=get_default_unfreeze_layers("efficientnetb0"),
    )
    print(f"Trainable layers: {sum(1 for layer in model.layers if layer.trainable)}")
