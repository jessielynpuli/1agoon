from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv("https://gfuiughkbdvblrbxmqbl.supabase.co")
supabase_key = os.getenv("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdWl1Z2hrYmR2YmxyYnhtcWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODQ5OTgsImV4cCI6MjA2ODY2MDk5OH0.Jtt9fiy_DL0WXjKJs6ZgsHORsXEHOSk2slhGOBgw-yM")

supabase = create_client(supabase_url, supabase_key)
