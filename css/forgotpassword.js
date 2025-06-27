document.getElementById("forgot-password").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  if (!email) {
    alert("Enter your email to receive a reset link.");
    return;
  }

  const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
    redirectTo: "https://yourdomain.com/reset.html"
  });

  if (error) {
    alert("Reset failed: " + error.message);
  } else {
    alert("Password reset link sent! Check your inbox.");
  }
});
