from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional, List
from api.models.order_item import OrderItem, OrderItemCreate

class Order(BaseModel):
    order_id: UUID
    user_id: UUID
    store_id: UUID
    pickup_time: str
    total_price: float
    items_list: list["OrderItem"]  # List of MenuItem IDs
    ticket_url: Optional[str]
    receipt_url: Optional[str]
    created_at: datetime

class OrderCreate(BaseModel):
    user_id: UUID
    store_id: UUID
    pickup_time: str
    total_price: float
    items_list: list[OrderItemCreate]  # List of OrderItemCreate objects
    ticket_url: Optional[str] = None
    receipt_url: Optional[str] = None
    created_at: Optional[datetime] = None


class OrderUpdate(BaseModel):
    order_id: UUID
    user_id: Optional[UUID] = None
    store_id: Optional[UUID] = None
    pickup_time: Optional[str] = None
    total_price: Optional[float] = None
    items_list: Optional[list[OrderItemCreate]] = None  # List of OrderItemCreate objects
    ticket_url: Optional[str] = None
    receipt_url: Optional[str] = None
    created_at: Optional[str] = None

class OrderResponse(BaseModel):
    order_id: UUID
    user_id: UUID
    store_id: UUID
    pickup_time: str
    total_price: float
    items_list: list[OrderItem]  # List of OrderItem objects
    ticket_url: Optional[str]
    receipt_url: Optional[str]
    created_at: datetime
    """Response model for Order with additional metadata."""

    class Config:
        orm_mode = True  # Enable ORM mode for compatibility with SQLAlchemy models
        arbitrary_types_allowed = True  # Allow arbitrary types for compatibility with custom types
        json_encoders = {
            UUID: str  # Convert UUIDs to strings for JSON serialization
        }
        anystr_strip_whitespace = True  # Strip whitespace from any string fields
        validate_assignment = True  # Validate assignments to model
        use_enum_values = True  # Use enum values instead of enum instances
        allow_population_by_field_name = True  # Allow population by field names
        extra = "forbid"  # Forbid extra fields not defined in the model
        json_schema_extra = {
            "example": {
                "order_id": "123e4567-e89b-12d3-a456-426614174000",
                "user_id": "123e4567-e89b-12d3-a456-426614174001",
                "store_id": "123e4567-e89b-12d3-a456-426614174002",
                "pickup_time": "2023-10-01T12:00:00Z",
                "total_price": 29.99,
                "items_list": [
                    {
                        "item_id": "123e4567-e89b-12d3-a456-426614174003",
                        "quantity": 2
                    }
                ],
                "ticket_url": None,
                "receipt_url": None,
                "created_at": "2023-10-01T11:00:00Z"
            }
        }
class SalesSummary(BaseModel):
    today_sales: float
    monthly_sales: float
    yearly_sales: float

class Reports(BaseModel):
    store_id: UUID
    total_orders: int
    total_revenue: float
    orders: List[OrderResponse]
    summary: SalesSummary

    @classmethod
    def from_orders(cls, store_id, orders):
        sales_summary = calculate_sales_summary(orders)
        total_orders = len(orders)
        total_revenue = sum(order.total_price for order in orders)
        return cls(
            store_id=store_id,
            total_orders=total_orders,
            total_revenue=total_revenue,
            orders=orders,
            summary=SalesSummary(**sales_summary)
        )
