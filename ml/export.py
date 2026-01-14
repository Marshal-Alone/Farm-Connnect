"""
Export trained model to TensorFlow.js format for browser deployment.

This script converts the trained Keras model to TensorFlow.js format,
which can be loaded and run in web browsers.

The output includes:
- model.json: Model architecture and metadata
- group1-shardXofY.bin: Model weights (sharded for efficient loading)

Usage:
    python export.py                              # Default paths
    python export.py --model ./saved_model/plant_disease_model.h5
    python export.py --quantize                   # Apply quantization
"""

import os
import argparse
import shutil
import json
import subprocess
import sys


def check_tensorflowjs():
    """Check if tensorflowjs_converter is installed."""
    try:
        result = subprocess.run(
            ['tensorflowjs_converter', '--version'],
            capture_output=True,
            text=True
        )
        print(f"✓ TensorFlow.js converter found: {result.stdout.strip()}")
        return True
    except FileNotFoundError:
        print("❌ TensorFlow.js converter not found!")
        print("Installing tensorflowjs...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'tensorflowjs'])
        return True


def export_to_tfjs(
    model_path='./saved_model/plant_disease_model.h5',
    output_dir='./tfjs_model',
    quantize=False
):
    """
    Convert Keras model to TensorFlow.js format.
    
    The conversion process:
    1. Load the trained Keras model
    2. Convert to TensorFlow.js LayersModel format
    3. Optionally quantize weights (reduces size by ~4x)
    4. Save as model.json + binary weight shards
    
    Args:
        model_path: Path to trained .h5 model
        output_dir: Directory for TensorFlow.js output
        quantize: Whether to apply weight quantization
    """
    
    print("\n" + "="*60)
    print("📦 EXPORTING MODEL TO TENSORFLOW.JS")
    print("="*60 + "\n")
    
    # Check prerequisites
    check_tensorflowjs()
    
    # Verify model exists
    if not os.path.exists(model_path):
        print(f"❌ Model not found: {model_path}")
        print("Please run train.py first to create the model.")
        return False
    
    print(f"📂 Input model: {model_path}")
    print(f"📂 Output directory: {output_dir}")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    # Build conversion command
    cmd = [
        'tensorflowjs_converter',
        '--input_format=keras',
        '--output_format=tfjs_layers_model',
    ]
    
    # Add quantization if requested
    if quantize:
        cmd.extend([
            '--quantize_uint8',  # Quantize weights to 8-bit
        ])
        print("🗜️ Quantization enabled (uint8)")
    
    # Add input and output paths
    cmd.extend([model_path, output_dir])
    
    print(f"\n🔄 Running converter...")
    print(f"   Command: {' '.join(cmd)}\n")
    
    # Run conversion
    result = subprocess.run(cmd, capture_output=True, text=True)
    
    if result.returncode != 0:
        print(f"❌ Conversion failed!")
        print(f"Error: {result.stderr}")
        return False
    
    print("✓ Conversion successful!\n")
    
    # Copy class labels to output directory
    labels_src = './saved_model/class_labels.json'
    labels_dst = os.path.join(output_dir, 'labels.json')
    
    if os.path.exists(labels_src):
        shutil.copy(labels_src, labels_dst)
        print(f"✓ Class labels copied to: {labels_dst}")
    else:
        print(f"⚠️ Class labels not found at {labels_src}")
        print("  Run train.py to generate class_labels.json")
    
    # List output files
    print("\n📁 Output files:")
    total_size = 0
    for file in sorted(os.listdir(output_dir)):
        file_path = os.path.join(output_dir, file)
        size = os.path.getsize(file_path)
        total_size += size
        print(f"   {file}: {size / 1024:.1f} KB")
    
    print(f"\n   Total size: {total_size / (1024*1024):.2f} MB")
    
    # Print next steps
    print("\n" + "="*60)
    print("🎉 EXPORT COMPLETE!")
    print("="*60)
    print(f"""
Next steps:

1. Copy the model files to your frontend:
   
   Copy the contents of '{output_dir}' to:
   'frontend/public/models/plant-disease/'

2. The model can now be loaded in the browser with:
   
   const model = await tf.loadLayersModel('/models/plant-disease/model.json');

Model files to copy:
{os.listdir(output_dir)}
    """)
    
    return True


def create_model_metadata(output_dir='./tfjs_model'):
    """
    Create additional metadata file for the model.
    
    This includes information useful for the frontend:
    - Model version
    - Input requirements
    - Class count
    - Creation date
    """
    
    metadata = {
        "name": "PlantDiseaseClassifier",
        "version": "1.0.0",
        "description": "CNN model for plant disease classification trained on PlantVillage dataset",
        "input": {
            "shape": [1, 224, 224, 3],
            "dtype": "float32",
            "preprocessing": "Normalize to [0, 1] by dividing by 255"
        },
        "output": {
            "shape": [1, 38],
            "dtype": "float32",
            "activation": "softmax",
            "description": "Probability distribution over 38 disease classes"
        },
        "classes": 38,
        "crops": [
            "Apple", "Blueberry", "Cherry", "Corn", "Grape",
            "Orange", "Peach", "Pepper", "Potato", "Raspberry",
            "Soybean", "Squash", "Strawberry", "Tomato"
        ],
        "trainingDataset": "PlantVillage",
        "architecture": "MobileNetV2 + Custom Classification Head",
        "framework": "TensorFlow.js"
    }
    
    metadata_path = os.path.join(output_dir, 'metadata.json')
    with open(metadata_path, 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print(f"✓ Metadata saved to: {metadata_path}")


def main():
    """Parse command line arguments and run export."""
    
    parser = argparse.ArgumentParser(description='Export model to TensorFlow.js')
    
    parser.add_argument(
        '--model',
        type=str,
        default='./saved_model/plant_disease_model.h5',
        help='Path to trained Keras model (.h5 format)'
    )
    
    parser.add_argument(
        '--output',
        type=str,
        default='./tfjs_model',
        help='Output directory for TensorFlow.js model'
    )
    
    parser.add_argument(
        '--quantize',
        action='store_true',
        help='Apply uint8 quantization to reduce model size'
    )
    
    args = parser.parse_args()
    
    success = export_to_tfjs(
        model_path=args.model,
        output_dir=args.output,
        quantize=args.quantize
    )
    
    if success:
        create_model_metadata(args.output)


if __name__ == "__main__":
    main()
