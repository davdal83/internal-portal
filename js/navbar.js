// js/navbar.js

document.addEventListener("DOMContentLoaded", async () => {
  const { data: { session } } = await supabaseClient.auth.getSession();
  const email = session?.user?.email || "User";

  const navContainer = document.getElementById("nav-container");
  if (!navContainer) return;

  navContainer.innerHTML = `
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="nav-brand">Papa John's Portal</div>
      <button class="hamburger" aria-label="Toggle navigation" aria-expanded="false" aria-controls="navbar-menu">
        ☰
      </button>
      <ul class="nav-links" id="navbar-menu" role="menubar">
        <li role="none"><span class="welcome-msg" role="menuitem" tabindex="0">Welcome, ${email}</span></li>
        <li role="none"><a href="dashboard.html" role="menuitem">Dashboard</a></li>
        <li role="none"><a href="documents.html" role="menuitem">Documents & Forms</a></li>
        <li role="none"><a href="contacts.html" role="menuitem">Team Directory</a></li>
        <li role="none"><button id="logout-btn" role="menuitem">Logout</button></li>
      </ul>
    </nav>
  `;

  document.querySelector(".hamburger").addEventListener("click", () => {
    const menu = document.getElementById("navbar-menu");
    const expanded = menu.classList.toggle("active");
    menu.setAttribute("aria-expanded", expanded);
  });

  document.getElementById("logout-btn")?.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "login.html";
  });
});
