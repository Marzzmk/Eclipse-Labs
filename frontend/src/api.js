// Dirección del backend. En tu computador es localhost:3000.
// Cuando publiquemos, se cambia con la variable VITE_API_URL (en un archivo .env del frontend).
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Función general para hablar con el backend.
//  - metodo: "GET", "POST", "PATCH" o "DELETE"
//  - datos:  objeto que se envía como JSON (opcional)
//  - token:  la "ficha" del admin, para las rutas protegidas (opcional)
// Si el servidor responde con error, lo lanza (con el código en error.status).
export async function pedir(ruta, { metodo = "GET", datos, token } = {}) {
  const opciones = { method: metodo, headers: {} };

  if (datos) {
    opciones.headers["Content-Type"] = "application/json";
    opciones.body = JSON.stringify(datos);
  }
  if (token) {
    opciones.headers.Authorization = "Bearer " + token;
  }

  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, opciones);
  } catch (error) {
    // fetch falla así cuando no hay conexión con el servidor
    throw new Error("No pudimos conectar con el servidor. Intenta más tarde.");
  }

  const resultado = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    const error = new Error(resultado.error || "Ocurrió un error. Intenta de nuevo.");
    error.status = respuesta.status;
    throw error;
  }
  return resultado;
}

// Atajo para enviar datos (lo usan los formularios de contacto y reseñas)
export function enviarAlServidor(ruta, datos) {
  return pedir(ruta, { metodo: "POST", datos });
}
