import { useEffect, useState } from "react";
import { pedir } from "../api";

// Hook que pide una lista al backend (con la ficha del admin) y guarda el estado:
// los datos, si está cargando y si hubo un error. Lo usan las reseñas y los mensajes.
export default function useAdminDatos(ruta, token, salir) {
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Si el componente desaparece mientras esperamos, ignoramos la respuesta
    let cancelado = false;

    async function cargar() {
      try {
        const lista = await pedir(ruta, { token });
        if (!cancelado) setDatos(lista);
      } catch (e) {
        if (cancelado) return;
        // 401 = la sesión venció: volvemos al login
        if (e.status === 401) salir();
        else setError(e.message);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }

    cargar();
    return () => {
      cancelado = true;
    };
  }, [ruta, token, salir]);

  // Para los errores de las acciones (aprobar, borrar): misma lógica
  function manejarError(e) {
    if (e.status === 401) salir();
    else setError(e.message);
  }

  return { datos, setDatos, cargando, error, manejarError };
}
