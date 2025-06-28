// js/navbar.js
document.addEventListener("DOMContentLoaded", () => {
  const navHTML = `
    <nav class="navbar">
      <div class="nav-container">
        <div class="logo">
          <a href="index.html">Papa John's Jax</a>
        </div>
        <ul class="nav-links" id="nav-links">
          <li><a href="index.html">Home</a></li>
          <li><a href="#locations">Locations</a></li>
          <li><a href="https://www.papajohns.com" target="_blank">Order Online</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="login.html">Team Access</a></li>
        </ul>
        <div class="hamburger" id="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  `;

  document.getElementById("nav-container").innerHTML = navHTML;

  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("nav-active");
    hamburger.classList.toggle("toggle");
  });
});
