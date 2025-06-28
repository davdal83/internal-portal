document.addEventListener('DOMContentLoaded', async () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

  // Initialize Supabase client
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

  // Elements
  const logoutBtn = document.getElementById('logout-button');
  const returnUserLink = document.getElementById('return-to-user');
  const welcomeMsg = document.getElementById('welcome-message');
  const tbody = document.getElementById('pending-users-body');

  // Get current user
  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) {
    window.location.href = 'login.html';
    return;
  }
  welcomeMsg.textContent = `Welcome, ${user.email}`;

  // Get role and show Return to Dashboard link if admin
  const { data: userData, error: roleError } = await supabaseClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleError) {
    console.warn('Could not get user role:', roleError.message);
  }

  if (userData?.role === 'admin') {
    returnUserLink.style.display = 'block';
  } else {
    returnUserLink.style.display = 'none';
  }

  // Load pending users for approval
  async function loadPendingUsers() {
    const { data: users, error } = await supabaseClient
      .from('users')
      .select('id, first_name, last_name, email, store_number, role')
      .eq('approved', false);

    if (error) {
      console.error('Error loading pending users:', error.message);
      return;
    }

    tbody.innerHTML = '';
    if (!users.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No pending users</td></tr>';
      return;
    }

    users.forEach(user => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${user.first_name} ${user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.store_number || 'N/A'}</td>
        <td>${user.role || 'User'}</td>
        <td>
          <button class="approve-btn" data-id="${user.id}">Approve</button>
          <button class="deny-btn" data-id="${user.id}">Deny</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    addActionListeners();
  }

  // Approve / Deny button handlers
  function addActionListeners() {
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const { error } = await supabaseClient
          .from('users')
          .update({ approved: true })
          .eq('id', id);
        if (error) {
          alert('Error approving user: ' + error.message);
        } else {
          loadPendingUsers();
        }
      });
    });

    document.querySelectorAll('.deny-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const { error } = await supabaseClient
          .from('users')
          .delete()
          .eq('id', id);
        if (error) {
          alert('Error denying user: ' + error.message);
        } else {
          loadPendingUsers();
        }
      });
    });
  }

  loadPendingUsers();

  // Logout handler
  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      alert('Error logging out: ' + error.message);
    } else {
      window.location.href = 'login.html';
    }
  });
});
