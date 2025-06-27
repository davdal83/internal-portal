// js/store.js
document.addEventListener("DOMContentLoaded", async () => {
  renderNavbar(); // Assumes navbar.js has this function

  const params = new URLSearchParams(window.location.search);
  const storeId = params.get("id");

  if (!storeId) {
    alert("No store ID provided.");
    return;
  }

  try {
    const { data: store, error } = await supabaseClient
      .from("stores")
      .select("*")
      .eq("id", storeId)
      .single();

    if (error || !store) {
      alert("Failed to load store: " + (error?.message || "Store not found"));
      return;
    }

    document.getElementById("store-name").textContent = store.store_name;
    document.getElementById("store-number").textContent = store.store_number;
    document.getElementById("general-manager").textContent = store.general_manager;

    // Add more fields here as needed

  } catch (err) {
    alert("Error loading store: " + err.message);
  }
});
