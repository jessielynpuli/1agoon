from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, status
from api.models.store import Store, StoreCreate, StoreUpdate
from api.models.order import Order, OrderCreate
from api.models.order_item import OrderItem, OrderItemCreate
from api.models.user import User  # Assuming you have a User model for authentication
from api.models.store_item import StoreItem, StoreItemCreate, StoreItemUpdate

from api.utils.supabase import supabase
from api.utils.auth import get_current_user

from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder
from typing import List, Optional
from uuid import UUID
import uuid
from datetime import datetime


router = APIRouter(prefix="/stores/items")

# Endpoint to create a new store item
@router.post("/store/{store_id}/item", response_model=StoreItemCreate)
def create_store_item(store_id: str, item: StoreItemCreate, user=Depends(get_current_user)):
    item_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()

    store_item_details = {
        "item_id": item_id,
        "store_id": store_id,
        "owner_id": str(user["user_id"]),
        "quantity": item.quantity,
        "item_name": item.item_name,
        "price": item.price,
        "item_desc": item.item_desc,
        "created_at": timestamp,
        "updated_at": timestamp,
    }
    try:
        supabase.table("StoreItems").insert(store_item_details).execute()
        return StoreItem(**store_item_details)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create store item: {str(e)}")   

# Endpoint to upload images for store items
@router.post("/store/upload_images", response_model=StoreItemCreate)
async def upload_store_item_images(images_urls: List[UploadFile] = File(...)):
    uploaded_urls = []
    for image in images_urls:
        try:
            file_name = f"{uuid.uuid4()}_{image.filename}"
            file_path = f"store_item_images/{file_name}"
            supabase.storage.from_("store_items").upload(file_path, await image.read())
            public_url = supabase.storage.from_("store_item_images").get_public_url(file_path)
            uploaded_urls.append(public_url["publicURL"])
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")
    
    return ImageUploadResponse(images_urls=uploaded_urls)

# Endpoint to update a store item
@router.patch("/store_item/{store_id}/{item_id}", response_model=StoreItem)
async def patchupdate_store_item(store_id: str, item_id: str, item_update: StoreItemUpdate, user=Depends(get_current_user)):
    try:
        # Check if the user owns the store
        store = supabase.table("Stores").select("*").eq("store_id", store_id).execute().data
        if not store or str(store[0]["owner_id"]) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="Not authorized")
        # Check if the item exists
        item = supabase.table("StoreItems").select("*").eq("item_id", item_id).execute().data
        if not item:
            raise HTTPException(status_code=404, detail="Store item not found")
        
        # Prepare update expression
        update_data = {"updated_at": datetime.utcnow().isoformat()}

        if item_update.item_name is not None:
            update_data["item_name"] = item_update.item_name
        if item_update.price is not None:
            update_data["price"] = item_update.price
        if item_update.item_desc is not None:
            update_data["item_desc"] = item_update.item_desc
        if item_update.quantity is not None:                
            update_data["quantity"] = item_update.quantity
        if item_update.images_urls is not None:
            update_data["images_urls"] = item_update.images_urls
        
        # Update the item in the database
        response = supabase.table("StoreItems").update(update_data).eq("item_id", item_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Store item not found")

        return StoreItem(**response.data[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update store item: {str(e)}")   
           
# Endpoint to delete a store item    
@router.delete("/store_item/{store_id}/{item_id}", response_model=StoreItem)
async def delete_item(store_id: str, item_id: str, user=Depends(get_current_user)):
    try:
        # Check if the user owns the store
        store = supabase.table("Stores").select("*").eq("store_id", store_id).execute().data
        if not store or str(store[0]["owner_id"]) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="Not authorized")
        # Check if the item exists
        item = supabase.table("StoreItems").select("*").eq("item_id", item_id).execute().data
        if not item:
            raise HTTPException(status_code=404, detail="Store item not found")
        
        # Delete the item from the database
        response = supabase.table("StoreItems").delete().eq("item_id", item_id).execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Store item not found")
        
        return StoreItem(**item[0])
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete store item: {str(e)}")

#user end
@router.get("/{store_id}", response_model=List[StoreItem])
async def get_all_storeitems(store_id: str):
    try:
        result = supabase.table("StoreItems").select("*").eq("store_id", store_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="No items found for this store")
        return [StoreItem(**item) for item in result.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch store items: {str(e)}")

#vendor end
@router.get("/store_item/{store_id}/{owner_id}", response_model=List[StoreItem])
async def display_storeitems(owner_id: str, store_id: str, user=Depends(get_current_user)):
    try:
         # Fetch the store
        store_data = supabase.table("Stores").select("*").eq("store_id", store_id).execute().data
        if not store_data:
            raise HTTPException(status_code=404, detail="Store not found")
        store = store_data[0]

        # Check if the user owns the store
        if str(store["owner_id"]) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="Not authorized")

        # Fetch items for the store
        result = supabase.table("StoreItems").select("*").eq("store_id", store_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="No items found for this store")
        return [StoreItem(**item) for item in result.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch store items: {str(e)}")