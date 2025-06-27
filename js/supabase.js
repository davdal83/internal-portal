// js/supabase.js

const SUPABASE_URL = "https://oxvgngohpjpuucsfwvmz.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmduZ29ocGpwdXVjc2Z3dm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzkyNDgsImV4cCI6MjA2NjU1NTI0OH0.lTD9lI2wUWSxTVBPY4wcdo81O1S87M-ZNqYasAezKQ8";

// Make supabaseClient a global variable attached to window
window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
