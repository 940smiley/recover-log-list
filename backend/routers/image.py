from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import Response
from services.image_processing import image_processing_service

router = APIRouter(
    prefix="/image",
    tags=["image"],
)

@router.post("/enhance")
async def enhance_image(file: UploadFile = File(...)):
    """Enhance image quality (brightness, contrast, sharpness)"""
    try:
        contents = await file.read()
        enhanced = image_processing_service.enhance_image(contents)
        return Response(content=enhanced, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/crop")
async def crop_image(
    file: UploadFile = File(...),
    x: int = Form(...),
    y: int = Form(...),
    width: int = Form(...),
    height: int = Form(...)
):
    """Crop image to specified coordinates"""
    try:
        contents = await file.read()
        cropped = image_processing_service.crop_image(contents, x, y, width, height)
        return Response(content=cropped, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/smart-crop")
async def smart_crop(file: UploadFile = File(...)):
    """Smart crop using edge detection"""
    try:
        contents = await file.read()
        cropped = image_processing_service.smart_crop(contents)
        return Response(content=cropped, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/auto-crop")
async def auto_crop(file: UploadFile = File(...)):
    """Auto-crop to remove white/transparent borders"""
    try:
        contents = await file.read()
        cropped = image_processing_service.auto_crop(contents)
        return Response(content=cropped, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resize")
async def resize_image(
    file: UploadFile = File(...),
    max_width: int = Form(1920),
    max_height: int = Form(1080)
):
    """Resize image while maintaining aspect ratio"""
    try:
        contents = await file.read()
        resized = image_processing_service.resize_image(contents, max_width, max_height)
        return Response(content=resized, media_type="image/png")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
