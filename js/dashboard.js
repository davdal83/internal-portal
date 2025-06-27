// dashboard.js

// Format phone number helper
function formatPhoneNumber(phoneNum) {
  if (!phoneNum) return "N/A";
  let phoneStr = phoneNum.toString().replace(/\D/g, "");
  if (phoneStr.length !== 10) return phoneStr;
  return `(${phoneStr.slice(0,3)}) ${phoneStr.slice(3,6)}-${phoneStr.slice(6)}`;
}

async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();

    if (!data?.session) {
      window.location.href = 'login.html';
      return;
    }

    const email = data.session.user.email;
    document.getElementById("user-email").textContent = email;

    // Show stores section after session confirmed
    document.getElementById("stores-section").style.display = "block";
    loadStores();

  } catch (error) {
    console.error("Error checking session:", error);
    window.location.href = 'login.html';
  }
}

async function loadStores() {
  const { data: stores, error } = await supabaseClient.from("stores").select("id, store_name, store_number, general_manager");

  if (error) {
    document.getElementById("stores-container").textContent = "Error loading stores.";
    return;
  }

  const container = document.getElementById("stores-container");
  container.innerHTML = "";

  stores.forEach(store => {
    const card = document.createElement("div");
    card.className = "store-card";
    card.tabIndex = 0; // Make it keyboard focusable

    card.innerHTML = `
      <h3>${store.store_name}</h3>
      <p><strong>Store #:</strong> ${store.store_number}</p>
      <p><strong>General Manager:</strong> ${store.general_manager}</p>
    `;

    card.addEventListener("click", () => {
      // For now, just alert store info
      alert(`Store: ${store.store_name}\nNumber: ${store.store_number}\nGM: ${store.general_manager}`);

      // TODO: Replace with navigation to store detail page
      // window.location.href = `store.html?id=${store.id}`;
    });

    container.appendChild(card);
  });
}

function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = 'login.html';
  });
}

checkSession();
