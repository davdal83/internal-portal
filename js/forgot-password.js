document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('forgot-password-form');
  const messageEl = document.getElementById('message');
  const errorEl = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    messageEl.style.display = 'none';
    errorEl.style.display = 'none';

    const email = form.email.value.trim();

    if (!email) {
      errorEl.textContent = 'Please enter your email address.';
      errorEl.style.display = 'block';
      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login.html',
      });

      if (error) {
        throw error;
      }

      messageEl.textContent = `If an account exists for ${email}, a reset link has been sent. Check your email.`;
      messageEl.style.display = 'block';
      form.reset();
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.style.display = 'block';
    }
  });
});
