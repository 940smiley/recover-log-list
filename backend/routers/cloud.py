from fastapi import APIRouter, HTTPException
from typing import List, Any
from services.rclone import rclone_service

router = APIRouter(
    prefix="/cloud",
    tags=["cloud"],
)

@router.get("/remotes", response_model=List[str])
def list_remotes():
    try:
        return rclone_service.list_remotes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files", response_model=List[Any])
def list_cloud_files(remote: str, path: str = ""):
    try:
        return rclone_service.list_files(remote, path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
