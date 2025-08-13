from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List

class StoreItem(BaseModel):
    item_id: UUID
    store_id: UUID
    owner_id: UUID
    quantity: str # "on-demand" | "limited"
    item_name: str
    price: float
    item_desc: str
    images_urls: list[str]  # List of image URLs
    created_at: str  # ISO format datetime string
    updated_at: str  # ISO format datetime string

class StoreItemCreate(BaseModel):
    quantity: str # "on-demand" | "limited"
    item_name: str
    price: float
    item_desc: str
    images_urls: list[str]  # List of image URLs
    created_at: str  # ISO format datetime string
    updated_at: str
    
class StoreItemUpdate(BaseModel):
    quantity: str # "on-demand" | "limited"
    item_name: str
    price: float
    item_desc: str
    images_urls: list[str]  # List of image URLs
    updated_at: str  # ISO format datetime string

class ImageUploadResponse(BaseModel):
    images_urls: List[str]