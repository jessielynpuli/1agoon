from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class User(BaseModel):
    user_id: UUID
    username: str
    is_vendor: bool = False
    store_id: Optional[str] = None
    created_at: str
    updated_at: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
