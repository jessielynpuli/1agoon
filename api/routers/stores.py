from fastapi import APIRouter
from utils.supabase import supabase

router = APIRouter(prefix="/stores")

@router.post("/")
def create_store(store: StoreCreateSchema, user=Depends(get_current_user)):
    response = supabase.table("Stores").insert(store.dict()).execute()
    return response


@router.get("/")
def get_stores():
    data = supabase.table("Stores").select("*").execute()
    return data
