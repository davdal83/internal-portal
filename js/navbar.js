// js/navbar.js

document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const contactLink = document.getElementById('contact-link');
  const contactSection = document.getElementById('contact');

  // Toggle hamburger menu on small screens
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Show contact section and scroll into view when Contact clicked
  contactLink.addEventListener('click', (e) => {
    e.preventDefault();

    // Close menu if open (mobile)
    if (navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
    }

    if (contactSection.classList.contains('hidden')) {
      contactSection.classList.remove('hidden');
    }

    contactSection.scrollIntoView({ behavior: 'smooth' });

    // Set active link styling
    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));
    contactLink.classList.add('active');
  });

  // Optional: Set Home active by default or based on current URL
  const homeLink = document.querySelector('.nav-links a[href="index.html"]');
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' ) {
    homeLink.classList.add('active');
  }
});
