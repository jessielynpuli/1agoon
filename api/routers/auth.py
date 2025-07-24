from fastapi import APIRouter, HTTPException
from api.models.user import UserCreate
from api.utils.supabase import supabase

router = APIRouter(prefix="/auth")

@router.post("/signup")
def signup(email: str, password: str):
    result = supabase.auth.sign_up({
        "email": user.email,
        "password": user.password,
    })
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result

@router.post("/login")
def login(email: str, password: str):
    result = supabase.auth.sign_in_with_password({
        "email": user.email,
        "password": user.password,
    })
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return result
