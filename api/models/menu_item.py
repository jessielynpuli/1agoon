from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List

class MenuItem(BaseModel):
    item_id: UUID
    store_id: UUID
    quantity: str # "on-demand" | "limited"
    item_name: str
    price: float
    item_desc: str
    images_urls: list[str]  # List of image URLs
    created_at: str  # ISO format datetime string
    updated_at: str  # ISO format datetime string

class MenuItemCreate(BaseModel):
    quantity: str # "on-demand" | "limited"
    item_name: str
    price: float
    item_desc: str
    images_urls: list[str]  # List of image URLs
    created_at: str  # ISO format datetime string
    
class MenuItemUpdate(BaseModel):
    quantity: str # "on-demand" | "limited"
    item_name: str
    price: float
    item_desc: str
    images_urls: list[str]  # List of image URLs
    updated_at: str  # ISO format datetime string