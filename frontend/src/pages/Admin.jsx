import { useCallback, useState } from "react";
import "../admin.css";
import LoginAdmin from "../components/LoginAdmin";
import PanelAdmin from "../components/PanelAdmin";

const CLAVE_TOKEN = "eclipse_admin_token";

// sessionStorage guarda datos en el navegador mientras la pestaña siga abierta.
// Se envuelve en try/catch porque en algunos navegadores puede estar bloqueado.
function leerToken() {
  try {
    return sessionStorage.getItem(CLAVE_TOKEN) || "";
  } catch (error) {
    return "";
  }
}

function guardarToken(token) {
  try {
    if (token) sessionStorage.setItem(CLAVE_TOKEN, token);
    else sessionStorage.removeItem(CLAVE_TOKEN);
  } catch (error) {
    // Sin almacenamiento: la sesión dura solo mientras la página esté abierta
  }
}

export default function Admin() {
  // Pasamos la función (sin paréntesis) para que React la ejecute solo la primera vez
  const [token, setToken] = useState(leerToken);

  function entrar(nuevoToken) {
    guardarToken(nuevoToken);
    setToken(nuevoToken);
  }

  // useCallback hace que "salir" sea siempre la misma función entre renders,
  // para que el hook useAdminDatos no vuelva a pedir los datos sin necesidad.
  const salir = useCallback(() => {
    guardarToken("");
    setToken("");
  }, []);

  return (
    <main className="pagina-interna">
      {/* Con token vemos el panel; sin token, el login */}
      {token ? <PanelAdmin token={token} salir={salir} /> : <LoginAdmin entrar={entrar} />}
    </main>
  );
}
