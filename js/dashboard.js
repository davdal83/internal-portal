// js/dashboard.js
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
});

async function checkSession() {
  const { data, error } = await supabaseClient.auth.getSession();
  if (error || !data?.session) {
    window.location.href = "login.html";
    return;
  }

  loadStores();
  document.getElementById("stores-section").style.display = "block";
}

async function loadStores() {
  const { data: stores, error } = await supabaseClient
    .from("stores")
    .select("id, store_name, store_number, general_manager, header_image_url");

  if (error) {
    alert("Failed to load stores: " + error.message);
    return;
  }

  const container = document.getElementById("stores-container");
  container.innerHTML = "";

  stores.forEach((store) => {
    const card = document.createElement("div");
    card.className = "store-card";
    card.innerHTML = `
      <div class="store-header" style="background-image: url('${store.header_image_url || "images/default-store.jpg"}');">
        <div class="store-header-overlay">
          <h3>${store.store_name}</h3>
        </div>
      </div>
      <div class="store-content">
        <p>Store #: ${store.store_number}</p>
        <p>GM: ${store.general_manager}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      window.location.href = `store.html?id=${store.id}`;
    });
    container.appendChild(card);
  });
}
