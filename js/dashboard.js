// === Supabase Config ===
const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// === Helper ===
function formatPhoneNumber(phone) {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
}

document.addEventListener('DOMContentLoaded', async () => {
  const welcomeEl = document.getElementById('welcome-message');
  const storesEl = document.getElementById('stores-list');

  try {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    console.log('SESSION:', sessionData);

    const {
      data: { user },
      error
    } = await supabase.auth.getUser();

    if (error || !user) {
      console.warn('No user session found. Redirecting to login.');
      window.location.href = 'login.html';
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('first_name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.first_name) {
      welcomeEl.textContent = `Welcome back, ${user.email}`;
    } else {
      welcomeEl.textContent = `Welcome back, ${profile.first_name}. Let’s handle business.`;
    }

    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('*');

    if (storesError) {
      storesEl.textContent = 'Could not load store data.';
    } else if (!stores || stores.length === 0) {
      storesEl.textContent = 'No stores found.';
    } else {
      storesEl.innerHTML = stores
        .map(
          (store) => `
        <a href="store.html?id=${store.id}" class="store-link">
          <div class="store-card">
            <img src="${store.store_photo_url}" alt="Store photo for ${store.name}" />
            <div class="store-info">
              <h3>${store.name}</h3>
              <p>${store.address.trim()}, ${store.city.trim()}, ${store.state} ${store.zip_code}</p>
              <p><strong>GM:</strong> ${store.gm_name || 'N/A'}</p>
              <p><strong>Phone:</strong> ${formatPhoneNumber(store.phone_number)}</p>
            </div>
          </div>
        </a>
      `
        )
        .join('');
    }
  } catch (err) {
    console.error('Dashboard load error:', err);
    welcomeEl.textContent = 'Something went wrong. Try reloading.';
    if (storesEl) storesEl.textContent = '';
  }
});
