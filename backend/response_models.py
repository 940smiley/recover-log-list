from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# Response models for API serialization
class ImageResponse(BaseModel):
    id: int
    filename: str
    path: str
    item_id: Optional[int]
    is_primary: bool

    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class ItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    category_id: Optional[int]
    created_at: datetime
    updated_at: datetime
    images: List[ImageResponse] = []
    category: Optional[CategoryResponse] = None

    class Config:
        from_attributes = True
