// js/admin-dashboard.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2xndWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener('DOMContentLoaded', async () => {
  const logoutBtn = document.getElementById('logout-button');
  const returnToUserLink = document.getElementById('return-to-user');
  const welcomeMsg = document.getElementById('welcome-message');
  const pendingUsersBody = document.getElementById('pending-users-body');

  // Modal elements
  const modal = document.getElementById('user-edit-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const editUserForm = document.getElementById('edit-user-form');

  // Input fields in modal
  const inputs = {
    id: document.getElementById('edit-user-id'),
    firstName: document.getElementById('edit-first-name'),
    lastName: document.getElementById('edit-last-name'),
    email: document.getElementById('edit-email'),
    phone: document.getElementById('edit-phone'),
    storeNumber: document.getElementById('edit-store-number'),
    role: document.getElementById('edit-role'),
    status: document.getElementById('edit-status'),
  };

  // Get current user session
  const { data: { user }, error: userError } = await supabase.auth.getUser();

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

  if (roleError) {
    console.warn('Failed to fetch user role:', roleError.message);
  }

  if (userData?.role === 'admin') {
    returnToUserLink.style.display = 'block';
  } else {
    returnToUserLink.style.display = 'none';
  }

  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabase.auth.signOut();
    if (error) alert('Logout error: ' + error.message);
    else window.location.href = 'login.html';
  });

  // Fetch and render pending users
  async function loadPendingUsers() {
    const { data: pendingUsers, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'pending');

    if (error) {
      console.error('Error fetching pending users:', error);
      pendingUsersBody.innerHTML = `<tr><td colspan="5">Error loading users.</td></tr>`;
      return;
    }

    if (!pendingUsers || pendingUsers.length === 0) {
      pendingUsersBody.innerHTML = `<tr><td colspan="5">No pending users found.</td></tr>`;
      return;
    }

    // Clear table body
    pendingUsersBody.innerHTML = '';

    pendingUsers.forEach(user => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${user.first_name} ${user.last_name}</td>
        <td>${user.email}</td>
        <td>${user.store_number ?? ''}</td>
        <td>${user.role}</td>
        <td><button class="btn-edit" data-user-id="${user.id}">Edit</button></td>
      `;

      pendingUsersBody.appendChild(tr);
    });

    // Add event listeners for Edit buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const userId = e.target.getAttribute('data-user-id');
        await openEditModal(userId);
      });
    });
  }

  async function openEditModal(userId) {
    // Fetch user data
    const { data: userData, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      alert('Failed to fetch user data: ' + error.message);
      return;
    }

    // Populate modal inputs
    inputs.id.value = userData.id;
    inputs.firstName.value = userData.first_name || '';
    inputs.lastName.value = userData.last_name || '';
    inputs.email.value = userData.email || '';
    inputs.phone.value = userData.phone || '';
    inputs.storeNumber.value = userData.store_number || '';
    inputs.role.value = userData.role || 'user';
    inputs.status.value = userData.status || 'pending';

    // Show modal
    modal.style.display = 'block';
  }

  // Close modal handlers
  closeModalBtn.onclick = () => modal.style.display = 'none';
  window.onclick = (e) => {
    if (e.target == modal) modal.style.display = 'none';
  };

  // Save edited user data
  editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = inputs.id.value;
    const updates = {
      first_name: inputs.firstName.value,
      last_name: inputs.lastName.value,
      // email is readonly - no update
      phone: inputs.phone.value,
      store_number: inputs.storeNumber.value,
      role: inputs.role.value,
      status: inputs.status.value,
    };

    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id);

    if (error) {
      alert('Update failed: ' + error.message);
      return;
    }

    alert('User updated successfully!');
    modal.style.display = 'none';
    await loadPendingUsers();
  });

  // Load pending users on page load
  await loadPendingUsers();
});
