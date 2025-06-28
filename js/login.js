// Initialize Supabase client using the global supabase object
const supabaseUrl = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener('DOMContentLoaded', () => {
  // LOGIN FORM
  const form = document.getElementById('login-form');
  const message = document.getElementById('message');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    message.style.color = '#710500';
    message.textContent = '';

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      message.textContent = 'Please enter both email and password.';
      return;
    }

    message.textContent = 'Logging in...';

    // Attempt to sign in
    const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      message.textContent = `Error: ${signInError.message}`;
      return;
    }

    const userId = signInData.user.id;

    // Check approval status and role in users table
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('status, role')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      message.textContent = 'Error retrieving user data.';
      return;
    }

    if (userData.status !== 'approved') {
      message.textContent = 'Your account is pending approval. Please wait for an admin.';
      await supabaseClient.auth.signOut();
      return;
    }

    message.style.color = '#2D5C2A';
    message.textContent = 'Login successful! Redirecting...';

    setTimeout(() => {
      if (userData.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    }, 1200);
  });

  // SIGNUP MODAL TOGGLE
  const openSignup = document.querySelector('a[href="signup.html"]');
  const closeSignup = document.getElementById('close-signup');
  const signupModal = document.getElementById('signup-modal');

  openSignup.addEventListener('click', (e) => {
    e.preventDefault();
    signupModal.classList.add('active');
  });

  closeSignup.addEventListener('click', () => {
    signupModal.classList.remove('active');
  });

  window.addEventListener('click', (e) => {
    if (e.target === signupModal) {
      signupModal.classList.remove('active');
    }
  });

  // SIGNUP FORM SUBMISSION
  const signupForm = document.getElementById('signup-form');
  const signupMessage = document.getElementById('signup-message');

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    signupMessage.style.color = '#710500';
    signupMessage.textContent = '';

    const firstName = document.getElementById('first-name').value.trim();
    const lastName = document.getElementById('last-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const storeNumber = document.getElementById('signup-store').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
      signupMessage.textContent = 'Passwords do not match.';
      return;
    }

    signupMessage.textContent = 'Creating your account...';

    try {
      // Create user in Supabase Auth
      const { data: signUpData, error: signUpError } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        signupMessage.textContent = `Error: ${signUpError.message}`;
        return;
      }

      const userId = signUpData.user.id;

      // Insert user details into users table
      const { error: insertError } = await supabaseClient.from('users').insert([
        {
          id: userId,
          first_name: firstName,
          last_name: lastName,
          phone,
          store_number: storeNumber,
          status: 'pending',
          role: 'user',
        },
      ]);

      if (insertError) {
        signupMessage.textContent = `Error: ${insertError.message}`;
        return;
      }

      signupMessage.style.color = '#2D5C2A';
      signupMessage.textContent = 'Signup submitted! Await admin approval.';

      signupForm.reset();
    } catch (error) {
      signupMessage.textContent = 'Unexpected error. Please try again later.';
      console.error(error);
    }
  });
});
