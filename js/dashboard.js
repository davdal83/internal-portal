// === Supabase Config ===
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your full anon key
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', async () => {
  const welcomeEl = document.getElementById('welcome-message');

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
  console.log('SESSION:', sessionData);

  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  console.log('USER:', user);
  console.log('ERROR:', error);

  if (error || !user) {
    console.warn('No user session found. Redirecting to login.');
    window.location.href = 'login.html';
    return;
  }

    // Try to get first_name from 'users' table
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('first_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.first_name) {
      console.warn('User profile lookup failed:', profileError?.message || 'Missing first name');
      welcomeEl.textContent = `Welcome back, ${user.email}`;
    } else {
      welcomeEl.textContent = `Welcome back, ${profile.first_name}. Let’s handle business.`;
    }

  } catch err {
    console.error('Dashboard load error:', err);
    welcomeEl.textContent = 'Something went wrong. Try reloading.';
  }
});
