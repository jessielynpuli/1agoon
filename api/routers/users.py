from fastapi import APIRouter
from utils import supabase

router = APIRouter(prefix="/users")

@router.get("/")
def get_users():
    data = supabase.table("users").select("*").execute()
    return data

@router.get("/me")
def get_user_info(user = Depends(get_current_user)):
    return {"email": user["email"], "id": user["sub"]}

