import jwt
from fastapi import Header, HTTPException
import os

JWT_SECRET = os.getenv("JWT_SECRET", "your-jwt-secret")  # get from Supabase settings

def get_current_user(authorization: str = Header(...)):
    try:
        token = authorization.split(" ")[1]
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        return payload
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
