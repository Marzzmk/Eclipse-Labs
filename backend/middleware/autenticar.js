const Sesion = require("../modelos/Sesion");
const { hashToken } = require("../utilidades/seguridad");

// Un "middleware" es un guardia que se ejecuta ANTES de la ruta.
// Si la ficha es válida, llama a next() y la petición sigue su camino.
// Si no, responde 401 (no autorizado) y la ruta nunca se ejecuta.
async function autenticar(req, res, next) {
  try {
    // El navegador manda la ficha en la cabecera:  Authorization: Bearer <token>
    const cabecera = req.headers.authorization || "";
    const [tipo, token] = cabecera.split(" ");

    if (tipo !== "Bearer" || !token) {
      return res.status(401).json({ error: "Debes iniciar sesión." });
    }

    // Buscamos una sesión con esa huella que además no haya vencido
    const sesion = await Sesion.findOne({
      tokenHash: hashToken(token),
      expira: { $gt: new Date() },
    });

    if (!sesion) {
      return res.status(401).json({ error: "Tu sesión expiró. Inicia sesión de nuevo." });
    }

    req.sesion = sesion;
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error del servidor. Intenta más tarde." });
  }
}

module.exports = autenticar;
