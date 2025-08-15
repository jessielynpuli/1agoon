from fastapi import HTTPException, APIRouter, Depends, File, UploadFile
from api.utils.supabase import supabase
from datetime import datetime
from uuid import UUID
from typing import List, Optional
from api.models.order import Order
from api.models.order_item import OrderItem, OrderItemCreate

router = APIRouter(prefix="/order_items")

# Endpoint to create a new order item
@router.post("/create", response_model=OrderItem)
def create_order_item(order_item: OrderItem):
    order_item_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()

    order_item_details = {
        "order_item_id": order_item_id,
        "store_id": order_item.store_id,
        "user_id": order_item.user_id,
        "order_id": order_item.order_id,
        "store_item_id": order_item.store_item_id,
        "attachment_url": order_item.attachment_url,
        "quantity": order_item.quantity,
        "order_item_price": order_item.order_item_price,
        "status": order_item.status,
        "notes": order_item.notes,
        "cancelled_at": order_item.cancelled_at,
        "cancelled_by": order_item.cancelled_by,
        "cancelled_reason": order_item.cancelled_reason,
        "created_at": timestamp,
    }
    
    try:
        supabase.table("OrderItems").insert(order_item_details).execute()
        return OrderItem(**order_item_details)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order item: {str(e)}")   

# Endpoint to get order items by user ID
@router.get("/user/{user_id}", response_model=List[OrderItem])
def get_order_items_by_user(user_id: str):
    try:
        order_items = supabase.table("OrderItems").select("*").eq("user_id", user_id).execute()
        return [OrderItem(**item) for item in order_items.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve order items: {str(e)}")

# Endpoint to get order items by order ID
@router.get("/order/{order_id}", response_model=List[OrderItem])
def get_order_items_by_order(order_id: str):    
    try:
        order_items = supabase.table("OrderItems").select("*").eq("order_id", order_id).execute()
        return [OrderItem(**item) for item in order_items.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve order items: {str(e)}")

# Endpoint to get all order items for a user
@router.get("/{user_id}")
def get_orders(user_id: str):
    return supabase.table("Orders").select("*").eq("user_id", user_id).execute()

@router.get("/{order_id}")
def get_order_items(order_id: str):
    return supabase.table("OrderItems").select("*").eq("order_id", order_id).execute()

