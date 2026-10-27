import Animado from "../components/Animado";
import Contador from "../components/Contador";
import Resenas from "../components/Resenas";

// Los datos viven en listas; abajo, .map() las convierte en tarjetas.
// Para agregar o quitar un servicio solo se edita esta lista.
const servicios = [
  {
    titulo: "Desarrollo de videojuegos.",
    texto:
      "Creamos videojuegos innovadores con mecánicas atractivas, diseños originales y una experiencia de juego de calidad, combinando creatividad y tecnología para ofrecer entretenimiento único.",
  },
  {
    titulo: "Publicacion y gestión de videojuegos.",
    texto:
      "Publicamos, administramos y mantenemos nuestros videojuegos, asegurando actualizaciones constantes, un rendimiento óptimo y una experiencia estable para todos los jugadores.",
  },
  {
    titulo: "Noticias y novedades sobre nuestros proyectos.",
    texto:
      "Mantente al día con las últimas actualizaciones, anuncios, eventos y avances de nuestros videojuegos, además de conocer las próximas funciones y proyectos de Eclipse Labs.",
  },
];

// Solo cifras reales. Cuando tengas más datos verdaderos, agrégalos aquí.
const estadisticas = [{ meta: 1, texto: "Videojuego en desarrollo en Roblox" }];

export default function Inicio() {
  return (
    <>
      <div className="portada" id="inicio">
        <header className="encabezado">
          <h1>Eclipse Labs</h1>
        </header>
      </div>

      <main className="contenido-principal">
        <section className="hero">
          <h2>Innovación que se juega</h2>
          <p>Estudio de desarrollo de videojuegos para todo tipo de jugadores.</p>
        </section>

        <Animado>
          <section className="estadisticas">
            {estadisticas.map((dato) => (
              <div className="estadistica" key={dato.texto}>
                <Contador meta={dato.meta} />
                <p>{dato.texto}</p>
              </div>
            ))}
          </section>
        </Animado>

        <div className="contenido">
          <Animado>
            <section className="sobre-nosotros" id="nosotros">
              <h2>¿Quienes somos?</h2>
              <p>
                En Eclipse Labs transformamos ideas en experiencias divertidas. Somos un
                estudio de desarrollo de videojuegos enfocado en crear títulos
                innovadores, divertidos y accesibles para todo tipo de jugadores. Nuestra
                plataforma reúne un catálogo de videojuegos, herramientas para la
                comunidad, un sistema de contacto y un asistente de inteligencia
                artificial diseñado para ayudar a los usuarios y mejorar su experiencia
                dentro de nuestros proyectos. Creemos que la creatividad, la tecnología y
                la innovación son la base para construir el entretenimiento del futuro.
              </p>
            </section>
          </Animado>

          <Animado>
            <section className="servicios" id="servicios">
              <h2>Nuestros servicios</h2>
              <div className="tarjetas-servicios">
                {servicios.map((servicio) => (
                  <div className="servicio" key={servicio.titulo}>
                    <h3>{servicio.titulo}</h3>
                    <p>{servicio.texto}</p>
                  </div>
                ))}
              </div>
            </section>
          </Animado>

          <Animado>
            <Resenas />
          </Animado>
        </div>
      </main>
    </>
  );
}
