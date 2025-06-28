// dashboard.js

// Supabase config
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

// Initialize Supabase (make sure the Supabase script is loaded in HTML)
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// When DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const {
      data: { user },
      error
    } = await client.auth.getUser();

    if (error || !user) {
      window.location.href = 'login.html';
      return;
    }

    // Show personalized greeting
    const welcomeEl = document.getElementById('welcome-message');
    if (welcomeEl) {
      const username = user.user_metadata?.full_name || user.email.split('@')[0];
      welcomeEl.textContent = `Welcome back, ${username}!`;
    }

  } catch (err) {
    console.error('Dashboard error:', err);
  }
});
