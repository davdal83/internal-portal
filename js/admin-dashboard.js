document.addEventListener('DOMContentLoaded', async () => {
  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; // Your full anon key
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

  const logoutBtn = document.getElementById('logout-button');
  const returnUserLink = document.getElementById('return-to-user');
  const welcomeMsg = document.getElementById('welcome-message');
  const tbody = document.getElementById('pending-users-body');

  const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
  if (userError || !user) return (window.location.href = 'login.html');

  welcomeMsg.textContent = `Welcome, ${user.email}`;

  const { data: userData, error: roleError } = await supabaseClient
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  if (userData?.role === 'admin') {
    returnUserLink.style.display = 'block';
  }

  async function loadPendingUsers() {
    const { data: users, error } = await supabaseClient
      .from('users')
      .select('id, first_name, last_name, email, store_number, role')
      .eq('approved', false);

    if (error) {
      console.error('Error loading users:', error.message);
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

  function addActionListeners() {
    document.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const { error } = await supabaseClient
          .from('users')
          .update({ approved: true })
          .eq('id', id);
        if (!error) loadPendingUsers();
      });
    });

    document.querySelectorAll('.deny-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const { error } = await supabaseClient
          .from('users')
          .delete()
          .eq('id', id);
        if (!error) loadPendingUsers();
      });
    });
  }

  loadPendingUsers();

  logoutBtn.addEventListener('click', async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (!error) window.location.href = 'login.html';
  });
});
