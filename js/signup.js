document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const messageEl = document.getElementById('message');
  const errorEl = document.getElementById('error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    messageEl.style.display = 'none';
    errorEl.style.display = 'none';

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      errorEl.textContent = 'Please fill in all fields.';
      errorEl.style.display = 'block';
      return;
    }

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      messageEl.textContent = `Success! Please check ${email} for a confirmation email.`;
      messageEl.style.display = 'block';
      form.reset();
    } catch (error) {
      errorEl.textContent = error.message;
      errorEl.style.display = 'block';
    }
  });
});
