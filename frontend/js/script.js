//Hover//
window.addEventListener('scroll', function() {
  if (window.scrollY > 100) {
    document.querySelector('nav').classList.add('scrolled');
  } else {
    document.querySelector('nav').classList.remove('scrolled');
  }
});
//Animacion//
const elementosAnimados = document.querySelectorAll('.animado');

const observador = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('visible');
    }
  });
}, { threshold: 0.2 });

elementosAnimados.forEach(elemento => {
  observador.observe(elemento);
});
function animarContadores() {
  const numeros = document.querySelectorAll('.numero');

  numeros.forEach(numero => {
    const meta = parseInt(numero.getAttribute('data-meta'));
    let actual = 0;
    const incremento = meta / 100;

    const intervalo = setInterval(() => {
      actual += incremento;
      if (actual >= meta) {
        numero.textContent = meta;
        clearInterval(intervalo);
      } else {
        numero.textContent = Math.floor(actual);
      }
    }, 20);
  });
}