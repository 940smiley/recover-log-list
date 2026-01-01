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
  
- **Frontend (Next.js + TailwindCSS)**
  - Modern, responsive UI with sidebar navigation
  - Import page for local directory browsing
  - Gallery page with category and status filtering
  - Dark mode support

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
