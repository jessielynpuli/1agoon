from fastapi import APIRouter
from utils.supabase import supabase

router = APIRouter(prefix="/menu")

@router.get("/{store_id}")
def get_menu_items(store_id: str):
    result = supabase.table("MenuItems").select("*").eq("store_id", store_id).execute()
    return result
