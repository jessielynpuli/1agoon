from pydantic import BaseModel, EmailStr
from typing import Optional
from uuid import UUID

class User(BaseModel):
    user_id: UUID
    username: str
    email: Optional[EmailStr]
    is_vendor: bool
    store_id: Optional[str]
    created_at: str
    updated_at: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
