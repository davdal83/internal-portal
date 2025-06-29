// store.js

const SUPABASE_URL = 'https://ngqsmsdxulgpiywlczcx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ncXNtc2R4dWxncGl5d2xjemN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwNTgxNjYsImV4cCI6MjA2NjYzNDE2Nn0.8F_tH-xhmW2Cne2Mh3lWZmHjWD8sDSZd8ZMcYV7tWnM';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function formatPhoneNumber(phone) {
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
}

document.addEventListener('DOMContentLoaded', async () => {
  const storeId = getQueryParam('id');
  const storeEl = document.getElementById('store-details');

  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', storeId)
    .single();

  if (error || !store) {
    storeEl.innerHTML = `<p>Store not found.</p>`;
    return;
  }

  storeEl.innerHTML = `
    <div class="store-card">
      <img src="${store.store_photo_url}" alt="${store.name}" />
      <div class="store-info">
        <h2>${store.name}</h2>
        <p>${store.address.trim()}, ${store.city.trim()}, ${store.state} ${store.zip_code}</p>
        <p><strong>GM:</strong> ${store.gm_name || 'N/A'}</p>
        <p><strong>Phone:</strong> ${formatPhoneNumber(store.phone_number)}</p>
      </div>
    </div>
  `;
});
