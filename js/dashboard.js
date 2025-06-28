document.addEventListener('DOMContentLoaded', async () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

  // ✅ Correct usage
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

  const logoutBtn = document.getElementById('logout-button');
  const returnAdminLink = document.getElementById('return-to-admin');
  const welcomeMsg = document.getElementById('welcome-message');

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();

  if (userError || !user) {
    window.location.href = 'login.html';
    return;
  }

  welcomeMsg.textContent = `Welcome, ${user.email}`;

  const { data: userData, error: roleError } = await supabaseClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleError) {
    console.warn('Could not get user role:', roleError.message);
  }

  if (userData?.role === 'admin') {
    returnAdminLink.style.display = 'block';
    returnAdminLink.href = 'admin-dashboard.html';
  } else {
    returnAdminLink.style.display = 'none';
  }

  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert('Error logging out: ' + error.message);
    } else {
      window.location.href = 'login.html';
    }
  });
});
