from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class Order(BaseModel):
    order_id: UUID
    user_id: UUID
    store_id: UUID
    status: str  # pending, confirmed, ready, paid
    pickup_time: str
    ticket_url: Optional[str]
    receipt_url: Optional[str]
    created_at: str
