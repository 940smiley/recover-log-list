# Test Script for Collectibles Log Book

This script demonstrates the complete import workflow.

## Prerequisites
1. Backend server running on http://localhost:8000
2. Frontend server running on http://localhost:3000
3. A directory with some test images

## Test Steps

### 1. Test Backend Endpoints
```bash
# Test root endpoint
curl http://localhost:8000/

# Test file listing (replace with your path)
curl "http://localhost:8000/files/list?path=C:\Pictures"

# Test AI detection (with an image file)
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/ai/detect

# Test background removal
curl -X POST -F "file=@test_image.jpg" http://localhost:8000/ai/remove-bg --output removed_bg.png
```

### 2. Test Import Workflow
1. Navigate to http://localhost:3000/import
2. Enter a directory path with images
3. Click "Browse" to list images
4. Select one or more images
5. Optionally enter a category (e.g., "Comic Books")
6. Optionally check "Delete original files"
7. Click "Import X Selected"
8. Verify success message with detection counts

### 3. Test Gallery
1. Navigate to http://localhost:3000/gallery
2. Verify imported items are displayed
3. Click on an item to view details

### 4. Test Item Detail
1. From gallery, click on an item
2. Verify item details are displayed
3. Click "Edit" to modify name/description
4. Click "Save" to update
5. Click "Reprocess AI" to re-run detection
6. Click "Delete" to remove item

## Expected Results

- ✅ Images are copied to `data/logs/` directory
- ✅ Database records created in `data/database.db`
- ✅ AI detections stored in item description
- ✅ Tags created from detected objects
- ✅ Original files deleted if option selected
- ✅ Items visible in gallery
- ✅ Item details editable
- ✅ Reprocessing updates detections

## Database Inspection

To inspect the database:
```bash
cd backend
.venv\Scripts\python

>>> from sqlmodel import Session, select
>>> from database import engine
>>> from models import Item, Image, Category, Tag
>>> 
>>> with Session(engine) as session:
...     items = session.exec(select(Item)).all()
...     for item in items:
...         print(f"{item.id}: {item.name} - {len(item.images)} images")
```

## Troubleshooting

### Import fails
- Check backend logs for errors
- Verify file paths are correct
- Ensure images are valid formats (jpg, png, gif, webp)

### AI detection not working
- Verify YOLOv8 model downloaded (yolov8n.pt)
- Check backend logs for errors
- Ensure onnxruntime is installed

### Images not displaying
- Image preview feature not yet implemented
- Placeholder "No Preview" is expected
