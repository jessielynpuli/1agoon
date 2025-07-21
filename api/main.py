from fastapi import FastAPI,BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, BooleanAttribute, UTCDateTimeAttribute
from datetime import datetime
from typing import List, Literal

import os
import boto3    #to access AWS through Python Codes

from typing import List #typing module, to declare data types for our models

app = FastAPI(title = "Notes API", version = "1.0.0", description = "API for managing notes")

# middleware (CORS), complicate daw, security and protect

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # if production, may endpoint na insspecify. Allow all origins, you can specify specific domains if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# AWS Configuration (set-up muna to, before models etc)
DYNAMODB_TABLE = os.getenv("DYNAMO_TABLE","#name ng table")
S3_BUCKET = os.getenv("S3 BUCKET","name ng bucket")

# Initialize AWS, uy boto3 pakuha ng sources natin from access keys (basta na set-up na yung naunang dalawa)
dynamodb = boto3.resources('dynamodb')
s3 = boto3.client('s3')
table = dynamodb.Table(DYNAMODB_TABLE)

# utility function to for signing S3 URLs, every access ng user sa img, nagbabago url
def generate_presigned_url(image_keys: List[str]) -> List[str]:
    signed_urls = []
    for image_key in image_keys:
        try:
            signed_url = s3.generate_presigned_url(
                'get_object',
                Params={'Bucket': S3_BUCKET, 'Key': image_key},
                ExpiresIn=3600
            )
            signed_urls.append(signed_url)
        except Exception as e:
            print(f"Error generating presigned URL for {image_key}: {e}")
            signed_urls.append(f"https://{S3_BUCKET}.s3.ap-northeast-1.amazonaws.com/{image_key}")  
    return signed_urls
    #checker, every other access, nagbabago yung URL, para di ma-access ng iba. standard practice sa AWS S3

# Include routes
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(stores.router)
app.include_router(menu.router)
app.include_router(orders.router)


# models/schemas (data models and data validation)
class UserModel(Model):
    class Meta:
        table_name = ""
        region = "ap-northeast-1"

    user_id = UnicodeAttribute(hash_key=True)
    username = UnicodeAttribute()
    password_hash = UnicodeAttribute()
    email = UnicodeAttribute(null=True)
    is_vendor = BooleanAttribute()
    store_id = UnicodeAttribute(null=True)
    created_at = UTCDateTimeAttribute(default=datetime.utcnow)
    updated_at = UTCDateTimeAttribute(default=datetime.utcnow)

class StoreModel(Model):
    class Meta:
        table_name = "Stores"
        region = "ap-northeast-1"

    store_id = UnicodeAttribute(hash_key=True)
    owner_id = UnicodeAttribute()
    type = UnicodeAttribute()  # Should be either "food_goods" or "printing"
    store_name = UnicodeAttribute()
    schedule = UnicodeAttribute(null=True)
    created_at = UTCDateTimeAttribute(default=datetime.utcnow)
    updated_at = UTCDateTimeAttribute(default=datetime.utcnow)

from pynamodb.attributes import NumberAttribute

class MenuItemModel(Model):
    class Meta:
        table_name = "MenuItems"
        region = "ap-northeast-1"

    item_id = UnicodeAttribute(hash_key=True)
    store_id = UnicodeAttribute()
    item_name = UnicodeAttribute()
    item_desc = UnicodeAttribute(null=True)
    price = NumberAttribute()
    category = UnicodeAttribute()  # "food", "goods", "service"

class OrderModel(Model):
    class Meta:
        table_name = "Orders"
        region = "ap-northeast-1"

    order_id = UnicodeAttribute(hash_key=True)
    user_id = UnicodeAttribute()
    store_id = UnicodeAttribute()
    status = UnicodeAttribute()  # "pending", "confirmed", "ready", "paid"
    pickup_time = UTCDateTimeAttribute()
    ticket_url = UnicodeAttribute(null=True)
    receipt_url = UnicodeAttribute(null=True)
    ordered_at = UTCDateTimeAttribute(default=datetime.utcnow)

class OrderItemModel(Model):
    class Meta:
        table_name = "OrderItems"
        region = "ap-northeast-1"

    order_item_id = UnicodeAttribute(hash_key=True)
    order_id = UnicodeAttribute()
    item_id = UnicodeAttribute()
    quantity = NumberAttribute()

