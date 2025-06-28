document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 768) {
    const reveals = document.querySelectorAll('.reveal');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    // Instantly show content on mobile
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('visible');
    });
  }
});
