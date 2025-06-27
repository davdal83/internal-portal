// forgot-password.js

document.addEventListener("DOMContentLoaded", () => {
  const forgotLink = document.getElementById("forgot-link");
  const modal = document.getElementById("forgot-password-modal");
  const closeModal = document.getElementById("close-modal");
  const sendReset = document.getElementById("send-reset-link");
  const resetMessage = document.getElementById("reset-message");
  const emailInput = document.getElementById("forgot-email");

  forgotLink.addEventListener("click", (e) => {
    e.preventDefault();
    modal.style.display = "flex";
    resetMessage.textContent = "";
    emailInput.value = "";
  });

  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
  });

  sendReset.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    if (!email) {
      resetMessage.textContent = "Please enter your email address.";
      return;
    }

    const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password.html`, // or your real redirect URL
    });

    if (error) {
      resetMessage.textContent = `Error: ${error.message}`;
    } else {
      resetMessage.textContent = "Check your email for a reset link.";
    }
  });
});
