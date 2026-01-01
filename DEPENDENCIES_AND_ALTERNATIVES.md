# Dependencies, Models, Services: Upgrades, Tweaks, and Alternatives

This document tracks all key technologies used in the project and provides:
- Current versions and purpose
- Common tweaks and configuration knobs
- Safe upgrade paths and caveats
- Viable alternatives (with trade‑offs)
- Running log of local modifications

Use this as a companion to backend requirements and frontend package.json when planning changes.

## Frontend

### Next.js
- Purpose: React app framework (routing, build, SSR/SSG).
- Current: next ^16.x (App Router).
- Key settings: `next.config.js` (images domains, headers), environment vars, `experimental` flags.
- Common tweaks:
  - Enable remote image domains for backend file serving.
  - Increase `images.deviceSizes` if you ship large thumbnails.
- Upgrade notes:
  - 14→15/16: App Router is default; ensure client components have `'use client'`. Check breaking ESLint rules and Turbopack defaults.
- Alternatives: Vite + React (faster cold starts, but no built‑in routing/SSR), Remix (strong SSR/loader model).

### React / React DOM
- Current: react ^19, react-dom ^19.
- Tweaks: Prefer functional components and hooks; suspense for data fetching via Next.js.
- Upgrade notes: Keep React and Next major versions aligned.
- Alternatives: Preact (smaller, but compatibility gaps), SolidStart (different paradigm).

### Tailwind CSS / PostCSS / Autoprefixer
- Purpose: Utility CSS.
- Tweaks: Configure design tokens via Tailwind config; consider `@tailwindcss/forms`.
- Upgrade notes: Follow Tailwind release notes; purge/content paths must include `app/**`.
- Alternatives: Vanilla Extract, CSS Modules, UnoCSS.

## Backend

### FastAPI
- Purpose: HTTP API (files, cloud, AI, training, settings).
- Tweaks:
  - Use `lifespan` context instead of `@app.on_event("startup")` (deprecation warning).
  - Add CORS to allow frontend at http://localhost:3000.
- Upgrade notes: Keep pydantic v2 compatible; check FastAPI release notes for deprecations.
- Alternatives: Starlette (lower level), Flask (simpler, fewer type features).

### Ultralytics (YOLOv8)
- Purpose: Object detection for tag suggestions.
- Current: ultralytics 8.x.
- Config knobs (exposed via settings API):
  - `detection_model` (e.g., yolov8n/s/m/l/x or custom .pt).
  - `detection_confidence` (0.1–0.9).
- Tweaks:
  - Use GPU if available by passing device in model call (future).
  - Warmup model at startup to reduce first‑request latency.
- Upgrade notes:
  - Check model name changes (e.g., v9 YOLO or YOLO-World). Verify `.names` field and outputs structure.
- Alternatives: 
  - YOLO-NAS, RT-DETR, Detectron2/Mask R-CNN (heavier), OpenVINO/ONNX exported models.

### rembg + onnxruntime
- Purpose: Background removal utility.
- Tweaks:
  - Use `onnxruntime-gpu` when CUDA available.
  - Batch images if you add bulk processing endpoints.
- Upgrade notes: Large onnxruntime wheels; pin to compatible versions with Python.
- Alternatives: carvekit, cvzone (wrappers), Segment Anything + matting (heavier but flexible).

### OpenCV (opencv-python)
- Purpose: Aux image operations.
- Tweaks: Avoid heavy cv2 GUI modules; keep operations minimal.
- Alternatives: Pillow/PIL, scikit-image (heavier), torchvision.

### Rclone (CLI) via `services.rclone`
- Purpose: Cloud storage access (list/serve files from remotes).
- Tweaks:
  - Use streaming via `rclone cat` for large files.
  - Consider signed HTTP (rclone serve http) for better perf.
- Upgrade notes: Users must have rclone installed and configured remotes.
- Alternatives: Native SDKs (S3/Azure/GCS), `boto3`, `azure-storage-blob`, `google-cloud-storage`.

## Settings and Configuration

- File: `backend/routers/settings.py` provides REST endpoints to read/write `../data/settings.json`.
- Model settings update live by calling `AIService.reload_model(model_path, confidence)`.
- Frontend UI: `app/settings/page.tsx` lets users pick pretrained YOLO or custom trained models discovered via `/training/models`.

## Training

- API: `backend/routers/training.py` (start/stop/status, list models in `../data/training_runs`).
- Frontend: `app/training/page.tsx` shows progress, logs, and discovered models.
- Tweaks:
  - Expose device (cpu/cuda:0), image size, optimizer if needed.
  - Persist training logs to file and stream via SSE/WebSocket for live UI.
- Alternatives: Lightning, KerasCV, MMDetection training stacks.

## Annotation UI

- File: `app/training/dataset/page.tsx` provides bounding box annotation with canvas overlay.
- Enhancements present:
  - Cloud vs Local source switch; loads via `/files/serve` or `/cloud/serve`.
  - AI tag suggestions with confidence ordering and quick apply.
- Future tweaks:
  - Zoom/pan, keyboard shortcuts, class list with colors, COCO/YOLO export options.

## Security & Ops

- Add CORS, rate limiting (slowapi) if exposed outside localhost.
- Consider `.env` management (python-dotenv) and secrets storage.
- For packaging: uv/poetry or pip-tools to lock backend dependencies.

## Upgrade Playbooks

- Frontend packages:
  1. `npm outdated` then bump in `package.json`.
  2. Run `npm run build` and fix TypeScript/ESLint issues.
- Backend packages:
  1. Pin new versions in `requirements.txt` (if added) or document in this file.
  2. Smoke test endpoints: `/ai/detect`, `/files/list`, `/cloud/*`, `/training/*`, `/settings/*`.
- AI models:
  1. Validate outputs schema (labels, boxes) and update frontend mapping if needed.
  2. Benchmark latency and accuracy after change.

## Alternatives Matrix (Quick Picks)

- Detection: Ultralytics YOLOv8 → Alt: RT-DETR (accuracy), YOLOv5 (stability), TensorRT engine (speed, GPU).
- Background removal: rembg → Alt: MODNet, U2-Net variants, SAM + matting.
- Cloud access: rclone → Alt: Native SDKs (if a single provider), S3 gateway.
- Frontend framework: Next.js → Alt: Vite + React (no SSR), Remix (SSR/Edge), SvelteKit.

## Local Modifications Log

- 2025-12-01
  - Backend: Added `routers/settings.py`; live model reload via `AIService.reload_model`.
  - Frontend: Improved annotation page with cloud serving switch, AI tag suggestions + confidences, and better error handling.
  - Frontend: Settings page now lists custom trained models from `/training/models`, supports selecting pretrained/custom paths, confidence slider.
  - Frontend: Training page shows progress, metrics, and refresh button for models.
  - Backend deps: Installed `ultralytics`, `rembg`, `onnxruntime`, `opencv-python`.

---
Maintainers: update this file whenever you change a dependency or swap a model/service. Keep entries concise with rationale and rollback plan.
