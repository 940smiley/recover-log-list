from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from sqlmodel import Session, select
from typing import List, Optional
import shutil
import os
from pathlib import Path
from database import engine
from models import Item, Image, Category, Tag, ItemTagLink, Log
from response_models import ItemResponse
from services.ai import ai_service
from datetime import datetime

router = APIRouter(
    prefix="/items",
    tags=["items"],
)

# Ensure log directory exists
LOG_DIR = Path("../data/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/import")
async def import_items(
    files: List[str] = Form(...),
    category_name: Optional[str] = Form(None),
    delete_original: bool = Form(False),
    batch_process: bool = Form(True)
):
    """
    Import items from local file paths.
    - Copies images to log directory
    - Runs AI detection
    - Creates database records
    - Optionally deletes originals
    """
    imported_items = []
    
    with Session(engine) as session:
        # Get or create category
        category = None
        if category_name:
            statement = select(Category).where(Category.name == category_name)
            category = session.exec(statement).first()
            if not category:
                category = Category(name=category_name)
                session.add(category)
                session.commit()
                session.refresh(category)
        
        for file_path in files:
            try:
                if not os.path.exists(file_path):
                    continue
                
                # Read file for AI processing
                with open(file_path, 'rb') as f:
                    file_bytes = f.read()
                
                # Run AI detection
                detections = ai_service.detect_objects(file_bytes)
                
                # Determine item name from detections or filename
                if detections:
                    primary_label = detections[0]['label']
                    item_name = f"{primary_label} - {Path(file_path).stem}"
                else:
                    item_name = Path(file_path).stem
                
                # Create item
                item = Item(
                    name=item_name,
                    description=f"Detected objects: {', '.join([d['label'] for d in detections])}",
                    category_id=category.id if category else None
                )
                session.add(item)
                session.commit()
                session.refresh(item)
                
                # Copy file to log directory
                filename = f"{item.id}_{Path(file_path).name}"
                dest_path = LOG_DIR / filename
                shutil.copy2(file_path, dest_path)
                
                # Create image record
                image = Image(
                    filename=filename,
                    path=str(dest_path),
                    item_id=item.id,
                    is_primary=True
                )
                session.add(image)
                
                # Create tags from detections
                unique_labels = set(d['label'] for d in detections)
                for tag_name in unique_labels:
                    statement = select(Tag).where(Tag.name == tag_name)
                    tag = session.exec(statement).first()
                    if not tag:
                        tag = Tag(name=tag_name)
                        session.add(tag)
                        session.commit()
                        session.refresh(tag)
                    
                    # Link tag to item
                    # Check if link already exists (should not for new item, but good practice)
                    link = ItemTagLink(item_id=item.id, tag_id=tag.id)
                    session.add(link)
                
                # Log the import
                log = Log(
                    action="import",
                    details=f"Imported {filename} with {len(detections)} detections"
                )
                session.add(log)
                
                session.commit()
                
                # Delete original if requested
                if delete_original:
                    os.remove(file_path)
                    log_delete = Log(
                        action="delete_original",
                        details=f"Deleted original file: {file_path}"
                    )
                    session.add(log_delete)
                    session.commit()
                
                imported_items.append({
                    "item_id": item.id,
                    "name": item_name,
                    "detections": len(detections),
                    "image_path": str(dest_path)
                })
                
            except Exception as e:
                with open("backend_errors.log", "a") as err_log:
                    err_log.write(f"Error importing {file_path}: {e}\n")
                print(f"Error importing {file_path}: {e}")
                continue
    
    return {
        "success": True,
        "imported_count": len(imported_items),
        "items": imported_items
    }

@router.get("/", response_model=List[ItemResponse])
def list_items(
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 100
):
    """List all items with optional category filter"""
    with Session(engine) as session:
        statement = select(Item)
        
        if category:
            statement = statement.join(Category).where(Category.name == category)
        
        statement = statement.offset(skip).limit(limit)
        items = session.exec(statement).all()
        
        # Eagerly load relationships
        result = []
        for item in items:
            _ = item.images  # Trigger lazy load
            _ = item.category  # Trigger lazy load
            result.append(ItemResponse.from_orm(item))
        
        return result

@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int):
    """Get a single item with all its images and tags"""
    with Session(engine) as session:
        item = session.get(Item, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Eagerly load relationships
        _ = item.images
        _ = item.category
        
        return ItemResponse.from_orm(item)

@router.put("/{item_id}")
def update_item(
    item_id: int,
    name: Optional[str] = None,
    description: Optional[str] = None,
    category_id: Optional[int] = None
):
    """Update an item's details"""
    with Session(engine) as session:
        item = session.get(Item, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        if name:
            item.name = name
        if description:
            item.description = description
        if category_id:
            item.category_id = category_id
        
        item.updated_at = datetime.utcnow()
        session.add(item)
        session.commit()
        session.refresh(item)
        
        return item

@router.delete("/{item_id}")
def delete_item(item_id: int):
    """Delete an item and its associated images"""
    with Session(engine) as session:
        item = session.get(Item, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        # Delete associated image files
        for image in item.images:
            if os.path.exists(image.path):
                os.remove(image.path)
        
        session.delete(item)
        session.commit()
        
        return {"success": True, "message": f"Item {item_id} deleted"}

@router.post("/{item_id}/reprocess")
async def reprocess_item(item_id: int):
    """Reprocess an item's images with AI"""
    with Session(engine) as session:
        item = session.get(Item, item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")
        
        detections_all = []
        for image in item.images:
            if os.path.exists(image.path):
                with open(image.path, 'rb') as f:
                    file_bytes = f.read()
                detections = ai_service.detect_objects(file_bytes)
                detections_all.extend(detections)
        
        # Update description
        item.description = f"Detected objects: {', '.join([d['label'] for d in detections_all])}"
        item.updated_at = datetime.utcnow()
        session.add(item)
        session.commit()
        
        return {
            "success": True,
            "detections": detections_all
        }
