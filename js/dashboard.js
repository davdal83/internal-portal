// dashboard.js

// === Supabase Config ===
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === DOM Ready ===
document.addEventListener('DOMContentLoaded', async () => {
  const welcomeEl = document.getElementById('welcome-message');

  try {
    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      window.location.href = 'login.html';
      return;
    }

    const { first_name, last_name } = user.user_metadata || {};
    const username = first_name
      ? `${first_name} ${last_name || ''}`.trim()
      : user.email.split('@')[0];

    welcomeEl.textContent = `Welcome back, ${username}. Let’s handle business.`;

    // TODO: Load dashboard content here
  } catch (err) {
    console.error('Error loading dashboard:', err);
    welcomeEl.textContent = 'Something went wrong. Please reload.';
  }
});
