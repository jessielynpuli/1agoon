from pydantic import BaseModel
from uuid import UUID
from typing import Optional

class OrderItem(BaseModel):
    order_item_id: UUID
    store_id: UUID
    user_id: UUID
    order_id: UUID
    store_item_id: UUID
    attachment_url: Optional[str]  # URL for any attachment (e.g., receipt, ticket)
    quantity: int
    order_item_price: float  # Price of the item at the time of order
    status: str  # pending, confirmed, ready, paid, cancelled_by_user, cancelled_by_vendor, completed
    notes: str  # Any special instructions or notes for the item
    cancelled_at: str
    cancelled_by: Optional[UUID]  # User ID of the person who cancelled the order
    cancelled_reason: Optional[str]  # Reason for cancellation
    created_at: str  # Timestamp when the order item was created

class OrderItemCreate(BaseModel):
    order_item_id: UUID
    store_id: UUID
    user_id: UUID
    order_id: UUID
    menu_item_id: UUID
    attachment_url: Optional[str]  # URL for any attachment (e.g., receipt, ticket)
    quantity: int
    order_item_price: float  #Menuitem price * qty
    status: str  # Received, Processing, For Pickup, Complete, Cancelled
    notes: str  # Any special instructions or notes for the item
    cancelled_at: str #cancellation time
    cancelled_by: Optional[UUID]  # User ID of the person who cancelled the order
    cancelled_reason: Optional[str]  # Reason for cancellation
    created_at: str  # Timestamp when the order item was created
    updated_at: str  # Timestamp when the order item was last updated
