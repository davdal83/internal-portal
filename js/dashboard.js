document.addEventListener('DOMContentLoaded', async () => {
  const welcomeMsg = document.getElementById('welcome-msg');
  const logoutLink = document.getElementById('logout-link');

  const { data: { session }, error } = await supabaseClient.auth.getSession();

  if (error || !session) {
    window.location.href = 'login.html';
    return;
  }

  welcomeMsg.textContent = `Welcome, ${session.user.email}`;

  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  });
});
