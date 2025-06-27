// js/supabase.js

const supabaseUrl = 'https://oxvgngohpjpuucsfwvmz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94dmduZ29ocGpwdXVjc2Z3dm16Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NzkyNDgsImV4cCI6MjA2NjU1NTI0OH0.lTD9lI2wUWSxTVBPY4wcdo81O1S87M-ZNqYasAezKQ8';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

// Make available globally
window.supabaseClient = supabaseClient;
