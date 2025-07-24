from fastapi import APIRouter
from api.models.order import Order
from api.models.order_item import OrderItem

router = APIRouter(prefix="/orders")

@router.get("/{user_id}")
def get_orders(user_id: str):
    return supabase.table("Orders").select("*").eq("user_id", user_id).execute()
