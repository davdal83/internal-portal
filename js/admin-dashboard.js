document.addEventListener('DOMContentLoaded', async () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
  const supabaseAnonKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

  // Create Supabase client
  const supabase = supabase.createClient(supabaseUrl, supabaseAnonKey);

  // DOM Elements
  const logoutBtn = document.getElementById('logout-button');
  const returnToUserLink = document.getElementById('return-to-user');
  const welcomeMsg = document.getElementById('welcome-message');
  const pendingUsersBody = document.getElementById('pending-users-body');

  // Modal Elements
  const userEditModal = document.getElementById('user-edit-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const cancelEditBtn = document.getElementById('cancel-edit');
  const editUserForm = document.getElementById('edit-user-form');

  // Check auth session
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    window.location.href = 'login.html';
    return;
  }

  welcomeMsg.textContent = `Welcome, ${user.email}`;

  // Get current user role from users table
  const { data: userData, error: roleError } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (roleError) {
    console.warn('Could not get user role:', roleError.message);
  }

  // Show or hide return to user dashboard link for admins
  if (userData?.role === 'admin') {
    returnToUserLink.style.display = 'block';
    returnToUserLink.href = 'dashboard.html';
  } else {
    returnToUserLink.style.display = 'none';
  }

  // Logout handler
  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert('Error logging out: ' + error.message);
    } else {
      window.location.href = 'login.html';
    }
  });

  // Load pending users and render table
  async function loadPendingUsers() {
    const { data: users, error } = await supabase
      .from('users')
      .select(
        'id, first_name, last_name, email, store_number, role, status'
      )
      .eq('status', 'pending')
      .order('created_at', { ascending: true });

    if (error) {
      alert('Error loading users: ' + error.message);
      return;
    }

    // Clear existing rows
    pendingUsersBody.innerHTML = '';

    if (!users || users.length === 0) {
      const noRow = document.createElement('tr');
      noRow.innerHTML =
        '<td colspan="5" style="text-align:center; font-style: italic;">No pending users found.</td>';
      pendingUsersBody.appendChild(noRow);
      return;
    }

    users.forEach((user) => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${user.first_name || ''} ${user.last_name || ''}</td>
        <td>${user.email}</td>
        <td>${user.store_number || ''}</td>
        <td>${user.role}</td>
      `;

      // Create Action cell with View/Edit button
      const actionTd = document.createElement('td');
      const editBtn = document.createElement('button');
      editBtn.textContent = 'View / Edit';
      editBtn.className = 'edit-btn';
      editBtn.addEventListener('click', () => openEditModal(user));
      actionTd.appendChild(editBtn);

      tr.appendChild(actionTd);
      pendingUsersBody.appendChild(tr);
    });
  }

  // Open modal and prefill data
  function openEditModal(user) {
    userEditModal.style.display = 'flex';

    document.getElementById('edit-user-id').value = user.id;
    document.getElementById('edit-first-name').value = user.first_name || '';
    document.getElementById('edit-last-name').value = user.last_name || '';
    document.getElementById('edit-email').value = user.email || '';
    document.getElementById('edit-phone').value = user.phone || '';
    document.getElementById('edit-store-number').value = user.store_number || '';
    document.getElementById('edit-role').value = user.role || 'user';
    document.getElementById('edit-status').value = user.status || 'pending';
  }

  // Close modal helpers
  function closeEditModal() {
    userEditModal.style.display = 'none';
  }

  closeModalBtn.onclick = closeEditModal;
  cancelEditBtn.onclick = closeEditModal;
  window.onclick = function (event) {
    if (event.target === userEditModal) {
      closeEditModal();
    }
  };

  // Handle user edit form submit
  editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-user-id').value;
    const first_name = document.getElementById('edit-first-name').value.trim();
    const last_name = document.getElementById('edit-last-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    const store_number = document.getElementById('edit-store-number').value.trim();
    const role = document.getElementById('edit-role').value;
    const status = document.getElementById('edit-status').value;

    try {
      const { error } = await supabase
        .from('users')
        .update({ first_name, last_name, phone, store_number, role, status })
        .eq('id', id);

      if (error) throw error;

      alert('User updated successfully!');
      closeEditModal();
      loadPendingUsers();
    } catch (error) {
      alert('Error updating user: ' + error.message);
    }
  });

  // Initial load
  loadPendingUsers();
});
