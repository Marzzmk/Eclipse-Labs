//Menú: cambia de color al hacer scroll//
window.addEventListener('scroll', function() {
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

//Animación de aparición al hacer scroll//
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

//Contadores de estadísticas//
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

// Arranca los contadores solo cuando la sección de estadísticas se ve en pantalla
const seccionEstadisticas = document.querySelector('.estadisticas');

if (seccionEstadisticas) {
  const observadorContadores = new IntersectionObserver((entradas, observer) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        animarContadores();
        observer.unobserve(entrada.target); // solo una vez
      }
    });
  }, { threshold: 0.5 });

  observadorContadores.observe(seccionEstadisticas);
}

//Reseñas//
// OJO: por ahora las reseñas se guardan en el navegador (localStorage), así que
// solo las ve quien las escribe. Cuando tengamos backend y base de datos,
// se guardarán en el servidor para que todos las vean.
const formResena = document.getElementById('form-resena');
const listaResenas = document.getElementById('lista-resenas');

function obtenerResenas() {
  try {
    return JSON.parse(localStorage.getItem('resenas')) || [];
  } catch (error) {
    return [];
  }
}

function guardarResenas(resenas) {
  try {
    localStorage.setItem('resenas', JSON.stringify(resenas));
  } catch (error) {
    console.log('No se pudo guardar la reseña');
  }
}

function mostrarResenas() {
  const resenas = obtenerResenas();
  const mensajeVacio = document.getElementById('sin-resenas');

  // Borra las tarjetas anteriores y las vuelve a dibujar
  listaResenas.querySelectorAll('.resena').forEach(tarjeta => tarjeta.remove());
  mensajeVacio.style.display = resenas.length > 0 ? 'none' : 'block';

  resenas.forEach(resena => {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'resena';

    const estrellas = document.createElement('p');
    estrellas.className = 'estrellas-resena';
    estrellas.textContent = '★'.repeat(resena.puntuacion) + '☆'.repeat(5 - resena.puntuacion);

    // textContent (y no innerHTML) evita que alguien meta código malicioso en su reseña
    const texto = document.createElement('p');
    texto.className = 'texto-resena';
    texto.textContent = resena.comentario;

    const autor = document.createElement('p');
    autor.className = 'autor-resena';
    autor.textContent = '— ' + resena.nombre;

    tarjeta.append(estrellas, texto, autor);
    listaResenas.appendChild(tarjeta);
  });
}

if (formResena && listaResenas) {
  mostrarResenas();

  formResena.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const resenas = obtenerResenas();
    resenas.push({
      nombre: formResena.nombre.value.trim(),
      puntuacion: parseInt(formResena.puntuacion.value),
      comentario: formResena.comentario.value.trim()
    });
    guardarResenas(resenas);
    mostrarResenas();

    const aviso = document.getElementById('aviso-resena');
    aviso.textContent = '¡Gracias por tu reseña!';
    aviso.classList.add('visible');
    formResena.reset();
  });
}

//Formulario de contacto//
const formulario = document.getElementById('form-contacto');

if (formulario) {
  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault(); // evita que la página se recargue

    const datos = {
      nombre: formulario.nombre.value.trim(),
      correo: formulario.correo.value.trim(),
      asunto: formulario.asunto.value.trim(),
      mensaje: formulario.mensaje.value.trim()
    };

    // TODO: cuando tengamos el backend, aquí se enviará "datos" con fetch()
    console.log('Datos del formulario:', datos);

    const aviso = document.getElementById('aviso-form');
    aviso.textContent = '¡Gracias, ' + datos.nombre + '! Recibimos tu mensaje.';
    aviso.classList.add('visible');
    formulario.reset();
  });
}