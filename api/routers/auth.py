from unittest import result
from fastapi import APIRouter, HTTPException

from api.models.user import UserCreate, UserLogIn
from api.utils.supabase import supabase

router = APIRouter(prefix="/auth")

@router.post("/signup")
def signup(user: UserCreate):
    try:
        print("Signup input:", user.email, user.password)

        # Sign-up user via Supabase Auth
        result = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "email_redirect_to": "http://localhost:8000/login", # Redirect URL after email confirmation
                "data": {
                    "username": user.username
                }
            }
        })

        print("Signup result:", result)

        return {"message": "Signup successful. Please check your email to confirm your account."}
    
    except Exception as e:
        print("Signup error:", str(e))
        raise HTTPException(status_code=500, detail="Signup failed. " + str(e))

@router.post("/login")
def login(user: UserLogIn):
    try:
        # Authenticate user via Supabase Auth
        result = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })

        print("Login result:", result)
       # Get username from user metadata, fallback to email prefix or "guest"
        username = (result.user.user_metadata.get("username") 
                    if result.user and result.user.user_metadata 
                    else None) or result.user.email.split("@")[0] or "guest"

        # Get store_id if it exists
        store_query = supabase.table("Stores").select("store_id").eq("owner_id", result.user.id).execute()
        store_id = store_query.data[0]["store_id"] if store_query.data else None

        return {
            "message": "Login successful",
            "access_token": result.session.access_token,
            "user": {
                "id": result.user.id,
                "email": result.user.email,
                "username": username,
                "storeId": store_id
            }
        }

    except Exception as e:
        print("Login exception:", str(e))
        raise HTTPException(status_code=500, detail="Login failed. " + str(e))
