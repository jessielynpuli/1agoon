from fastapi import APIRouter
from api.models.order import Order
from api.models.order_item import OrderItem

router = APIRouter(prefix="/order_items")

@router.get("/{user_id}")
def get_orders(user_id: str):
    return supabase.table("Orders").select("*").eq("user_id", user_id).execute()

@router.get("/{order_id}")
def get_order_items(order_id: str):
    return supabase.table("OrderItems").select("*").eq("order_id", order_id).execute()

