import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Contacto from "./pages/Contacto";

export default function App() {
  // El estado "destino" recuerda qué página se ve y, si hace falta, a qué sección bajar
  const [destino, setDestino] = useState({ pagina: "inicio", seccion: null });

  // Esta función se la pasamos a la Navbar. Crea un objeto nuevo en cada clic.
  function irA(pagina, seccion = null) {
    setDestino({ pagina, seccion });
  }

  // Cada vez que cambia el destino: baja a la sección pedida o sube al inicio
  useEffect(() => {
    if (destino.seccion) {
      document.getElementById(destino.seccion)?.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [destino]);

  return (
    <>
      <Navbar irA={irA} />

      {/* Solo se dibuja la página que corresponde */}
      {destino.pagina === "inicio" && <Inicio />}
      {destino.pagina === "catalogo" && <Catalogo />}
      {destino.pagina === "contacto" && <Contacto />}

      <Footer />
    </>
  );
}
