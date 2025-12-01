from PIL import Image, ImageEnhance, ImageFilter
import cv2
import numpy as np
from io import BytesIO

class ImageProcessingService:
    def __init__(self):
        pass
    
    def enhance_image(self, image_bytes: bytes) -> bytes:
        """
        Enhance image quality (brightness, contrast, sharpness)
        """
        img = Image.open(BytesIO(image_bytes))
        
        # Auto-enhance
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.2)
        
        enhancer = ImageEnhance.Brightness(img)
        img = enhancer.enhance(1.1)
        
        enhancer = ImageEnhance.Sharpness(img)
        img = enhancer.enhance(1.3)
        
        # Convert back to bytes
        output = BytesIO()
        img.save(output, format='PNG')
        return output.getvalue()
    
    def crop_image(self, image_bytes: bytes, x: int, y: int, width: int, height: int) -> bytes:
        """
        Crop image to specified coordinates
        """
        img = Image.open(BytesIO(image_bytes))
        cropped = img.crop((x, y, x + width, y + height))
        
        output = BytesIO()
        cropped.save(output, format='PNG')
        return output.getvalue()
    
    def smart_crop(self, image_bytes: bytes) -> bytes:
        """
        Smart crop using edge detection to find the main subject
        """
        # Convert to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Convert to grayscale
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Apply edge detection
        edges = cv2.Canny(gray, 50, 150)
        
        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        if contours:
            # Find the largest contour
            largest_contour = max(contours, key=cv2.contourArea)
            x, y, w, h = cv2.boundingRect(largest_contour)
            
            # Add padding
            padding = 20
            x = max(0, x - padding)
            y = max(0, y - padding)
            w = min(img.shape[1] - x, w + 2 * padding)
            h = min(img.shape[0] - y, h + 2 * padding)
            
            # Crop
            cropped = img[y:y+h, x:x+w]
        else:
            # If no contours found, return original
            cropped = img
        
        # Convert back to bytes
        _, buffer = cv2.imencode('.png', cropped)
        return buffer.tobytes()
    
    def auto_crop(self, image_bytes: bytes) -> bytes:
        """
        Auto-crop to remove white/transparent borders
        """
        img = Image.open(BytesIO(image_bytes))
        
        # Convert to numpy array
        img_array = np.array(img)
        
        # Find non-white pixels
        if len(img_array.shape) == 3:
            # Color image
            mask = ~np.all(img_array == 255, axis=2)
        else:
            # Grayscale
            mask = img_array != 255
        
        # Find bounding box
        coords = np.argwhere(mask)
        if len(coords) > 0:
            y0, x0 = coords.min(axis=0)
            y1, x1 = coords.max(axis=0) + 1
            
            # Crop
            cropped = img.crop((x0, y0, x1, y1))
        else:
            cropped = img
        
        output = BytesIO()
        cropped.save(output, format='PNG')
        return output.getvalue()
    
    def resize_image(self, image_bytes: bytes, max_width: int = 1920, max_height: int = 1080) -> bytes:
        """
        Resize image while maintaining aspect ratio
        """
        img = Image.open(BytesIO(image_bytes))
        
        # Calculate new size
        img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
        
        output = BytesIO()
        img.save(output, format='PNG')
        return output.getvalue()

image_processing_service = ImageProcessingService()
