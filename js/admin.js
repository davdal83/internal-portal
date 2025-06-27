document.addEventListener('DOMContentLoaded', async () => {
  const logoutLink = document.getElementById('logout-link');
  const addUserBtn = document.getElementById('add-user-btn');

  const adminEmails = await getAdminEmails();

  // Check session and admin access
  const {
    data: { session },
    error: sessionError,
  } = await supabaseClient.auth.getSession();

  if (sessionError || !session) {
    window.location.href = 'login.html';
    return;
  }

  const userEmail = session.user.email.toLowerCase();

  if (!adminEmails.includes(userEmail)) {
    alert('Access denied: You are not an admin.');
    window.location.href = 'dashboard.html';
    return;
  }

  logoutLink.addEventListener('click', async (e) => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  });

  addUserBtn.addEventListener('click', showAddUserForm);

  await loadUsers();
});

async function getAdminEmails() {
  const { data, error } = await supabaseClient.from('admin').select('email');
  if (error) {
    console.error('Failed to fetch admin emails:', error.message);
    return [];
  }
  return data.map((item) => item.email.toLowerCase());
}

async function loadUsers() {
  const container = document.getElementById('users-container');
  container.innerHTML = '<p>Loading users...</p>';

  const { data, error } = await supabaseClient
    .from('users')
    .select('*')
    .order('Display', { ascending: true });

  if (error) {
    container.innerHTML = `<p>Error loading users: ${error.message}</p>`;
    return;
  }

  if (!data.length) {
    container.innerHTML = '<p>No users found.</p>';
    return;
  }

  container.innerHTML = ''; // clear container

  data.forEach((user) => {
    const div = document.createElement('div');
    div.className = 'user-row';
    div.dataset.userid = user.UID;

    div.innerHTML = `
      <input type="text" class="user-display" value="${escapeHtml(
        user.Display || ''
      )}" placeholder="Display Name" />
      <input type="text" class="user-name" value="${escapeHtml(
        user.Name || ''
      )}" placeholder="Full Name" />
      <input type="email" class="user-email" value="${escapeHtml(
        user.Email
      )}" placeholder="Email" disabled />
      <input type="tel" class="user-phone" value="${escapeHtml(
        user.Phone || ''
      )}" placeholder="Phone" />
      <input type="text" class="user-providers" value="${escapeHtml(
        user.Providers || ''
      )}" placeholder="Providers" disabled />
      <input type="text" class="user-provider-type" value="${escapeHtml(
        user['Provider Type'] || ''
      )}" placeholder="Provider Type" disabled />
      <input type="text" class="user-created" value="${escapeHtml(
        user['Created at'] || ''
      )}" placeholder="Created At" disabled />
      <input type="text" class="user-last-signin" value="${escapeHtml(
        user['Last sign in at'] || ''
      )}" placeholder="Last Sign In" disabled />
      <button class="save-btn">Save</button>
      <button class="delete-btn">Delete</button>
    `;

    container.appendChild(div);

    div.querySelector('.save-btn').addEventListener('click', () => saveUser(user.UID, div));
    div.querySelector('.delete-btn').addEventListener('click', () => deleteUser(user.UID, div));
  });
}

function showAddUserForm() {
  const container = document.getElementById('users-container');

  if (document.getElementById('add-user-form')) return; // prevent multiple forms

  const form = document.createElement('div');
  form.id = 'add-user-form';
  form.className = 'user-row';

  form.innerHTML = `
    <input type="text" id="new-display" placeholder="Display Name" />
    <input type="text" id="new-name" placeholder="Full Name" />
    <input type="email" id="new-email" placeholder="Email" />
    <input type="tel" id="new-phone" placeholder="Phone" />
    <button id="add-user-save-btn">Add User</button>
    <button id="add-user-cancel-btn">Cancel</button>
  `;

  container.prepend(form);

  document.getElementById('add-user-save-btn').addEventListener('click', addUser);
  document.getElementById('add-user-cancel-btn').addEventListener('click', () => {
    form.remove();
  });
}

async function addUser() {
  const display = document.getElementById('new-display').value.trim();
  const name = document.getElementById('new-name').value.trim();
  const email = document.getElementById('new-email').value.trim().toLowerCase();
  const phone = document.getElementById('new-phone').value.trim();

  if (!display || !name || !email) {
    alert('Display, Name, and Email are required.');
    return;
  }

  const { error } = await supabaseClient.from('users').insert([
    { Display: display, Name: name, Email: email, Phone: phone },
  ]);

  if (error) {
    alert('Error adding user: ' + error.message);
    return;
  }

  alert('User added successfully!');
  document.getElementById('add-user-form').remove();
  loadUsers();
}

async function saveUser(uid, div) {
  const display = div.querySelector('.user-display').value.trim();
  const name = div.querySelector('.user-name').value.trim();
  const phone = div.querySelector('.user-phone').value.trim();

  const { error } = await supabaseClient
    .from('users')
    .update({
      Display: display,
      Name: name,
      Phone: phone,
    })
    .eq('UID', uid);

  if (error) {
    alert('Error updating user: ' + error.message);
    return;
  }

  alert('User updated!');
  loadUsers();
}

async function deleteUser(uid) {
  if (!confirm('Are you sure you want to delete this user?')) return;

  const { error } = await supabaseClient.from('users').delete().eq('UID', uid);

  if (error) {
    alert('Error deleting user: ' + error.message);
    return;
  }

  alert('User deleted!');
  loadUsers();
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function (m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[m];
  });
}
