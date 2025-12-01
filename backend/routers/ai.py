from fastapi import APIRouter, UploadFile, File, HTTPException
from services.ai import ai_service
from fastapi.responses import Response

router = APIRouter(
    prefix="/ai",
    tags=["ai"],
)

@router.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        detections = ai_service.detect_objects(contents)
        return detections
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        processed_image = ai_service.remove_background(contents)
        return Response(content=processed_image, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
