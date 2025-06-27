document.addEventListener('DOMContentLoaded', async () => {
  const welcomeMsg = document.getElementById('welcome-msg');
  const logoutLink = document.getElementById('logout-link');
  const adminPanel = document.getElementById('admin-panel');

  // Get current session
  const { data: { session }, error } = await supabaseClient.auth.getSession();

  if (error || !session) {
    window.location.href = 'login.html';
    return;
  }

  const userEmail = session.user.email.toLowerCase();
  welcomeMsg.textContent = `Welcome, ${userEmail}`;

  // Check if user's email exists in the 'admins' table
  const { data: admins, error: adminError } = await supabaseClient
    .from('admins')
    .select('email')
    .eq('email', userEmail);

  if (adminError) {
    console.error('Error checking admin status:', adminError.message);
  }

  if (admins && admins.length > 0) {
    adminPanel.style.display = 'block';
  }

  // Logout handler
  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  });
});
