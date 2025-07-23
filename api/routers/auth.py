from unittest import result
from fastapi import APIRouter, HTTPException
from models.user import UserCreate, UserLogIn
from utils.supabase import supabase

router = APIRouter(prefix="/auth")

@router.post("/signup")
def signup(user: UserCreate):
    try:
        print("Signup input:", user.email, user.password)

        # Register user via Supabase Auth
        result = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password
        })

        print("Signup result:", result)

        # Create user record on SupabaseDB
        user_id = result["user"]["id"]

        supabase.table("users").insert({
            "user_id": user_id,           # same as the Supabase Auth UID
            "username": user.username,
            "is_vendor": False,           # default: not a vendor
            "store_id": None              # default: no store yet
        }).execute()
        return {"message": "Signup successful"}
    
    except Exception as e:
        print("Signup error:", str(e))
        raise HTTPException(status_code=500, detail="Signup failed. " + str(e))

    

@router.post("/login")
def login(user: UserLogIn):
    
    # Authenticate user via Supabase Auth
    result = supabase.auth.sign_in_with_password({
        "email": user.email,
        "password": user.password
    })

    #Check if login failed
    if result.get("error"):
        raise HTTPException(status_code=400, detail=result["error"]["message"])
    return {
        "message": "Login successful",
        "access_token": result["session"]["access_token"]
    }
