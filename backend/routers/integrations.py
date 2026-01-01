from datetime import datetime
from pathlib import Path
from typing import List, Optional

import requests
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, HttpUrl
from sqlmodel import Session, select

from database import engine
from models import Image, Item, ItemTagLink, Log, Tag
from services.training import training_service


router = APIRouter(prefix="/integrations", tags=["integrations"])

LOG_DIR = Path("../data/logs")
LOG_DIR.mkdir(parents=True, exist_ok=True)

TRAINING_INGEST_DIR = Path("../data/training_ingest")
TRAINING_INGEST_DIR.mkdir(parents=True, exist_ok=True)


class EbaySpec(BaseModel):
    key: str
    value: str


class EdgeEbayPayload(BaseModel):
    item_id: int
    title: str
    listing_url: HttpUrl
    price: Optional[float] = None
    currency: Optional[str] = None
    image_url: Optional[HttpUrl] = None
    description: Optional[str] = None
    specs: List[EbaySpec] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    add_to_training: bool = True
    trigger_training: bool = False
    training_data_path: Optional[str] = None


def _download_image(url: str, destination: Path) -> Path:
def _download_image(url: str, destination: Path) -> Path:
    # Validate URL to prevent SSRF attacks
    if not url.startswith(('https://', 'http://')):
        raise ValueError("Invalid URL scheme")
    
    headers = {
        'User-Agent': 'CollectiblesLog/1.0 (+'
    }
    response = requests.get(url, timeout=15, headers=headers, verify=True)
    response.raise_for_status()

    destination.parent.mkdir(parents=True, exist_ok=True)
    with open(destination, "wb") as file:
        file.write(response.content)

    return destination


def _ensure_tags(session: Session, item_id: int, tags: List[str]):
    for tag_name in tags:
        normalized = tag_name.strip()
        if not normalized:
            continue

        statement = select(Tag).where(Tag.name == normalized)
        tag = session.exec(statement).first()
        if not tag:
            tag = Tag(name=normalized)
            session.add(tag)
def _ensure_tags(session: Session, item_id: int, tags: List[str]):
    for tag_name in tags:
        normalized = tag_name.strip()
        if not normalized:
            continue

        statement = select(Tag).where(Tag.name == normalized)
        tag = session.exec(statement).first()
        if not tag:
            tag = Tag(name=normalized)
            session.add(tag)
            # Don't commit here - let caller handle transaction

        link_exists = (
            session.exec(
                select(ItemTagLink)
                .where(ItemTagLink.item_id == item_id)
                .where(ItemTagLink.tag_id == tag.id)
            )
            .first()
            is not None
        )

        if not link_exists:
            session.add(ItemTagLink(item_id=item_id, tag_id=tag.id))


@router.post("/edge-ebay/link")
def link_ebay_listing(payload: EdgeEbayPayload):
    """Attach Edge eBay search results to an item and optionally feed training data."""
    with Session(engine) as session:
        item = session.get(Item, payload.item_id)
        if not item:
            raise HTTPException(status_code=404, detail="Item not found")

        item.name = payload.title or item.name
        if payload.description:
            description_sections = [part for part in [payload.description, item.description] if part]
            item.description = "\n".join(description_sections)

        added_image: Optional[Image] = None
        if payload.image_url:
            image_extension = Path(payload.image_url.path).suffix or ".jpg"
            filename = f"edge_{payload.item_id}_{int(datetime.utcnow().timestamp())}{image_extension}"
            saved_path = LOG_DIR / filename
            try:
                _download_image(payload.image_url, saved_path)
                added_image = Image(
                    filename=filename,
                    path=str(saved_path),
                    item_id=item.id,
                    is_primary=False if item.images else True,
                )
                session.add(added_image)
            except requests.exceptions.RequestException as exc:
                raise HTTPException(status_code=502, detail=f"Failed to fetch image: {exc}")

        tag_values = payload.tags + [spec.key for spec in payload.specs if spec.key]
        _ensure_tags(session, item.id, tag_values)

        item.updated_at = datetime.utcnow()
        session.add(item)

        ingest_record = None
        if payload.add_to_training and payload.image_url:
            ingest_dir = TRAINING_INGEST_DIR / f"item_{item.id}"
            ingest_path = ingest_dir / (added_image.filename if added_image else Path(payload.image_url.path).name)
            try:
                _download_image(payload.image_url, ingest_path)
                ingest_record = str(ingest_path)
            except Exception as exc:  # noqa: BLE001
                raise HTTPException(status_code=502, detail=f"Failed to store training image: {exc}")

        log_details = {
            "source": "edge-ebay",
            "listing_url": str(payload.listing_url),
            "price": payload.price,
            "currency": payload.currency,
            "ingested_for_training": bool(ingest_record),
        }

        session.add(
            Log(
                action="edge-ebay-link",
                details=str(log_details),
                timestamp=datetime.utcnow(),
            )
        )
        session.commit()
        session.refresh(item)

        training_started = False
        training_error = None
        if payload.trigger_training and payload.training_data_path:
            if training_service.is_training:
                training_error = "Training already in progress; enqueue after completion."
            else:
                try:
                    training_service.start_training(payload.training_data_path)
                    training_started = True
                except Exception as exc:  # noqa: BLE001
                    training_error = str(exc)

        response = {
            "item_id": item.id,
            "updated_name": item.name,
            "updated_description": item.description,
            "image_saved": added_image.filename if added_image else None,
            "training_image": ingest_record,
            "training_triggered": training_started,
            "training_error": training_error,
        }

        return response
