// dashboard.js

const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const welcomeEl = document.getElementById('welcome-message');

  try {
    // Wait for auth session to fully load
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError || !session || !session.user) {
      window.location.href = 'login.html';
      return;
    }

    const user = session.user;

    // Query the `users` table for profile info
    const { data, error } = await supabase
      .from('users')
      .select('first_name')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn('User profile lookup failed, falling back to email.');
    }

    const firstName = data?.first_name;
    const fallbackName = user.email;

    welcomeEl.textContent = firstName
      ? `Welcome back, ${firstName}. Let’s handle business.`
      : `Welcome back, ${fallbackName}. Let’s handle business.`;

  } catch (err) {
    console.error('Error loading dashboard:', err);
    if (welcomeEl) {
      welcomeEl.textContent = 'Something went wrong. Try reloading.';
    }
  }
});
