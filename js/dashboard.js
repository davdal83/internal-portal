// dashboard.js

// === Supabase Config ===
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // Replace with your actual anon key

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const welcomeEl = document.getElementById('welcome-message');

  try {
    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser();

    if (authError || !user) {
      window.location.href = 'login.html';
      return;
    }

    // Query your 'users' table to get first_name by user id
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('first_name')
      .eq('id', user.id)
      .single();

    let username;

    if (profileError || !userProfile || !userProfile.first_name) {
      // fallback: full email if no first_name found
      username = user.email;
    } else {
      username = userProfile.first_name;
    }

    welcomeEl.textContent = `Welcome back, ${username}. Let’s handle business.`;

    // TODO: load dashboard content here

  } catch (err) {
    console.error('Error loading dashboard:', err);
    welcomeEl.textContent = 'Something went wrong. Please reload.';
  }
});
