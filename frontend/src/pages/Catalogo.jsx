import Animado from "../components/Animado";
import arkadia from "../assets/arkadia.png";

// Lista de juegos. Cuando salga uno, cambia "disponible" a true y agrega su "enlace".
const juegos = [
  {
    id: 1,
    nombre: "Arcadia",
    genero: "Obby · Roblox",
    descripcion: "Un obby para Roblox que estamos desarrollando. Muy pronto más detalles.",
    imagen: arkadia,
    disponible: false,
    enlace: "",
  },
];

export default function Catalogo() {
  return (
    <main className="pagina-interna">
      <Animado>
        <section className="catalogo" id="catalogo">
          <h2>Catálogo</h2>
          <p className="intro-pagina">Conoce los videojuegos de Eclipse Labs.</p>

          <div className="tarjetas-catalogo">
            {juegos.map((juego) => (
              <article className="juego-card" key={juego.id}>
                <img src={juego.imagen} alt={"Logo de " + juego.nombre} />
                <h3>{juego.nombre}</h3>
                <p className="juego-genero">{juego.genero}</p>
                <p>{juego.descripcion}</p>

                {/* Renderizado condicional: un botón u otro según "disponible" */}
                {juego.disponible ? (
                  <a className="boton" href={juego.enlace} target="_blank" rel="noreferrer">
                    Jugar en Roblox
                  </a>
                ) : (
                  <span className="boton boton-desactivado">Próximamente</span>
                )}
              </article>
            ))}
          </div>
        </section>
      </Animado>
    </main>
  );
}
