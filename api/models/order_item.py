from pydantic import BaseModel
from uuid import UUID

class OrderItem(BaseModel):
    order_item_id: UUID
    order_id: UUID
    item_id: UUID
    quantity: int
