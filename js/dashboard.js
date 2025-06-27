// Wait for DOM content to load before running
document.addEventListener("DOMContentLoaded", () => {
  checkSession();
});

// Check if user session exists, else redirect to login
async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      // No active session, redirect to login
      window.location.href = "login.html";
      return;
    }

    const email = data.session.user.email;
    document.getElementById("user-email").innerText = email;

    // Show stores section and load store data
    document.getElementById("stores-section").style.display = "block";
    loadStores();
  } catch (error) {
    console.error("Session error:", error);
    window.location.href = "login.html";
  }
}

// Load stores and render cards
async function loadStores() {
  const { data: stores, error } = await supabaseClient.from("stores").select("id, store_name, store_number, general_manager");
  if (error) {
    alert("Failed to load stores: " + error.message);
    return;
  }

  const container = document.getElementById("stores-container");
  container.innerHTML = ""; // Clear existing

  stores.forEach(store => {
    const card = document.createElement("div");
    card.className = "store-card";
    card.innerHTML = `
      <h3>${store.store_name}</h3>
      <p><strong>Store #:</strong> ${store.store_number}</p>
      <p><strong>GM:</strong> ${store.general_manager}</p>
    `;

    // On click go to store page (or later modal)
    card.addEventListener("click", () => {
      window.location.href = `store.html?id=${store.id}`;
    });

    container.appendChild(card);
  });
}

// Logout function
function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
