// js/dashboard.js

// Format phone number helper (optional for other pages)
function formatPhoneNumber(phoneNum) {
  if (!phoneNum) return "N/A";
  let phoneStr = phoneNum.toString().replace(/\D/g, "");
  if (phoneStr.length !== 10) return phoneStr;
  return `(${phoneStr.slice(0, 3)}) ${phoneStr.slice(3, 6)}-${phoneStr.slice(6)}`;
}

// Check session and load user info and stores
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

// Load stores with minimal info and clickable names
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

    // Store Name cell with link to store page
    const nameCell = document.createElement("td");
    const link = document.createElement("a");
    link.href = `store.html?storeId=${store.id}`;
    link.textContent = store.store_name;
    nameCell.appendChild(link);
    tr.appendChild(nameCell);

    // Store number cell
    const numberCell = document.createElement("td");
    numberCell.textContent = store.store_number;
    tr.appendChild(numberCell);

    // General manager cell
    const gmCell = document.createElement("td");
    gmCell.textContent = store.general_manager;
    tr.appendChild(gmCell);

    tbody.appendChild(tr);
  });
}

// Logout function
function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// Initialize dashboard
checkSession();
