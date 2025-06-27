document.addEventListener("DOMContentLoaded", () => {
  checkSession();
  document.getElementById("logout-button").addEventListener("click", logout);
});

async function checkSession() {
  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) throw error;

    if (!data.session) {
      window.location.href = "login.html";
      return;
    }

    const user = data.session.user;
    const displayName = user.user_metadata?.full_name || user.email || "User";
    document.getElementById("nav-welcome").innerText = `Welcome, ${displayName}`;
    document.getElementById("stores-section").style.display = "block";

    loadStores();
  } catch (err) {
    console.error("Session error:", err);
    window.location.href = "login.html";
  }
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

    const banner = document.createElement("div");
    banner.className = "store-header";
    banner.style.backgroundImage = `url(${store.header_image_url || 'images/default-store.jpg'})`;

    const overlay = document.createElement("div");
    overlay.className = "store-header-overlay";
    overlay.innerHTML = `
      <h3>${store.store_name}</h3>
      <p>Store #: ${store.store_number}</p>
      <p>GM: ${store.general_manager}</p>
    `;

    banner.appendChild(overlay);
    card.appendChild(banner);

    card.addEventListener("click", () => {
      window.location.href = `store.html?id=${store.id}`;
    });

    container.appendChild(card);
  });
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "login.html";
}
