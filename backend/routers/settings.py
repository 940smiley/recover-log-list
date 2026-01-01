from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
import os

router = APIRouter(
    prefix="/settings",
    tags=["settings"],
)

SETTINGS_FILE = "../data/settings.json"

class ModelSettings(BaseModel):
    detection_model: str = "yolov8n.pt"
    detection_confidence: float = 0.25
    custom_model_path: Optional[str] = None
    use_custom_model: bool = False

class EbaySettings(BaseModel):
    app_id: str = ""
    cert_id: str = ""
    dev_id: str = ""
    user_token: str = ""
    sandbox_mode: bool = True

class Settings(BaseModel):
    models: ModelSettings = ModelSettings()
    ebay: EbaySettings = EbaySettings()

def load_settings() -> Settings:
    """Load settings from file or return defaults"""
    if os.path.exists(SETTINGS_FILE):
        try:
            with open(SETTINGS_FILE, 'r') as f:
                data = json.load(f)
                return Settings(**data)
        except:
            return Settings()
    return Settings()

def save_settings(settings: Settings):
    """Save settings to file"""
    os.makedirs(os.path.dirname(SETTINGS_FILE), exist_ok=True)
    with open(SETTINGS_FILE, 'w') as f:
        json.dump(settings.dict(), f, indent=2)

@router.get("/", response_model=Settings)
def get_settings():
    """Get current settings"""
    return load_settings()

@router.put("/models")
def update_model_settings(model_settings: ModelSettings):
    """Update AI model settings"""
    try:
        settings = load_settings()
        settings.models = model_settings
        save_settings(settings)
        
        # Update the AI service model
        from services.ai import ai_service
        ai_service.reload_model(
            model_path=model_settings.custom_model_path if model_settings.use_custom_model else model_settings.detection_model,
            confidence=model_settings.detection_confidence
        )
        
        return {"message": "Model settings updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/ebay")
def update_ebay_settings(ebay_settings: EbaySettings):
    """Update eBay API settings"""
    try:
        settings = load_settings()
        settings.ebay = ebay_settings
        save_settings(settings)
        return {"message": "eBay settings updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
