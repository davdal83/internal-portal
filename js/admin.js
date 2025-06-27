document.addEventListener('DOMContentLoaded', async () => {
  const logoutLink = document.getElementById('logout-link');
  const adminEmails = await getAdminEmails();

  // Auth check & admin email check
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error || !session) {
    window.location.href = 'login.html';
    return;
  }

  const userEmail = session.user.email.toLowerCase();
  if (!adminEmails.includes(userEmail)) {
    alert('Access denied: You are not an admin.');
    window.location.href = 'dashboard.html';
    return;
  }

  // Tab switching logic
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');
    });
  });

  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  });

  // Load initial users list
  loadUsers();
});

// Helper to get list of admin emails from Supabase
async function getAdminEmails() {
  const { data, error } = await supabaseClient.from('admins').select('email');
  if (error) {
    console.error('Failed to fetch admin emails:', error.message);
    return [];
  }
  return data.map(item => item.email.toLowerCase());
}

// Load users and display in #users-container
async function loadUsers() {
  const container = document.getElementById('users-container');
  container.innerHTML = '<p>Loading users...</p>';

  const { data, error } = await supabaseClient.from('profiles').select('id, email, full_name, role');
  if (error) {
    container.innerHTML = `<p>Error loading users: ${error.message}</p>`;
    return;
  }

  if (!data.length) {
    container.innerHTML = '<p>No users found.</p>';
    return;
  }

  const list = document.createElement('ul');
  list.style.listStyle = 'none';
  list.style.padding = 0;

  data.forEach(user => {
    const li = document.createElement('li');
    li.style.padding = '0.5rem 0';
    li.textContent = `${user.full_name || '(No Name)'} - ${user.email} - Role: ${user.role || 'N/A'}`;
    list.appendChild(li);
  });

  container.innerHTML = '';
  container.appendChild(list);
}
