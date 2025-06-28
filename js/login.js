// login.js

// Supabase config - keep the keys as constants
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');
  const formMessage = document.getElementById('form-message');

  const tabs = document.querySelectorAll('.form-tabs button');
  const panels = document.querySelectorAll('[role="tabpanel"]');

  // Switch tab handler
  function switchTab(e) {
    const targetId = e.target.id.replace('-tab', '-panel');
    tabs.forEach(t => {
      const selected = t === e.target;
      t.setAttribute('aria-selected', selected);
      t.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(p => {
      p.hidden = p.id !== targetId;
    });
    formMessage.textContent = '';
  }

  // Back to login links (for signup and forgot password panels)
  document.querySelectorAll('[id^="back-to-login"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('login-tab').click();
    });
  });

  // Tab switching event listeners
  tabs.forEach(tab => tab.addEventListener('click', switchTab));

  // === LOGIN ===
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = 'Logging in...';

    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      formMessage.textContent = `Error: ${error.message}`;
    } else {
      formMessage.textContent = 'Login successful! Redirecting...';
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
    }
  });

  // === SIGN UP ===
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = '';

    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const confirm = signupForm['password-confirm'].value;

    if (password !== confirm) {
      formMessage.textContent = 'Passwords do not match.';
      return;
    }

    formMessage.textContent = 'Creating account...';

    const { error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
      formMessage.textContent = `Error: ${error.message}`;
    } else {
      formMessage.textContent = 'Account created! Please check your email to confirm.';
      signupForm.reset();
    }
  });

  // === FORGOT PASSWORD ===
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = 'Sending reset email...';

    const email = forgotForm.email.value;

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html'
    });

    if (error) {
      formMessage.textContent = `Error: ${error.message}`;
    } else {
      formMessage.textContent = 'Reset email sent! Check your inbox.';
      forgotForm.reset();
    }
  });
});
