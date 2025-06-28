document.addEventListener('DOMContentLoaded', () => {
  const navHTML = `
    <nav class="navbar">
      <div class="nav-logo">
        <img src="images/favicon.ico" alt="Logo" />
        Papa Johns Jax
      </div>

      <input type="checkbox" id="menu-toggle" />
      <label for="menu-toggle" class="menu-icon">&#9776;</label>

      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="stores.html">Our Stores</a></li>
        <li><a href="promotions.html">Promotions</a></li>
        <li><a href="team.html">The Team</a></li>
        <li><a href="login.html">Team Access</a></li>
      </ul>
    </nav>
    <div class="nav-spacer"></div>
  `;

  document.getElementById('nav-container').innerHTML = navHTML;

  // Dynamically size the spacer to match the navbar
  const navbar = document.querySelector('.navbar');
  const spacer = document.querySelector('.nav-spacer');

  if (navbar && spacer) {
    spacer.style.height = `${navbar.offsetHeight + 10}px`; // add a little buffer
  }
});
