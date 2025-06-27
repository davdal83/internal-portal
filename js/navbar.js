// navbar.js
document.addEventListener("DOMContentLoaded", () => {
  // Example: Get user email from wherever you have it (update this line as needed)
  const userEmail = window.userEmail || "User";

  const navContainer = document.getElementById("navbar-container");
  navContainer.innerHTML = `
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="nav-brand">Papa John's Portal</div>

      <div class="nav-toggle" id="nav-toggle" aria-label="Toggle menu" aria-expanded="false" role="button" tabindex="0">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul class="nav-links" role="menubar">
        <li role="none"><span class="welcome-msg" role="menuitem" tabindex="0">Welcome, ${userEmail}</span></li>
        <li role="none"><a href="dashboard.html" role="menuitem" tabindex="0">Dashboard</a></li>
        <li role="none"><a href="documents.html" role="menuitem" tabindex="0">Documents & Forms</a></li>
        <li role="none"><a href="contacts.html" role="menuitem" tabindex="0">Team Directory</a></li>
        <li role="none"><button id="logout-btn" role="menuitem" tabindex="0">Logout</button></li>
      </ul>
    </nav>
  `;

  const navToggle = document.getElementById("nav-toggle");
  const navLinks = document.querySelector(".nav-links");
  const logoutBtn = document.getElementById("logout-btn");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      navToggle.classList.toggle("open");
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
    });

    navToggle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        navToggle.click();
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Your logout logic here
      console.log("Logout clicked");
      // Example: redirect to login page
      window.location.href = "login.html";
    });
  }
});

