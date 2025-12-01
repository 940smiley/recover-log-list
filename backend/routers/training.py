from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel
from services.training import training_service
import os

router = APIRouter(
    prefix="/training",
    tags=["training"],
)

class TrainingConfig(BaseModel):
    data_path: str # Path to data.yaml
    epochs: int = 10
    batch_size: int = 16
    model_name: str = "yolov8n.pt"

@router.post("/start")
def start_training(config: TrainingConfig):
    """Start a training session"""
    if training_service.is_training:
        raise HTTPException(status_code=400, detail="Training is already in progress")
    
    if not os.path.exists(config.data_path):
        raise HTTPException(status_code=404, detail=f"Data file not found: {config.data_path}")

    try:
        training_service.start_training(
            data_path=config.data_path,
            epochs=config.epochs,
            batch_size=config.batch_size,
            model_name=config.model_name
        )
        return {"message": "Training started"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop")
def stop_training():
    """Stop the current training session"""
    training_service.stop_training()
    return {"message": "Stop signal sent"}

@router.get("/status")
def get_status():
    """Get current training status"""
    return training_service.get_status()

@router.get("/models")
def list_models():
    """List available custom models"""
    models_dir = "../data/training_runs"
    models = []
    if os.path.exists(models_dir):
        for root, dirs, files in os.walk(models_dir):
            for file in files:
                if file.endswith(".pt"):
                    models.append({
                        "name": file,
                        "path": os.path.join(root, file),
                        "size": os.path.getsize(os.path.join(root, file))
                    })
    return models
