# Colab Training Guide (Plant Disease Model)

This guide gives you a repeatable way to train a stronger model on Google Colab GPU.

## 1. Open Colab and enable GPU

1. Go to https://colab.research.google.com
2. Select `Runtime -> Change runtime type`
3. Set `Hardware accelerator` to `T4 GPU`

## 2. Get project files into Colab

Choose one approach:

- Option A (recommended): clone your GitHub repo in Colab.
- Option B: upload your project zip and extract under `/content`.

Your project root should look like:

`/content/Farm-Connnect/ml/train.py`

## 3. Install dependencies

```bash
%cd /content/Farm-Connnect
!python -m pip install --upgrade pip
!python -m pip install -r ml/requirements.txt
```

## 4. Train with a stronger backbone

Recommended strong config:

```bash
!python ml/train.py \
  --backbone efficientnetb0 \
  --epochs 20 \
  --fine-tune-epochs 12 \
  --batch-size 16 \
  --unfreeze-layers 80 \
  --output-dir ml/saved_model_colab
```

If GPU memory is tight, reduce:

- reduce `--batch-size` (for example `16` or `8`)
- or switch to `--backbone mobilenetv2`

## 5. Export for frontend

```bash
!python ml/export.py \
  --model ml/saved_model_colab/plant_disease_model.h5 \
  --output ml/tfjs_model_colab
```

## 6. Download and use in app

```bash
%cd /content/Farm-Connnect/ml
!python -c "import shutil; shutil.make_archive('tfjs_model_colab', 'zip', root_dir='.', base_dir='tfjs_model_colab')"
```

Then download `tfjs_model_colab.zip`, extract it, and copy contents to:

`frontend/public/models/plant-disease/`

## 7. Accuracy tips (important)

- Add real-field images from your target region and lighting conditions.
- Keep class balance as even as possible.
- Remove blurry/noisy/wrong-label images.
- Do not evaluate using images seen during training.
- Track confusion matrix by crop and disease before deployment.
