// Convierte la fecha que guarda MongoDB en algo legible: "26/10/2026, 3:20 p. m."
export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleString("es-CO");
}
