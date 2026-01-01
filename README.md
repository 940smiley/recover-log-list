# Collectibles Log Book

A comprehensive web application for managing collectibles with AI-powered image recognition, cloud storage integration, and marketplace connectivity.

## 🚀 Features

### ✅ Implemented
- **Backend API (FastAPI)**
  - Local file system browsing and management
  - Cloud storage integration via Rclone wrapper (OneDrive, Google Drive, iCloud, Mega)
  - AI-powered object detection using YOLOv8
  - Background removal using rembg
  - SQLite database with SQLModel ORM
  - Edge eBay bridge endpoint `/integrations/edge-ebay/link` that saves listing images, merges scraped specs, and feeds training ingest

- **Frontend (Next.js + TailwindCSS)**
  - Modern, responsive UI with sidebar navigation
  - Import page for local directory browsing
  - Gallery page with category/search filters, adjustable columns, density presets, and auto-optimization tuned to device specs
  - Dark mode support and image fit/metadata toggles for compact or detailed layouts
  - PWA-ready with manifest + service worker for GitHub Pages/offline viewing

### 🚧 In Progress
- Image enhancement (cropping, smart crop, auto-crop)
- AI correction UI for manual labeling
- Reverse image search integration
- Item consolidation (merge multiple photos into one item)

### 📋 Planned
- Social media integration for sharing
- eBay marketplace listing integration
- Batch processing
- Advanced gallery features

## 🛠️ Tech Stack

- **Backend**: Python 3.13, FastAPI, SQLModel, Ultralytics YOLO, Rembg
- **Frontend**: Next.js 16, React, TailwindCSS, TypeScript
- **Database**: SQLite
- **AI/ML**: YOLOv8 (object detection), Rembg (background removal)
- **Cloud**: Rclone (multi-cloud support)

## 🔍 Dependency Map (Auto-generated)

- **Backend**: FastAPI, SQLModel, Uvicorn, Ultralytics (YOLOv8), OpenCV, Pillow, Rembg, NumPy, Requests
- **Frontend**: Next.js 16, React 19, TailwindCSS 4, TypeScript 5, ESLint
- **Tooling**: PostCSS, Autoprefixer, Type definitions for React/Node

## 🧭 Feature Overview & Component Summary

- **Dashboard (frontend/app/page.tsx)**: Presents stats, recent items, and quick actions with serene gradients.
- **Layout (frontend/app/layout.tsx)**: Global shell with Sidebar/Header chrome and gradient-backed canvas.
- **Navigation (frontend/components/Sidebar.tsx & Header.tsx)**: Modernized sidebar with active states and a glassy top bar.
- **Backend Services**: FastAPI routers coordinate AI detection (backend/routers/ai.py), item import (backend/routers/items.py), and training (backend/routers/training.py) using services in backend/services/ai.py and backend/services/training.py.

## ⚡ Setup Quickstart (Auto-detected)

1. **Backend**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # or .venv\Scripts\activate on Windows
   pip install -r requirements.txt
   uvicorn main:app --reload --port 8000
   ```
2. **Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. Visit `http://localhost:3000` with the backend available at `http://localhost:8000`.

## 📦 Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Rclone (optional, for cloud storage)

### Backend Setup
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

## 🚀 Running the Application

### Start Backend
```bash
cd backend
.venv\Scripts\uvicorn main:app --reload --port 8000
```

### Start Frontend
```bash
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

### PWA and GitHub Pages
- The app ships with `/manifest.json` and `/sw.js` so you can install it or run it offline. When deployed to GitHub Pages, keep assets in the root or `/docs` so the service worker scope remains `/`.
- The layout registers the service worker automatically when supported. Clear old registrations if you adjust domains.

## 📁 Project Structure

```
Recover-Log-List/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── database.py          # Database configuration
│   ├── models.py            # SQLModel data models
│   ├── routers/
│   │   ├── files.py         # Local file management endpoints
│   │   ├── cloud.py         # Cloud storage endpoints
│   │   └── ai.py            # AI processing endpoints
│   ├── services/
│   │   ├── rclone.py        # Rclone wrapper service
│   │   └── ai.py            # AI/ML service (YOLO, Rembg)
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with sidebar
│   │   ├── page.tsx         # Dashboard
│   │   ├── import/          # Import page
│   │   └── gallery/         # Gallery page
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── package.json
└── data/                    # SQLite database and logs
```

## 🔌 API Endpoints

### Files
- `GET /files/list?path={path}` - List files in a directory

### Cloud
- `GET /cloud/remotes` - List configured Rclone remotes
- `GET /cloud/files?remote={remote}&path={path}` - List files from cloud storage

### AI
- `POST /ai/detect` - Detect objects in an image
- `POST /ai/remove-bg` - Remove background from an image

### Integrations
- `POST /integrations/edge-ebay/link` - Attach scraped eBay listing data from the Edge extension to an item, save the listing image, tag specs, and (optionally) drop a copy into `data/training_ingest` while triggering training.

## 🧩 Edge eBay extension
- Location: `extensions/edge-ebay-search`
- How to use: enable Developer Mode in Edge (`edge://extensions`), choose **Load unpacked**, and pick the folder. Configure the API base and target item ID in the options page, then right-click eBay images to sync them into the app. See the extension README in that folder for the full flow.

## 🎯 Next Steps

1. **Configure Rclone** (optional)
   ```bash
   rclone config
   ```
   Follow the prompts to add your cloud storage accounts.

2. **Import Your First Items**
   - Navigate to the Import page
   - Enter a local directory path
   - Select images to import

3. **Extend Functionality**
   - Implement item detail/edit views
   - Add batch processing
   - Integrate social media APIs
   - Connect eBay API for listings

## 📝 Notes

- All dependencies are OSS/Free
- Images are copied to a log directory during import
- AI models download automatically on first use
- The application runs entirely locally

## 🤝 Contributing

This is a personal project for managing collectibles. Feel free to fork and customize for your needs!

### Contribution Guidelines
- Use feature branches named `codex/<feature>` for new work.
- Run backend and frontend tests or linters before opening a PR and record results in `TEST_RESULTS.md`.
- Keep API and UI changes documented in `CHANGELOG.md` and update the README if setup steps change.
- Prefer incremental, focused PRs with clear descriptions of user-facing improvements.
## 🧭 Contribution Guidelines

- Use feature branches and include concise summaries in pull requests.
- Run `npm run lint` for frontend changes and relevant backend checks before submitting.
- Keep UI updates consistent with the modern, serene Swan-inspired aesthetic.
- Add documentation updates alongside feature work when behavior changes.

## 🌐 GitHub Pages

Pages hosting is not currently enabled. Recommend publishing documentation from the `main` branch (or `/docs` folder if created) using GitHub Pages for quick previews.

---

*Last enhanced by Codex on 2025-12-06 15:18 UTC.*

## 📄 License

MIT License - Free to use and modify

---

## 📊 Dependency Map
| Layer | Dependency | Version/Notes | Purpose |
| --- | --- | --- | --- |
| Backend | FastAPI | requirements.txt (latest compatible) | HTTP API and routing |
| Backend | SQLModel + SQLite | requirements.txt | ORM and persistence |
| Backend | Ultralytics YOLO, rembg, OpenCV, Pillow, numpy | requirements.txt | Detection, background removal, and image processing |
| Frontend | Next.js 16, React 19, TypeScript 5.9 | package.json | Web UI, routing, and typing |
| Frontend | Tailwind CSS 4 | package.json | Styling system |
| Tooling | ESLint (Next config) | package.json | Static analysis and linting |

## 🧭 Architecture & Components
- **API Layer (backend/main.py + routers)**: FastAPI entry point serving item, AI, file, and cloud routes with SQLModel-based persistence.
- **Data Models (backend/models.py)**: Item, Image, Category, Tag, and logging models with relationships for eager loading.
- **AI & Image Services (backend/services)**: YOLO-driven detection plus rembg/OpenCV pipelines for collectibles-focused preprocessing.
- **Frontend App (frontend/app)**: Next.js pages for dashboard, import, gallery, and item details; Tailwind-driven layout and navigation.
- **Data Storage (data/)**: SQLite database file and imported image logs.

## 🛠️ Quick Start Checklist
1. Install backend deps: `python -m venv .venv && .venv/Scripts/activate` then `pip install -r backend/requirements.txt`.
2. Install frontend deps: `cd frontend && npm install`.
3. Run servers: `uvicorn main:app --host 0.0.0.0 --port 8000` (backend) and `npm run dev` (frontend).
4. Configure `NEXT_PUBLIC_API_BASE_URL` if the backend is not on `http://localhost:8000`.
5. Import images from the Import page and confirm thumbnails in the Gallery.

## 🌐 GitHub Pages
This project is server-rendered, but you can document the app via GitHub Pages by publishing a `/docs` folder or README snapshot using the guidance in `GitHubPagesSetup.md`.

## 🏷️ Last enhanced by Codex
Updated on 2025-12-01 06:08 UTC
