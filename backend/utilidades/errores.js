// Responde con un error claro.
// Si el error viene de las reglas del esquema (campo vacío, correo inválido...)
// o de un dato con formato raro, es culpa de lo enviado: código 400.
// Cualquier otro error es del servidor: código 500.
function responderError(res, error) {
  if (error.name === "ValidationError") {
    const primero = Object.values(error.errors)[0];
    const mensaje =
      primero.name === "CastError" ? "Datos inválidos." : primero.message;
    return res.status(400).json({ error: mensaje });
  }
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Datos inválidos." });
  }
  console.error(error);
  res.status(500).json({ error: "Error del servidor. Intenta más tarde." });
}

module.exports = { responderError };
