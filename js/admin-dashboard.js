document.addEventListener('DOMContentLoaded', async () => {
  const supabase = window.supabase;

  const logoutBtn = document.getElementById('logout-button');
  const returnToUserLink = document.getElementById('return-to-user');
  const welcomeMsg = document.getElementById('welcome-message');
  const pendingUsersBody = document.getElementById('pending-users-body');

  // Get current user
  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  if (userError || !user) {
    window.location.href = 'login.html';
    return;
  }

  welcomeMsg.textContent = `Welcome, ${user.email}`;

  // Get user role
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleError || !userData) {
    console.warn('Unable to retrieve user role.');
    return;
  }

  // Show return link if admin
  if (userData.role === 'admin') {
    returnToUserLink.style.display = 'block';
  }

  // Load pending users
  const { data: pendingUsers, error: fetchError } = await supabase
    .from('users')
    .select('*')
    .eq('status', 'pending');

  if (fetchError) {
    console.error('Error fetching pending users:', fetchError.message);
    return;
  }

  // Display pending users
  pendingUsersBody.innerHTML = '';

  pendingUsers.forEach(user => {
    const row = document.createElement('tr');

    const name = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const email = user.email || '';
    const store = user.store_number || '';
    const role = user.role || 'user';

    row.innerHTML = `
      <td>${name}</td>
      <td>${email}</td>
      <td>${store}</td>
      <td>${role}</td>
      <td>
        <button class="approve-btn" data-id="${user.id}">Approve</button>
        <button class="deny-btn" data-id="${user.id}">Deny</button>
      </td>
    `;

    pendingUsersBody.appendChild(row);
  });

  // Event delegation for buttons
  pendingUsersBody.addEventListener('click', async (e) => {
    const userId = e.target.dataset.id;
    if (!userId) return;

    if (e.target.classList.contains('approve-btn')) {
      await updateUserStatus(userId, 'approved');
    }

    if (e.target.classList.contains('deny-btn')) {
      await updateUserStatus(userId, 'denied');
    }
  });

  // Update status helper
  async function updateUserStatus(id, status) {
    const { error } = await supabase
      .from('users')
      .update({ status })
      .eq('id', id);

    if (error) {
      alert(`Failed to update status: ${error.message}`);
    } else {
      location.reload();
    }
  }

  // Logout button
  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Logout failed: ' + error.message);
    } else {
      window.location.href = 'login.html';
    }
  });
});
