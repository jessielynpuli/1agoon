from fastapi import APIRouter, HTTPException
from api.models.order import Order, OrderCreate
from api.models.order_item import OrderItem, OrderItemCreate
from api.utils.supabase import supabase
import uuid
from datetime import datetime

router = APIRouter(prefix="/orders")

@router.post("/", response_model=Order)
def create_order(order: OrderCreate):
    order_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()

    order_details = {
        "order_id": order_id,
        "user_id": order.user_id,
        "store_id": order.store_id,
        "pickup_time": order.pickup_time,
        "total_price": order.total_price,
        "ticket_url": order.ticket_url,
        "receipt_url": order.receipt_url,
        "created_at": timestamp.
        "status": "new",  # Default status when creating an order
    }

    try:
        supabase.table("Orders").insert(order_details).execute()
        for item in order.items_list:
            item_data = item.dict()
            item_data["order_item_id"] = str(uuid.uuid4())
            item_data["order_id"] = order_id
            item_data["store_id"] = order.store_id
            item_data["user_id"] = order.user_id
            item_data["created_at"] = timestamp
            supabase.table("OrderItems").insert(item_data).execute()
        return Order(**order_details, items_list=order.items_list)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create order: {str(e)}")

#to get all orders for the vendor
@router.get("/store/{store_id}/new", response_model=List[Order])
def get_new_orders_for_store(store_id: str):
    result = supabase.table("Orders").select("*").eq("store_id", store_id).eq("status", "new").execute()
    return result.data

#to get all orders for a user
@router.get("/", response_model=List[Order])
def get_orders(user_id: str):
    return supabase.table("Orders").select("*").eq("user_id", user_id).execute()

#to get order items by order_id
@router.get("/{order_id}/items", response_model=List[OrderItem])
def get_order_items(order_id: str):
    return supabase.table("OrderItems").select("*").eq("order_id", order_id).execute() 

#to cancel an order
@router.patch("/orders/{order_id}/cancel")
def cancel_order(order_id: str, order: Order):
    return supabase.table("Orders").update({"status": "cancelled"}).eq("order_id", order_id).execute()


@router.patch("/orders/{order_id}/status")
def update_order_status(order_id: str, status: str):
    return supabase.table("Orders").update({"status": status}).eq("order_id", order_id).execute()

#for receipts, once ordered is complete
@router.post("/orders/{order_id}/complete")
def complete_order(order_id: str):
    return supabase.table("Orders").update({"status": "complete"}).eq("order_id", order_id).execute()

#for uploading attachments like pdf, photos, etc.
@router.post("/orders/{order_id}/upload")
def upload_order_receipt(order_id: str, receipt_url: str):
    return supabase.table("Orders").update({"receipt_url": receipt_url}).eq("order_id", order_id).execute()
