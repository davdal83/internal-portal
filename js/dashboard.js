document.addEventListener("DOMContentLoaded", () => {
  checkSession();
});

async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = "login.html";
      return;
    }

    document.getElementById("user-email").innerText = data.session.user.email;
    document.getElementById("stores-section").style.display = "block";
    loadStores();
  } catch (error) {
    console.error("Session error:", error);
    window.location.href = "login.html";
  }
}

async function loadStores() {
  const { data: stores, error } = await supabaseClient
    .from("stores")
    .select("id, store_name, store_number, general_manager");

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
      <h3>${store.store_name}</h3>
      <p><strong>Store #:</strong> ${store.store_number}</p>
      <p><strong>GM:</strong> ${store.general_manager}</p>
    `;

    card.addEventListener("click", () => {
      window.location.href = `store.html?id=${store.id}`;
    });

    container.appendChild(card);
  });
}

function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}
