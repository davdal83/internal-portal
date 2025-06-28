document.addEventListener('DOMContentLoaded', () => {
  const navHTML = `
    <nav class="navbar">
      <div class="nav-logo">
        <img src="images/favicon.ico" alt="Logo" />
        <span>Papa John's JAX</span>
      </div>
      <input type="checkbox" id="menu-toggle" />
      <label for="menu-toggle" class="menu-icon">&#9776;</label>
      <ul class="nav-links">
        <li><a href="index.html">Home</a></li>
        <li><a href="#">Our Stores</a></li>
        <li><a href="#">Promotions</a></li>
        <li><a href="#">Contact Us</a></li>
        <li><a href="#">Team Access</a></li>
      </ul>
    </nav>
  `;
  document.getElementById('nav-container').innerHTML = navHTML;
});
