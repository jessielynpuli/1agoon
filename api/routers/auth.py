from unittest import result
from fastapi import APIRouter, HTTPException
from models.user import UserCreate
from utils.supabase import supabase

router = APIRouter(prefix="/auth")

@router.post("/signup")
def signup(user: UserCreate):

    # Register user via Supabase Auth
    result = supabase.auth.sign_up({
        "email": user.email,
        "password": user.password
    })

    # Check if sign-up failed
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])

    # Create user record on SupabaseDB
    user_id = result["user"]["id"]

    supabase.table("users").insert({
        "id": user_id,                # same as the Supabase Auth UID
        "email": user.email,
        "username": user.username,
        "is_vendor": False,           # default: not a vendor
        "store_id": None              # default: no store yet
    }).execute()
    return {"message": "Signup successful"}
    

@router.post("/login")
def login(email: str, password: str):
    result = supabase.auth.sign_in_with_password({
        "email": user.email,
        "password": user.password,
    })
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result
