# Collectibles Log Book

**Collectibles Log Book** is a comprehensive web application for managing physical collections. It features AI-powered image recognition, background removal, multi-cloud storage integration, and a dedicated browser extension for marketplace connectivity.

## Core Features

### Implemented
- **AI-Powered Recognition:** Object detection using YOLOv8 and automated background removal via rembg.
- **Multi-Cloud Integration:** Seamless connectivity with OneDrive, Google Drive, iCloud, and Mega using Rclone.
- **Marketplace Bridge:** Dedicated Edge extension to sync eBay listing images and metadata directly into the log book.
- **Modern Dashboard:** Responsive Next.js frontend with dark mode, gallery density presets, and auto-optimization.
- **Persistence:** Robust SQLite database with SQLModel ORM.

### Roadmap
- [ ] **Image Enhancement:** Implementation of smart cropping and auto-alignment.
- [ ] **AI Correction UI:** Manual labeling interface for improving model accuracy.
- [ ] **Reverse Search:** Integration with image search APIs for market valuation.
- [ ] **Item Consolidation:** Tools to merge multiple photographs into a single catalog entry.
- [ ] **Social Integration:** Direct sharing to collectors' communities.

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Backend** | Python 3.13, FastAPI, SQLModel |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |
| **AI/ML** | YOLOv8, Rembg, OpenCV |
| **Storage** | SQLite, Rclone |
| **Extension** | Manifest V3 (Chrome/Edge) |

## Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- Rclone (optional)

### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # .venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## TODO List

- [ ] **Cleanup:** Remove duplicate documentation sections and consolidate project structure.
- [ ] **PWA Optimization:** Finalize service worker configuration for offline-first support.
- [ ] **Security:** Implement user authentication for the FastAPI backend.
- [ ] **Testing:** Add comprehensive Vitest suites for frontend components.
- [ ] **Deployment:** Setup GitHub Actions for automated deployment to Vercel or GitHub Pages.

## License

This project is licensed under the MIT License.
