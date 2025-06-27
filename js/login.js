import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = createClient(supabaseUrl, supabaseKey);

const loginForm = document.getElementById('login-form');
const messageDiv = document.getElementById('message');
const forgotBtn = document.getElementById('forgot-password-btn');
const createBtn = document.getElementById('create-account-btn');

function showMessage(msg, isError = false) {
  messageDiv.textContent = msg;
  messageDiv.style.color = isError ? 'red' : 'green';
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;
  const remember = document.getElementById('remember').checked;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password }, { 
    persistSession: remember 
  });

  if (error) {
    showMessage('Login failed: ' + error.message, true);
    return;
  }

  if (!data.user) {
    showMessage('No user returned from login.', true);
    return;
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single();

  if (profileError) {
    showMessage('Error fetching user profile: ' + profileError.message, true);
    return;
  }

  showMessage('Login successful! Redirecting...');

  if (profile.role === 'admin') {
    window.location.href = 'admin.html';
  } else {
    window.location.href = 'dashboard.html';
  }
});

forgotBtn.addEventListener('click', async () => {
  const email = prompt('Please enter your email to reset password:');
  if (!email) return;

  const { data, error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    showMessage('Password reset failed: ' + error.message, true);
  } else {
    showMessage('Password reset email sent. Check your inbox.');
  }
});

createBtn.addEventListener('click', async () => {
  const email = prompt('Enter your email for account creation:');
  const password = prompt('Enter your desired password:');

  if (!email || !password) {
    showMessage('Email and password are required to create an account.', true);
    return;
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) {
    showMessage('Account creation failed: ' + error.message, true);
  } else {
    showMessage('Account created! Please check your email to confirm your account.');
  }
});
