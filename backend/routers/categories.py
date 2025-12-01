from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from typing import List
from database import engine
from models import Category

router = APIRouter(
    prefix="/categories",
    tags=["categories"],
)

@router.get("/", response_model=List[Category])
def list_categories():
    """List all categories"""
    with Session(engine) as session:
        statement = select(Category)
        categories = session.exec(statement).all()
        return categories

@router.post("/", response_model=Category)
def create_category(name: str):
    """Create a new category"""
    with Session(engine) as session:
        # Check if category already exists
        statement = select(Category).where(Category.name == name)
        existing = session.exec(statement).first()
        if existing:
            raise HTTPException(status_code=400, detail="Category already exists")
        
        category = Category(name=name)
        session.add(category)
        session.commit()
        session.refresh(category)
        return category

@router.delete("/{category_id}")
def delete_category(category_id: int):
    """Delete a category"""
    with Session(engine) as session:
        category = session.get(Category, category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        
        session.delete(category)
        session.commit()
        return {"success": True, "message": f"Category {category_id} deleted"}
