# Plant Disease Detection ML Training

This directory contains the Python code for training our custom plant disease classification model.

---

## 🚀 Recommended: Train on Google Colab (Free GPU)

Local installation can have dependency conflicts. **Use Google Colab for hassle-free training!**

### Steps:

1. **Open Google Colab:** [colab.research.google.com](https://colab.research.google.com)

2. **Upload the notebook:**
   - Click **File → Upload notebook**
   - Select: `PlantDiseaseTraining.ipynb` (in this folder)

3. **Enable GPU:**
   - Go to **Runtime → Change runtime type**
   - Select **T4 GPU**
   - Click **Save**

4. **Run all cells:**
   - Click **Runtime → Run all**
   - Training takes ~35 minutes with GPU

5. **Download the model:**
   - The last cell auto-downloads `tfjs_model.zip`

6. **Extract and copy:**
   ```bash
   # Extract tfjs_model.zip and copy contents to:
   frontend/public/models/plant-disease/
   ```

7. **Test in app:**
   - Run `npm run dev`
   - Go to Settings → Select "Custom Model (Offline)"
   - Upload a plant image!

---

## ⚠️ Keras 3.x Compatibility Fix

If you see this error when loading the model:
```
An InputLayer should be passed either a 'batchInputShape' or an 'inputShape'
```

This is a Keras 3.x compatibility issue. **Re-export the model as a Graph Model** by adding this cell in Colab:

```python
# Re-export as Graph Model (compatible with browser TensorFlow.js)
import tensorflow as tf
import shutil

# Load the saved model
model = tf.keras.models.load_model('saved_model/plant_disease_model.keras')

# Save as SavedModel format first
model.export('saved_model/tfjs_export')

# Convert to TensorFlow.js Graph Model format
!tensorflowjs_converter \
    --input_format=tf_saved_model \
    --output_format=tfjs_graph_model \
    saved_model/tfjs_export \
    tfjs_graph_model/

# Copy labels 
shutil.copy('tfjs_model/labels.json', 'tfjs_graph_model/labels.json')

# Create new zip
shutil.make_archive('tfjs_graph_model', 'zip', 'tfjs_graph_model')

# Download
from google.colab import files
print("📥 Downloading tfjs_graph_model.zip...")
files.download('tfjs_graph_model.zip')
```

Then extract `tfjs_graph_model.zip` to `frontend/public/models/plant-disease/`.

---

## Alternative: Local Training (Advanced)

If you have a compatible environment:

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Train the model
python train.py

# 4. Export to TensorFlow.js
python export.py

# 5. Copy model to frontend
cp -r tfjs_model/* ../frontend/public/models/plant-disease/
```

> ⚠️ **Note:** Local training requires TensorFlow 2.15+ and may have dependency conflicts on Windows.

---

## Files

| File | Description |
|------|-------------|
| `PlantDiseaseTraining.ipynb` | **Google Colab notebook** (recommended) |
| `train.py` | Local training script |
| `model.py` | MobileNetV2 model architecture |
| `dataset.py` | PlantVillage data loader |
| `export.py` | TensorFlow.js converter |
| `requirements.txt` | Python dependencies |

---

## Model Details

| Property | Value |
|----------|-------|
| **Architecture** | MobileNetV2 + Custom Head |
| **Input Size** | 224×224 RGB |
| **Output** | 38 disease classes |
| **Model Size** | ~15MB |
| **Training Time** | ~35 min (GPU) |
| **Expected Accuracy** | ~95% |

---

## Dataset

**PlantVillage Dataset:**
- 87,000+ labeled images
- 38 disease/healthy classes
- 14 crop types: Apple, Cherry, Corn, Grape, Tomato, etc.

---

See `DOCS/ML/README.md` for detailed documentation.

