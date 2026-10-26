// Dirección del backend. Cuando lo publiquemos, cambia esta URL por la del servidor real.
const API_URL = 'http://localhost:3000';

//Menú: cambia de color al hacer scroll//
window.addEventListener('scroll', function() {
  const nav = document.querySelector('nav');
  if (window.scrollY > 100) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

//Menú hamburguesa (celulares y tablets)//
const menu = document.querySelector('nav');
const botonMenu = document.querySelector('.menu-toggle');

if (botonMenu) {
  botonMenu.addEventListener('click', () => {
    const abierto = menu.classList.toggle('abierto');
    botonMenu.setAttribute('aria-expanded', abierto);
  });

  // Al tocar un enlace, el menú se cierra
  menu.querySelectorAll('a').forEach(enlace => {
    enlace.addEventListener('click', () => {
      menu.classList.remove('abierto');
      botonMenu.setAttribute('aria-expanded', false);
    });
  });
}

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

//Ayuda: mostrar un aviso (verde si todo salió bien, rosa si hubo un error)//
function mostrarAviso(elemento, texto, exito) {
  elemento.textContent = texto;
  elemento.classList.toggle('error', !exito);
  elemento.classList.add('visible');
}

// Envía datos al backend en formato JSON. Si el servidor responde con error, lo lanza.
async function enviarAlServidor(ruta, datos) {
  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos)
    });
  } catch (error) {
    // fetch falla así cuando no hay conexión con el servidor
    throw new Error('No pudimos conectar con el servidor. Intenta más tarde.');
  }

  const resultado = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(resultado.error || 'Ocurrió un error. Intenta de nuevo.');
  }
  return resultado;
}

//Reseñas//
const formResena = document.getElementById('form-resena');
const listaResenas = document.getElementById('lista-resenas');

function mostrarResenas(resenas) {
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

// Pide al servidor las reseñas aprobadas y las muestra
async function cargarResenas() {
  try {
    const respuesta = await fetch(API_URL + '/api/resenas');
    const resenas = await respuesta.json();
    mostrarResenas(resenas);
  } catch (error) {
    console.log('No se pudieron cargar las reseñas');
  }
}

if (formResena && listaResenas) {
  cargarResenas();

  formResena.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const aviso = document.getElementById('aviso-resena');
    const boton = formResena.querySelector('button');
    boton.disabled = true; // evita enviarla dos veces

    try {
      await enviarAlServidor('/api/resenas', {
        nombre: formResena.nombre.value.trim(),
        puntuacion: parseInt(formResena.puntuacion.value),
        comentario: formResena.comentario.value.trim()
      });
      mostrarAviso(aviso, '¡Gracias! Tu reseña se publicará cuando la revisemos.', true);
      formResena.reset();
    } catch (error) {
      mostrarAviso(aviso, error.message, false);
    } finally {
      boton.disabled = false;
    }
  });
}

//Formulario de contacto//
const formulario = document.getElementById('form-contacto');

if (formulario) {
  formulario.addEventListener('submit', async (evento) => {
    evento.preventDefault(); // evita que la página se recargue

    const aviso = document.getElementById('aviso-form');
    const boton = formulario.querySelector('button');
    boton.disabled = true;

    const nombre = formulario.nombre.value.trim();

    try {
      await enviarAlServidor('/api/contacto', {
        nombre: nombre,
        correo: formulario.correo.value.trim(),
        asunto: formulario.asunto.value.trim(),
        mensaje: formulario.mensaje.value.trim()
      });
      mostrarAviso(aviso, '¡Gracias, ' + nombre + '! Recibimos tu mensaje.', true);
      formulario.reset();
    } catch (error) {
      mostrarAviso(aviso, error.message, false);
    } finally {
      boton.disabled = false;
    }
  });
}