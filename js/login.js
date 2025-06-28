document.addEventListener('DOMContentLoaded', () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

  // Create the supabase client using the global supabase object from CDN
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

  const form = document.getElementById('login-form');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.style.color = '#710500';
    message.textContent = '';

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      message.textContent = 'Please enter both email and password.';
      return;
    }

    message.textContent = 'Logging in...';

    try {
      const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        message.textContent = `Error: ${signInError.message}`;
        return;
      }

      const userId = signInData.user.id;

      // Check approval status and role
      const { data: userData, error: userError } = await supabaseClient
        .from('users')
        .select('status, role')
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        message.textContent = 'Error retrieving user data.';
        return;
      }

      if (userData.status !== 'approved') {
        message.textContent = 'Your account is pending approval. Please wait for an admin.';
        await supabaseClient.auth.signOut();
        return;
      }

      message.style.color = '#2D5C2A';
      message.textContent = 'Login successful! Redirecting...';

      setTimeout(() => {
        if (userData.role === 'admin') {
          window.location.href = 'admin-dashboard.html';
        } else {
          window.location.href = 'dashboard.html';
        }
      }, 1200);

    } catch (error) {
      message.textContent = 'Unexpected error. Please try again later.';
      console.error(error);
    }
  });

  // Signup modal toggle logic here (optional, add if needed)
});
