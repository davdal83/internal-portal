// js/dashboard.js

async function checkSession() {
  try {
    const {
      data: { session },
    } = await supabaseClient.auth.getSession();

    console.log("Session:", session);

    if (!session) {
      // No active session, redirect to login
      window.location.href = "login.html";
      return;
    }

    // Display user email
    document.getElementById("user-email").textContent = session.user.email;

    // Load your app data here or call other functions

  } catch (error) {
    console.error("Error checking session:", error);
    window.location.href = "login.html";
  }
}

// Logout function
function logout() {
  supabaseClient.auth.signOut().then(() => {
    window.location.href = "login.html";
  });
}

const { data, error } = await supabaseClient.auth.getSession();
console.log("Session data:", data);
console.log("Session error:", error);


// Run session check on page load
checkSession();
