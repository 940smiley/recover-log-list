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

## 📄 License

MIT License - Free to use and modify
