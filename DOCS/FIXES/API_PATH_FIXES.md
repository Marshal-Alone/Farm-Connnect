# API Path Fixes

## Problem

Two issues were observed in production:

- `POST .../api/api/ai/analyze-crop` -> `404`
- `POST https://farmbro.vercel.app/api/diseases` -> `503`

Root cause: inconsistent `VITE_API_URL` formats and fragile API base concatenation.

## Fix Applied

Updated [api.ts](/c:/Users/marsh/OneDrive/Desktop/MAJOR PROJECT/Farm-Connnect/frontend/src/config/api.ts) to normalize API base URL:

- Removes trailing slashes
- Ensures **exactly one** `/api` suffix
- Accepts both:
  - `https://farm-connnect-bn0q.onrender.com`
  - `https://farm-connnect-bn0q.onrender.com/api`
- Adds production fallback backend origin if `VITE_API_URL` is missing

Final normalized shape is always:

`<origin>/api`

So calls like `${API_BASE_URL}/ai/analyze-crop` always become:

`<origin>/api/ai/analyze-crop`

## Expected Behavior Now

- No more `/api/api/...` duplication
- Vercel frontend will not default to same-origin `/api` in production if env is missing

## Deployment Note

You must rebuild and redeploy frontend after this change.  
The old bundle (`index-BB6SMSmR.js`) will continue calling old paths until redeployed.

## Quick Verification

In browser console:

- Look for: `[API] API_BASE_URL: .../api`
- Confirm request URL: `.../api/ai/analyze-crop` (single `/api`)
