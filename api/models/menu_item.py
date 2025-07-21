from pydantic import BaseModel
from uuid import UUID

class MenuItem(BaseModel):
    item_id: UUID
    store_id: UUID
    item_name: str
    item_desc: str
    price: float
    category: str  # "food" | "goods" | "service"
