window.addEventListener('scroll', function() {
  if (window.scrollY > 100) {
    document.querySelector('nav').classList.add('scrolled');
  } else {
    document.querySelector('nav').classList.remove('scrolled');
  }
});