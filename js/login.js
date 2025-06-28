// login.js

// Supabase config — update with your keys
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = supabaseCreateClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function supabaseCreateClient(url, key) {
  // Dynamically load supabase script and create client after loaded
  return new Promise((resolve, reject) => {
    if (window.supabase) {
      resolve(window.supabase.createClient(url, key));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/supabase.min.js';
    script.onload = () => {
      resolve(supabase.createClient(url, key));
    };
    script.onerror = () => reject(new Error('Failed to load Supabase SDK'));
    document.head.appendChild(script);
  });
}

(async () => {
  const supabaseClient = await supabase;

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const forgotForm = document.getElementById('forgot-form');
  const formMessage = document.getElementById('form-message');

  // Tabs
  const tabs = document.querySelectorAll('.form-tabs button');
  const panels = document.querySelectorAll('[role="tabpanel"]');

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

  tabs.forEach(tab => tab.addEventListener('click', switchTab));

  // LOGIN
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = 'Logging in...';
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      formMessage.textContent = `Error: ${error.message}`;
      return;
    }

    formMessage.textContent = 'Login successful! Redirecting…';

    // Redirect to internal dashboard or wherever you want
    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  });

  // SIGNUP
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = '';

    const email = signupForm.email.value;
    const password = signupForm.password.value;
    const confirmPassword = signupForm['password-confirm'].value;

    if (password !== confirmPassword) {
      formMessage.textContent = 'Passwords do not match.';
      return;
    }

    formMessage.textContent = 'Creating account...';

    const { data, error } = await supabaseClient.auth.signUp({ email, password });

    if (error) {
      formMessage.textContent = `Error: ${error.message}`;
      return;
    }

    formMessage.textContent = 'Sign up successful! Please check your email to confirm your account.';
    signupForm.reset();
  });

  // FORGOT PASSWORD
  forgotForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formMessage.textContent = 'Sending reset email...';

    const email = forgotForm.email.value;
    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/login.html'
    });

    if (error) {
      formMessage.textContent = `Error: ${error.message}`;
      return;
    }

    formMessage.textContent = 'Password reset email sent! Check your inbox.';
    forgotForm.reset();
  });

})();
