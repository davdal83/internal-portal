<script>
  // Toggle mobile nav menu
  document.addEventListener('DOMContentLoaded', () => {
    const toggleBtn = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    toggleBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  });
</script>
