// Inject navbar HTML dynamically into pages that have <div id="navbar"></div>
document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.getElementById('navbar');
  if (!navContainer) return;

  // Get current user email for welcome message
  let email = 'Guest';
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data?.session) {
      email = data.session.user.email || 'User';
    }
  } catch (error) {
    console.error('Error getting session for navbar:', error);
  }

  navContainer.innerHTML = `
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="nav-brand">Papa John's Portal</div>
      <ul class="nav-links" role="menubar">
        <li role="none"><span class="welcome-msg" role="menuitem" tabindex="0">Welcome, ${email}</span></li>
        <li role="none"><a href="dashboard.html" role="menuitem" tabindex="0">Dashboard</a></li>
        <li role="none"><a href="documents.html" role="menuitem" tabindex="0">Documents & Forms</a></li>
        <li role="none"><a href="contacts.html" role="menuitem" tabindex="0">Team Directory</a></li>
        <li role="none"><button id="logout-btn" role="menuitem" tabindex="0">Logout</button></li>
      </ul>
    </nav>
  `;

  document.getElementById('logout-btn').addEventListener('click', async () => {
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  });
});
