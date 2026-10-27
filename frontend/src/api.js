// Dirección del backend. En tu computador es localhost:3000.
// Cuando publiquemos, se cambia con la variable VITE_API_URL (en un archivo .env del frontend).
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Envía datos al backend en formato JSON. Si el servidor responde con error, lo lanza.
export async function enviarAlServidor(ruta, datos) {
  let respuesta;
  try {
    respuesta = await fetch(API_URL + ruta, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
  } catch (error) {
    // fetch falla así cuando no hay conexión con el servidor
    throw new Error("No pudimos conectar con el servidor. Intenta más tarde.");
  }

  const resultado = await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new Error(resultado.error || "Ocurrió un error. Intenta de nuevo.");
  }
  return resultado;
}
