from ultralytics import YOLO
from rembg import remove
from PIL import Image
import io
import numpy as np
import cv2
import os

class AIService:
    def __init__(self, model_path: str = "yolov8n.pt", confidence: float = 0.25):
        # Load a pretrained YOLOv8n model
        self.model_path = model_path
        self.confidence = confidence
        self.model = YOLO(model_path)

    def reload_model(self, model_path: str = None, confidence: float = None):
        """Reload model with new configuration"""
        if model_path and model_path != self.model_path:
            # Verify model exists if it's a file path
            if not model_path.startswith("yolov8") and not os.path.exists(model_path):
                raise FileNotFoundError(f"Model file not found: {model_path}")
            self.model_path = model_path
            self.model = YOLO(model_path)
        
        if confidence is not None:
            self.confidence = confidence

    def detect_objects(self, image_bytes: bytes) -> list:
        # Convert bytes to PIL Image
        img = Image.open(io.BytesIO(image_bytes))
        
        # Run inference with confidence threshold
        results = self.model(img, conf=self.confidence)
        
        detections = []
        for result in results:
            boxes = result.boxes
            for box in boxes:
                detections.append({
                    "label": self.model.names[int(box.cls)],
                    "confidence": float(box.conf),
                    "bbox": box.xyxy.tolist()[0]
                })
        return detections

    def remove_background(self, image_bytes: bytes) -> bytes:
        return remove(image_bytes)

ai_service = AIService()
