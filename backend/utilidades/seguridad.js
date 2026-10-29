// Funciones de seguridad. Solo usan "crypto", que ya viene incluido en Node:
// no hace falta instalar nada.
const crypto = require("crypto");
const { promisify } = require("util");

// scrypt es un algoritmo hecho para guardar contraseñas. Es lento a propósito:
// así, a quien robe la base de datos le tomaría muchísimo tiempo probar claves.
const scrypt = promisify(crypto.scrypt);
const LARGO_HASH = 64;

// Convierte una contraseña en un "hash". NUNCA se guarda la contraseña, solo esto.
// La "sal" es un texto al azar que se mezcla con la clave: dos personas con la
// misma contraseña terminan con hashes distintos.
async function crearHash(clave) {
  const sal = crypto.randomBytes(16).toString("hex");
  const hash = (await scrypt(clave, sal, LARGO_HASH)).toString("hex");
  return { sal, hash };
}

// Calcula el hash de la clave escrita y lo compara con el guardado.
async function claveCorrecta(clave, sal, hashGuardado) {
  const intento = await scrypt(clave, sal, LARGO_HASH);
  const guardado = Buffer.from(hashGuardado, "hex");
  // timingSafeEqual compara siempre en el mismo tiempo, sin importar dónde
  // difieran los textos, para que nadie pueda adivinar la clave midiendo tiempos.
  return intento.length === guardado.length && crypto.timingSafeEqual(intento, guardado);
}

// Un token es la "ficha" que recibe el navegador al iniciar sesión:
// 32 bytes al azar, imposibles de adivinar.
function crearToken() {
  return crypto.randomBytes(32).toString("hex");
}

// En la base de datos se guarda solo la huella (hash) del token, no el token.
// Así, si alguien viera la base de datos, no podría usar esas fichas.
function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

module.exports = { crearHash, claveCorrecta, crearToken, hashToken };
