// login-handler.js

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const messageDiv = document.getElementById("login-message");
  const rememberMeCheckbox = document.getElementById("remember-me");

  // Smart auto-login (only if session exists & remember me is set)
  smartAutoLogin();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageDiv.textContent = "";

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        messageDiv.textContent = `Login failed: ${error.message}`;
        return;
      }

      // Save "remember me" flag
      if (rememberMeCheckbox.checked) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Redirect on successful login
      window.location.href = "dashboard.html";
    } catch (err) {
      messageDiv.textContent = `Login error: ${err.message}`;
    }
  });
});

// Auto-login only if rememberMe is set
async function smartAutoLogin() {
  const rememberMe = localStorage.getItem("rememberMe");
  if (!rememberMe) return;

  try {
    const { data, error } = await supabaseClient.auth.getSession();
    if (error) {
      console.error("Auto-login session error:", error.message);
      return;
    }

    if (data?.session) {
      window.location.href = "dashboard.html";
    }
  } catch (err) {
    console.error("Auto-login failed:", err.message);
  }
}
