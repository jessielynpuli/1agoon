from fastapi import APIRouter
from api.utils.supabase import supabase
from uuid import UUID
from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi import Depends
from api.utils.auth import get_current_user
from api.models.store import Store, StoreCreate, StoreUpdate
import uuid

router = APIRouter(prefix="/stores")

#for vendor to create, update, and get information about their stores
#for users to get stores, make list!

def is_store_open(opening: str, closing: str, days_open: list[str]) -> bool:
    now = datetime.utcnow()
    current_time = now.strftime("%H:%M")
    current_day = now.strftime("%A")  # e.g. "Monday"

    return (
        current_day in days_open and
        opening <= current_time <= closing
    )

@router.post("/store", response_model=Store)
def create_store(store: StoreCreate, user = Depends(get_current_user)):
    store.store_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()
    
    store_details = {
        "store_id": store.store_id,
        "owner_id": str(user["user_id"]),
        "store_name": store.store_name,
        "location": store.location,
        "opening_hour": store.opening_hour,
        "closing_hour": store.closing_hour,
        "store_desc": store.store_desc,
        "days_open": store.days_open,
        "menu_items": [str(i) for i in store.menu_items],
        "orders": [],
        "order_items": [],
        "created_at": timestamp,
        "updated_at": timestamp,
    }

    try:
        supabase.table("Stores").insert(store_details).execute()
        return Store(**store_details)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create store: {str(e)}")


@router.get("/store/all", response_model=List[Store])
async def get_all_stores():
    try:
        #may bucket for pictures ng menu, pls include
        response = (
            supabase.table("Stores").
            select("location, store_name, store_desc, days_open, store_status, opening_hour, closing_hour, menu_items(*)")
            .eq("deleted", False)
            .execute()
        )
        if not response.data:
            raise HTTPException(status_code=404, detail="No stores found")
        return [Store(**store) for store in response.data]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch store details: {str(e)}")
    
@router.get("/store/owner", response_model=List[Store])
def get_vendor_stores(user=Depends(get_current_user)):
    try:
        response = (
            supabase.table("Stores")
            .select("*")
            .eq("owner_id", str(user["user_id"]))
            .eq("deleted", False)  # Optional soft delete logic
            .execute()
        )
        return response.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch vendor stores: {str(e)}")

@router.patch("/store/{owner_id}/{store_id}", response_model=Store)
async def patchupdate_store(store_id: UUID, store_update: StoreUpdate, owner_id: UUID, user=Depends(get_current_user)):
        try:
            #chech if the user owns the store
            if str(store["owner_id"]) != str(user["user_id"]):
                raise HTTPException(status_code=403, detail="Not authorized")
            #check if it exists
            response = supabase.table("Stores").select("*").eq("store_id", str(store_id)).single().execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Store not found")
            
            # Prepare update expression
            update_data = {"updated_at": datetime.utcnow().isoformat()}

            if store_update.store_name is not None:
                update_data["store_name"] = store_update.store_name
            
            if store_update.location is not None:
                update_data["location"] = store_update.location

            if store_update.store_status is not None:
                if store_update.store_status not in {"open", "closed", "hiatus"}:
                    raise HTTPException(status_code=400, detail="Invalid store status")
                update_data["store_status"] = store_update.store_status
           
            if store_update.opening_hour is not None:
                update_data["opening_hour"] = store_update.opening_hour
            
            if store_update.closing_hour is not None:
                update_data["closing_hour"] = store_update.closing_hour

            if store_update.store_desc is not None:
                update_data["store_desc"] = store_update.store_desc

            if store_update.days_open is not None:
                update_data["days_open"] = store_update.days_open
            
            #   MENU ITEMS TO FOLLOW : >

            supabase.table("Stores").update(update_data).eq("store_id", str(store_id)).execute()
            # After update
            updated_response = supabase.table("Stores").select("*").eq("store_id", str(store_id)).single().execute()
            return Store(**updated_response.data)

        except HTTPException:
            raise    
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to update store details: {str(e)}")


@router.delete("/store/{owner_id}/{store_id}", response_model=dict)
def soft_delete_store(store_id: str, owner_id: str, user=Depends(get_current_user)):
    try:
        store = supabase.table("Stores").select("*").eq("store_id", store_id).single().execute().data
        if not store:
            raise HTTPException(status_code=404, detail="Store not found")
        if str(store["owner_id"]) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="Not authorized")
      
        # Mark the store as deleted (soft delete)
        # Assuming 'deleted' is a boolean field in the Stores table
        # If not, you can use a different approach like removing the store from the database
        # or archiving it in a different table.
        # For soft delete, we just set a 'deleted' flag to True
        # This assumes you have a 'deleted' column in your Stores table
        # If you don't have a 'deleted' column, you can add it or use a different approach
        # like moving the store to an archive table.
        if store["deleted"]:
            raise HTTPException(status_code=400, detail="Store is already deleted")
     
        supabase.table("Stores").update({"deleted": True}).eq("store_id", store_id).execute()
        return {"message": "Store marked as deleted"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete store: {str(e)}")

@router.post("/store/{owner_id}/{store_id}/restore", response_model=dict)
def restore_store(store_id: str, owner_id: str, user=Depends(get_current_user)):
    try:
        store = supabase.table("Stores").select("*").eq("store_id", store_id).single().execute().data
        if not store:
            raise HTTPException(status_code=404, detail="Store not found")
        if str(store["owner_id"]) != str(user["user_id"]):
            raise HTTPException(status_code=403, detail="Not authorized")
      
        # Restore the store by setting 'deleted' to False
        supabase.table("Stores").update({"deleted": False}).eq("store_id", store_id).execute()
        return {"message": "Store restored"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to restore store: {str(e)}")

@router.patch("/stores/{store_id}/status")
def update_store_status(store_id: str):
    store = supabase.table("Stores").select("*").eq("store_id", store_id).single().execute().data

    is_open = is_store_open(
        store["opening_hour"],
        store["closing_hour"],
        store["days_open"]
    )

    new_status = "open" if is_open else "closed"

    supabase.table("Stores").update({"store_status": new_status}).eq("store_id", store_id).execute()

    return {"store_id": store_id, "store_status": new_status}
