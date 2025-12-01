from typing import List, Optional
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime

class Category(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    items: List["Item"] = Relationship(back_populates="category")

class ItemTagLink(SQLModel, table=True):
    item_id: Optional[int] = Field(default=None, foreign_key="item.id", primary_key=True)
    tag_id: Optional[int] = Field(default=None, foreign_key="tag.id", primary_key=True)

class Tag(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True, unique=True)
    items: List["Item"] = Relationship(back_populates="tags", link_model=ItemTagLink)

class Item(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    description: Optional[str] = None
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    category: Optional[Category] = Relationship(back_populates="items")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    images: List["Image"] = Relationship(back_populates="item")
    tags: List["Tag"] = Relationship(back_populates="items", link_model=ItemTagLink)

class Image(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    filename: str
    path: str
    item_id: Optional[int] = Field(default=None, foreign_key="item.id")
    item: Optional[Item] = Relationship(back_populates="images")
    is_primary: bool = Field(default=False)

class Log(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    action: str
    details: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
