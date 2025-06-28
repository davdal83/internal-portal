// dashboard.js

  const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM'

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function initDashboard() {
  const { data: { user }, error } = await supabaseClient.auth.getUser();

  if (error || !user) {
    window.location.href = 'login.html';
    return;
  }

  // Greeting
  const fullName = (user.user_metadata && user.user_metadata.full_name) ||
                   user.email.split('@')[0].replace('.', ' ');
  const greeting = `Welcome back, ${fullName}! Ready to crush it today?`;
  document.getElementById('greeting').textContent = greeting;

  // Navigation links
  document.getElementById('nav-stores').addEventListener('click', e => {
    e.preventDefault();
    loadStores();
  });

  document.getElementById('nav-docs').addEventListener('click', e => {
    e.preventDefault();
    loadDocuments();
  });

  document.getElementById('nav-users').addEventListener('click', e => {
    e.preventDefault();
    loadUserManagement();
  });

  document.getElementById('nav-logout').addEventListener('click', async e => {
    e.preventDefault();
    await supabaseClient.auth.signOut();
    window.location.href = 'login.html';
  });

  // Load default section
  loadStores();
}

// Placeholder functions

function loadStores() {
  const content = document.getElementById('content-area');
  content.innerHTML = `
    <h2>Stores</h2>
    <p>Coming soon: Store cards will be here.</p>
  `;
}

function loadDocuments() {
  const content = document.getElementById('content-area');
  content.innerHTML = `
    <h2>Documents & Downloads</h2>
    <p>Coming soon: Documents & downloads section.</p>
  `;
}

function loadUserManagement() {
  const content = document.getElementById('content-area');
  content.innerHTML = `
    <h2>User Management</h2>
    <p>Coming soon: User management interface.</p>
  `;
}

initDashboard();
