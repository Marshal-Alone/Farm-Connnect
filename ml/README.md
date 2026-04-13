# Plant Disease Model Training

This folder contains scripts and notebook assets for training your disease classifier.

## What is improved

- Better default training settings (class weights, label smoothing, fine-tuning).
- Stronger backbone option: `efficientnetb0`.
- Configurable training from CLI:
  - `--backbone`
  - `--unfreeze-layers`
  - `--dense-units`
  - `--dropout-rate`

## Quick start (Google Colab recommended)

1. Open [Google Colab](https://colab.research.google.com).
2. Use GPU runtime: `Runtime -> Change runtime type -> T4 GPU`.
3. Open notebook: `ml/TrainPlantDisease-Colab.ipynb`.
4. Run cells in order.

Detailed walkthrough: [`COLAB_TRAINING_GUIDE.md`](./COLAB_TRAINING_GUIDE.md)

## Local training

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r ml/requirements.txt
python ml/train.py --backbone efficientnetb0 --epochs 20 --fine-tune-epochs 12 --batch-size 16 --output-dir ml/saved_model_v2
python ml/export.py --model ml/saved_model_v2/plant_disease_model.h5 --output ml/tfjs_model_v2
```

Copy exported files to:

`frontend/public/models/plant-disease/`

## Backbone guidance

- `mobilenetv2`: faster, smaller model, easier for low-resource devices.
- `efficientnetb0`: stronger accuracy, slower training and inference.
- If GPU memory is limited, reduce `--batch-size` to `16` or `8`.

## Important

- Keep input pixels in `[0,255]` for this pipeline.
- Preprocessing is already inside the model graph.
- Use high-quality, real-field images for better real-world performance.
