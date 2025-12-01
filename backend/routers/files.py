from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
from typing import List
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/files",
    tags=["files"],
)

class FileItem(BaseModel):
    name: str
    path: str
    is_dir: bool
    size: int

@router.get("/list", response_model=List[FileItem])
def list_files(path: str):
    """List image files in a directory"""
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="Directory not found")
    
    if not os.path.isdir(path):
        raise HTTPException(status_code=400, detail="Path is not a directory")
    
    try:
        items = []
        with os.scandir(path) as entries:
            for entry in entries:
                items.append(FileItem(
                    name=entry.name,
                    path=entry.path,
                    is_dir=entry.is_dir(),
                    size=entry.stat().st_size if not entry.is_dir() else 0
                ))
        return items
    except PermissionError:
        raise HTTPException(status_code=403, detail="Permission denied")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/serve")
def serve_file(path: str):
    """Serve a local file for preview"""
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(path)
