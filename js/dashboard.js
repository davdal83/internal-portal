// js/dashboard.js

async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = "login.html";
      return;
    }
    document.getElementById("user-email").innerText = data.session.user.email;
    document.getElementById("stores-section").style.display = "block";

    await loadStores();
  } catch (error) {
    console.error("Error checking session:", error);
    window.location.href = "login.html";
  }
}

async function loadStores() {
  const { data: stores, error } = await supabaseClient.from("stores").select("*");

  const tbody = document.querySelector("#stores-table tbody");
  if (error) {
    tbody.innerHTML = `<tr><td colspan="3">Error loading stores.</td></tr>`;
    console.error("Load stores error:", error);
    return;
  }

  tbody.innerHTML = "";

  stores.forEach(store => {
    const tr = document.createElement("tr");

    const nameCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = `store.html?storeId=${store.id}`;
    link.textContent = store.store_name;
    nameCell.appendChild(link);
    tr.appendChild(nameCell);

    const numberCell = document.createElement("td");
    numberCell.textContent = store.store_number;
    tr.appendChild(numberCell);

    const gmCell = document.createElement("td");
    gmCell.textContent = store.general_manager;
    tr.appendChild(gmCell);

    tbody.appendChild(tr);
  });
}

function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  checkSession();
});
