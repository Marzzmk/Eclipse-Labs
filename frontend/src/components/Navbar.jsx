import { useEffect, useState } from "react";

// Cada enlace dice a qué página va y, si hace falta, a qué sección bajar.
const enlaces = [
  { texto: "Inicio", pagina: "inicio", seccion: "inicio" },
  { texto: "Sobre nosotros", pagina: "inicio", seccion: "nosotros" },
  { texto: "Servicios", pagina: "inicio", seccion: "servicios" },
  { texto: "Catálogo", pagina: "catalogo" },
  { texto: "Contacto", pagina: "contacto" },
];

// "irA" es una función que nos pasa App para cambiar de página.
export default function Navbar({ irA }) {
  // Dos estados: si ya hicimos scroll (cambia el color) y si el menú móvil está abierto
  const [conScroll, setConScroll] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const alHacerScroll = () => setConScroll(window.scrollY > 100);
    window.addEventListener("scroll", alHacerScroll);
    // Al quitar el componente, dejamos de escuchar el scroll
    return () => window.removeEventListener("scroll", alHacerScroll);
  }, []);

  function manejarClic(evento, enlace) {
    evento.preventDefault(); // evita que el navegador salte o recargue
    setAbierto(false);
    irA(enlace.pagina, enlace.seccion);
  }

  const clases = (conScroll ? "scrolled " : "") + (abierto ? "abierto" : "");

  return (
    <nav className={clases}>
      <button
        className="menu-toggle"
        aria-label="Abrir menú"
        aria-expanded={abierto}
        onClick={() => setAbierto(!abierto)}
      >
        ☰
      </button>

      {/* .map() crea un <a> por cada enlace de la lista. "key" ayuda a React a distinguirlos */}
      {enlaces.map((enlace) => (
        <a
          key={enlace.texto}
          href={"#" + (enlace.seccion || enlace.pagina)}
          onClick={(evento) => manejarClic(evento, enlace)}
        >
          {enlace.texto}
        </a>
      ))}
    </nav>
  );
}
