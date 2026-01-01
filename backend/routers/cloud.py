from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from typing import List, Any, Dict
from services.rclone import rclone_service
import subprocess
import io

router = APIRouter(
    prefix="/cloud",
    tags=["cloud"],
)

@router.get("/remotes")
def list_remotes() -> List[Dict[str, str]]:
    """List configured Rclone remotes with their types"""
    try:
        remotes = rclone_service.list_remotes()
        result = []
        for remote in remotes:
            # Get remote type
            try:
                config_output = subprocess.run(
                    ["rclone", "config", "show", remote],
                    capture_output=True,
                    text=True
                )
                remote_type = "unknown"
                for line in config_output.stdout.split('\n'):
                    if line.startswith('type ='):
                        remote_type = line.split('=')[1].strip()
                        break
                
                result.append({"name": remote, "type": remote_type})
            except:
                result.append({"name": remote, "type": "unknown"})
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files", response_model=List[Any])
def list_cloud_files(remote: str, path: str = ""):
    try:
        return rclone_service.list_files(remote, path)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/serve")
async def serve_cloud_file(remote: str, path: str):
    """Stream a file from cloud storage"""
    try:
        # Use rclone cat to stream the file
        process = subprocess.Popen(
            ["rclone", "cat", f"{remote}:{path}"],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        
        def generate():
            while True:
                chunk = process.stdout.read(8192)
                if not chunk:
                    break
                yield chunk
        
        return StreamingResponse(generate(), media_type="application/octet-stream")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
