from fastapi import APIRouter
from utils.supabase import supabase

router = APIRouter(prefix="/orders")

@router.get("/{user_id}")
def get_orders(user_id: str):
    return supabase.table("Orders").select("*").eq("user_id", user_id).execute()
