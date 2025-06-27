document.addEventListener("DOMContentLoaded", () => {
  const forgotLink = document.getElementById("forgot-password");
  const emailInput = document.getElementById("email");

  forgotLink.addEventListener("click", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    if (!email) {
      alert("Please enter your email to receive a reset link.");
      return;
    }

    const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: "https://yourdomain.com/reset.html" // Replace with your real reset handler URL
    });

    if (error) {
      alert("Reset failed: " + error.message);
    } else {
      alert("Password reset link sent! Check your inbox.");
    }
  });
});
