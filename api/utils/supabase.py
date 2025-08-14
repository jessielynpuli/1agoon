from supabase import create_client, Client
import os
from pathlib import Path
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
supabase_bucket = os.getenv("SUPABASE_BUCKET")

if not all([supabase_url, supabase_key, supabase_bucket]):
    raise ValueError("Supabase environment variables are not set correctly.")

supabase: Client = create_client(supabase_url, supabase_key)
