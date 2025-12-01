from ultralytics import YOLO
from rembg import remove
from PIL import Image
import io
import numpy as np
import cv2

class AIService:
    def __init__(self):
        # Load a pretrained YOLOv8n model
        self.model = YOLO("yolov8n.pt")

    def detect_objects(self, image_bytes: bytes) -> list:
        # Convert bytes to PIL Image
        img = Image.open(io.BytesIO(image_bytes))
        
        # Run inference
        results = self.model(img)
        
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
