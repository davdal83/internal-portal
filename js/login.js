// admin-dashboard.js

document.addEventListener('DOMContentLoaded', async () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

  const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

  // Check session
  const { data: { session }, error } = await supabaseClient.auth.getSession();
  if (error || !session) {
    window.location.href = 'login.html';
    return;
  }

  const user = session.user;

  // Welcome message
  const welcomeMsg = document.getElementById('welcome-message');
  if (welcomeMsg) {
    welcomeMsg.textContent = `Welcome, ${user.email}`;
  }

  // Get user role
  const { data: userData, error: userDataError } = await supabaseClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userDataError) {
    console.warn('Could not get user role:', userDataError.message);
  }

  // Show "Switch to Team View" for admin
  const switchToTeamLink = document.getElementById('return-to-user');
  if (userData?.role === 'admin' && switchToTeamLink) {
    switchToTeamLink.style.display = 'block';
    switchToTeamLink.href = 'dashboard.html';
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-button');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      const { error: signOutError } = await supabaseClient.auth.signOut();
      if (signOutError) {
        alert('Error logging out: ' + signOutError.message);
      } else {
        window.location.href = 'login.html';
      }
    });
  }

  // Load pending users with status "pending"
  const pendingUsersBody = document.getElementById('pending-users-body');
  if (pendingUsersBody) {
    const { data: pendingUsers, error: pendingError } = await supabaseClient
      .from('users')
      .select('id, first_name, last_name, email, store_number, role, status')
      .eq('status', 'pending');

    if (pendingError) {
      pendingUsersBody.innerHTML = `<tr><td colspan="5">Error loading pending users: ${pendingError.message}</td></tr>`;
      return;
    }

    if (pendingUsers.length === 0) {
      pendingUsersBody.innerHTML = `<tr><td colspan="5">No pending users for approval.</td></tr>`;
      return;
    }

    pendingUsersBody.innerHTML = pendingUsers
      .map(user => `
        <tr>
          <td>${user.first_name} ${user.last_name}</td>
          <td>${user.email}</td>
          <td>${user.store_number || ''}</td>
          <td>${user.role}</td>
          <td>
            <button class="approve-btn" data-id="${user.id}">Approve</button>
            <button class="deny-btn" data-id="${user.id}">Deny</button>
          </td>
        </tr>
      `)
      .join('');

    // Add event listeners for approve and deny buttons
    pendingUsersBody.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const { error } = await supabaseClient
          .from('users')
          .update({ status: 'approved' })
          .eq('id', id);

        if (error) {
          alert('Error approving user: ' + error.message);
        } else {
          alert('User approved!');
          location.reload();
        }
      });
    });

    pendingUsersBody.querySelectorAll('.deny-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        const { error } = await supabaseClient
          .from('users')
          .update({ status: 'denied' })
          .eq('id', id);

        if (error) {
          alert('Error denying user: ' + error.message);
        } else {
          alert('User denied.');
          location.reload();
        }
      });
    });
  }
});
