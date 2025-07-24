from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from datetime import datetime

from routers import auth  # Import routers here
from utils import supabase

import os
import boto3

app = FastAPI(title = "1agoon API", version = "1.0.0", description = "API for managing 1agoon application")

# middleware (CORS), complicate daw, security and protect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # if production, may endpoint na insspecify. Allow all origins, you can specify specific domains if needed
    allow_credentials= True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
)

# AWS Configuration (set-up muna to, before models etc)
# S3_BUCKET = os.getenv("S3_BUCKET", "4avatars-sph-bucket")

# Initialize AWS, uy boto3 pakuha ng sources natin from access keys (basta na set-up na yung naunang dalawa)
# s3 = boto3.client('s3')

# Include routes
app.include_router(auth.router)
# app.include_router(users.router)
# app.include_router(stores.router)
# app.include_router(menu.router)
# app.include_router(orders.router)