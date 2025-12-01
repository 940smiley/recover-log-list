from fastapi import APIRouter
from sqlmodel import Session, select, func
from database import engine
from models import Item, Category, Image, Tag

router = APIRouter(
    prefix="/stats",
    tags=["stats"],
)

@router.get("/")
def get_statistics():
    """Get dashboard statistics"""
    with Session(engine) as session:
        # Count items
        total_items = session.exec(select(func.count(Item.id))).one()
        
        # Count categories
        total_categories = session.exec(select(func.count(Category.id))).one()
        
        # Count images
        total_images = session.exec(select(func.count(Image.id))).one()
        
        # Count tags
        total_tags = session.exec(select(func.count(Tag.id))).one()
        
        # Get recent items
        recent_items = session.exec(
            select(Item).order_by(Item.created_at.desc()).limit(5)
        ).all()
        
        # Get items by category
        category_stats = []
        categories = session.exec(select(Category)).all()
        for category in categories:
            count = session.exec(
                select(func.count(Item.id)).where(Item.category_id == category.id)
            ).one()
            category_stats.append({
                "category": category.name,
                "count": count
            })
        
        return {
            "total_items": total_items,
            "total_categories": total_categories,
            "total_images": total_images,
            "total_tags": total_tags,
            "recent_items": recent_items,
            "category_stats": category_stats
        }
