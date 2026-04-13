# Findings & Decisions

## Requirements
- User requested a complete understanding of the Farm-Connnect project.
- User requested reading git commits and all files.
- User requested internet/web usage as part of research.
- User plans to provide thesis-related college files afterward for additional analysis.
- Final downstream deliverable will be a professional BTech major-project thesis.

## Research Findings
- Repository currently has 250 git-tracked files.
- Top-level structure includes: `.github`, `backend`, `frontend`, `ml`, `DOCS`, `scripts`, `ui-3d-landing`, plus deployment/config files.
- Branch state: `main...origin/main` with local modifications in `frontend/tsconfig.app.json` and `frontend/tsconfig.json`.
- Commit history contains 46 commits spanning `2025-09-14` to `2026-02-10`.
- Main contribution identity appears under two emails for the same author name (`Itachi`), plus 2 commits by `Marshal Alone`.
- High-level evolution themes from commit subjects:
  - Initial setup + deployment (Vercel/Render)
  - UI/auth/pwa improvements
  - Disease detection enhancements
  - AI integrations (Groq/Gemini, voice assistant)
  - Rental, weather dashboard, messaging
  - Project restructuring (frontend/backend split), Docker support, SEO/doc assets
- Key milestone commits (architecture-relevant):
  - `9d9877a` (2025-11-29): "Rental System" introduced major backend API surface, marketplace flows, schemas, payment/messaging components.
  - `4576a7b` (2025-11-25): removed temporary `#working` and keepalive artifacts; introduced explicit AI provider abstraction with `src/lib/ai.ts` + `groq.ts`.
  - `1d46d70` (2026-01-03): major messaging/review stack rewrite; added diseases/schemes API and removed older review modules.
  - `274403e` (2026-01-12): monorepo re-organization into `frontend/` and `backend/`; deployment configs cleaned.
  - `0e3e86a` (2026-01-14): custom plant-disease model integration (client model shards + `ml/` training pipeline) and large doc restructure.
  - `5af3b10` (2026-01-15): AI key-security hardening via backend AI proxy (`backend/api/ai.js`) and hybrid vision engine changes.
  - `5f60476` (2026-01-13): Docker + docker-compose + updated deployment docs/workflow.
  - `6e4ac3c` (2026-01-22): broad SEO migration with metadata assets and new `frontend/src/components/SEO.tsx`.
  - `71709dc` (2026-02-10): recent UI cleanup in credits and disease detection page.
- Full tracked text-file read pass completed:
  - 198 readable tracked files
  - 52 binary/non-readable tracked assets cataloged
  - ~44,026 lines processed from readable tracked files
- Tracked binary documents (`.pdf`, `.pptx`, `.docx`) were additionally parsed into extracted text artifacts (7 files).
- Additional untracked thesis-template artifacts were found under `project_audit/0 Thesis/` and parsed separately (including legacy `.doc`/`.ppt` heuristic extraction).
- Build verification result:
  - `npm run build` succeeds
  - Vite warns about large bundle chunk size (~2.5MB JS output)
  - npm audit output reports 12 vulnerabilities in dependency graph
- Notable code-level risks identified:
  - `backend/index.js` health endpoints reference `serverHealth` while its declaration is commented out
  - `backend/config/database.js` includes hardcoded MongoDB fallback URI credentials
  - Frontend stores auth/API keys in localStorage (higher XSS blast radius)
  - `frontend/src/lib/payment/paymentService.ts` calls `/api/payment/*` routes that are not mounted in backend
  - Legacy/duplicate UI artifacts remain (`NotFoundPage.tsx`, `UserProfile_WITH_DASHBOARD.tsx`)

## Technical Decisions
| Decision | Rationale |
|----------|-----------|
| Use `git ls-files` as canonical file list | Captures all maintained project files in scope |
| Pair commit analysis with module analysis | Links historical intent to current implementation |
| Parse tracked binary docs with extractor pipeline | Prevents missing thesis-relevant content hidden in PDF/PPTX/DOCX |
| Run production build before synthesis | Anchors understanding with current executable state |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| `awk` unavailable in PowerShell for git numstat aggregation | Replaced with native PowerShell aggregation |
| Binary extraction scope initially included `.venv` artifacts | Re-scoped extraction to `git ls-files` tracked docs only |

## Resources
- Local repo: `c:\Users\marsh\OneDrive\Desktop\MAJOR PROJECT\Farm-Connnect`
- Git metadata baseline: `git status --short --branch`, `git ls-files`.
- Commit timeline source: `git log --date=short --pretty=format:"%h|%ad|%an|%s" --reverse`.
- Audit artifacts:
  - `project_audit/system_understanding_report.md`
  - `project_audit/commit_analysis.md`
  - `project_audit/coverage_report.md`
  - `project_audit/docs_digest.md`
  - `project_audit/tracked_binary_doc_extracts.md`
  - `project_audit/thesis_templates_extract.md`

## Visual/Browser Findings
- External references validated for thesis grounding:
  - https://console.groq.com/docs/vision
  - https://console.groq.com/docs/changelog
  - https://ai.google.dev/gemini-api/docs/vision
  - https://www.weatherapi.com/docs/
  - https://www.tensorflow.org/datasets/catalog/plant_village
  - https://www.tensorflow.org/js/guide/save_load
  - https://arxiv.org/abs/1801.04381
  - https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition
  - https://www.mongodb.com/docs/current/reference/connection-string/
  - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html
  - https://expressjs.com/en/advanced/best-practice-security
  - https://www.trai.gov.in/sites/default/files/2025-07/YIR_08072025.pdf

---
*Update this file after every 2 view/browser/search operations*
