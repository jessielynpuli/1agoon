import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://gfuiughkbdvblrbxmqbl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdWl1Z2hrYmR2YmxyYnhtcWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwODQ5OTgsImV4cCI6MjA2ODY2MDk5OH0.Jtt9fiy_DL0WXjKJs6ZgsHORsXEHOSk2slhGOBgw-yM"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
