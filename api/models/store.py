from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, time
from enum import Enum
from uuid import UUID

class Store(BaseModel):
    store_id: UUID
    owner_id: UUID
    location: str
    store_name: str
    store_desc: str
    days_open: str  # e.g., "Mon-Fri"
    store_status: str  # "open" | "closed" | "hiatus"
    opening_hour: time
    closing_hour: time
    menu_items: List[UUID]  # List of MenuItem IDs associated with the store
    orders: List[UUID]  # List of Order IDs associated with the store
    deleted: bool = False  # Soft delete flag
    order_items: List[UUID]  # List of OrderItem IDs associated with the store 
    created_at: datetime
    updated_at: datetime

class StoreStatus(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
    HIATUS = "hiatus"

class StoreCreate(BaseModel):
    store_name: str
    location: str
    store_status: str  # "open" | "closed" | "hiatus"
    opening_hour: str
    closing_hour: str
    store_desc: str
    days_open: str
    menu_items: List[UUID]  # List of MenuItem IDs associated with the store    

class StoreUpdate(BaseModel):
    store_name: str
    location: str
    store_status: Optional[StoreStatus]  # "open" | "closed" | "hiatus"
    opening_hour: str
    closing_hour: str
    store_desc: str
    days_open: str
    menu_items: List[UUID]  # List of MenuItem IDs associated with the store    
    updated_at: str

class StoreGetOrder(BaseModel): 
    orders: List[UUID]  # List of Order IDs associated with the store
    order_items: List[UUID]  # List of OrderItem IDs associated with the store 
    order_status: str # enum Received, Processing, For Pickup, Complete, Cancelled