// dashboard.js

// === Supabase Config ===
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const welcomeEl = document.getElementById('welcome-message');

  try {
    // Get current authenticated user
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      window.location.href = 'login.html';
      return;
    }

    // Query the 'stores' table for this user's first_name using their id
    const { data: storeUser, error: storeError } = await supabase
      .from('stores')
      .select('first_name')
      .eq('id', user.id)
      .single();

    if (storeError || !storeUser || !storeUser.first_name) {
      // fallback to full email
      welcomeEl.textContent = `Welcome back, ${user.email}. Let’s handle business.`;
      return;
    }

    // Show first name from stores table
    welcomeEl.textContent = `Welcome back, ${storeUser.first_name}. Let’s handle business.`;

    // TODO: Load dashboard content here

  } catch (err) {
    console.error('Error loading dashboard:', err);
    welcomeEl.textContent = 'Something went wrong. Please reload.';
  }
});
