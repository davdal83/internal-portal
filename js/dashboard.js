// js/dashboard.js

// Check if user is logged in, if not redirect to login page
async function checkSession() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (!data.session) {
      window.location.href = "login.html";
      return;
    }

    // Show logged-in user email
    document.getElementById("user-email").textContent = data.session.user.email;

    // Load stores after confirming user is logged in
    await loadStores();

    // Show the stores section now that data is ready
    document.getElementById("stores-section").style.display = "block";
  } catch (error) {
    console.error("Error checking session:", error);
    window.location.href = "login.html";
  }
}

// Fetch stores from Supabase and render table rows
async function loadStores() {
  const { data: stores, error } = await supabaseClient.from("stores").select("store_name, store_number, general_manager");

  if (error) {
    console.error("Error loading stores:", error);
    return;
  }

  const tbody = document.querySelector("#stores-table tbody");
  tbody.innerHTML = "";

  stores.forEach((store) => {
    const tr = document.createElement("tr");
    // Clicking a store row could take user to a separate page (store.html?store=number)
    tr.innerHTML = `
      <td><a href="store.html?store=${store.store_number}">${store.store_name}</a></td>
      <td>${store.store_number}</td>
      <td>${store.general_manager || "N/A"}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Logout function
function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

// Expose logout to global scope so inline onclick works
window.logout = logout;

// Run session check when page loads
checkSession();
