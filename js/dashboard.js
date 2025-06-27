document.addEventListener("DOMContentLoaded", async () => {
  // Check user session or redirect to login
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = 'login.html';
      return;
    }

    // Display welcome message handled by navbar.js

    // Show stores section
    document.getElementById('stores-section').style.display = 'block';

    await loadStores();
  } catch (error) {
    console.error('Session check failed:', error);
    window.location.href = 'login.html';
  }
});

async function loadStores() {
  try {
    const { data: stores, error } = await supabaseClient
      .from('stores')
      .select('id, store_name, store_number, general_manager, header_image_url'); // Add header image URL if available

    if (error) throw error;

    const container = document.getElementById('stores-container');
    container.innerHTML = ''; // Clear existing

    stores.forEach(store => {
      const card = document.createElement('div');
      card.className = 'store-card';
      card.innerHTML = `
        ${store.header_image_url ? `<div class="store-header" style="background-image: url('${store.header_image_url}')">
          <div class="store-header-overlay">
            <h3>${store.store_name}</h3>
          </div>
        </div>` : `<h3>${store.store_name}</h3>`}
        <p><strong>Store #:</strong> ${store.store_number}</p>
        <p><strong>GM:</strong> ${store.general_manager}</p>
      `;

      card.addEventListener('click', () => {
        window.location.href = `store.html?id=${store.id}`;
      });

      container.appendChild(card);
    });
  } catch (error) {
    alert('Failed to load stores: ' + error.message);
  }
}
