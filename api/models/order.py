from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class Order(BaseModel):
    order_id: UUID
    user_id: UUID
    store_id: UUID
    pickup_time: str
    total_price: float
    items_list: list["OrderItem"]  # List of MenuItem IDs
    ticket_url: Optional[str]
    receipt_url: Optional[str]
    created_at: str
