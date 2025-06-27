// js/supabase.js

// Initialize Supabase client with your URL and anon key
const supabaseClient = supabase.createClient(
  "https://oxvgngohpjpuucsfwvmz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmduZ29ocGpwdXVjc2Z3dm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzkyNDgsImV4cCI6MjA2NjU1NTI0OH0.lTD9lI2wUWSxTVBPY4wcdo81O1S87M-ZNqYasAezKQ8"
);

window.supabaseClient = supabaseClient;
