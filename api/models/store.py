from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID

class Store(BaseModel):
    store_id: UUID
    owner_id: UUID
    type: str  # You can use Literal["food_goods", "printing"]
    location: str
    store_name: str
    created_at: str
    updated_at: str
    images: List[str]
