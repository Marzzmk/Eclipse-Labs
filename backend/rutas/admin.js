const express = require("express");
const mongoose = require("mongoose");

const Admin = require("../modelos/Admin");
const Sesion = require("../modelos/Sesion");
const Mensaje = require("../modelos/Mensaje");
const Resena = require("../modelos/Resena");
const autenticar = require("../middleware/autenticar");
const { claveCorrecta, crearToken, hashToken } = require("../utilidades/seguridad");
const { responderError } = require("../utilidades/errores");

// Un Router es un "mini servidor" con sus propias rutas.
// En servidor.js se conecta con app.use("/api/admin", ...), así que
// la ruta "/login" de aquí es en realidad "/api/admin/login".
const router = express.Router();

const HORAS_SESION = 8;
const MAX_INTENTOS = 5;
const MINUTOS_BLOQUEO = 15;

// Contador de intentos fallidos por usuario (vive en la memoria del servidor).
// Frena a quien intente adivinar la contraseña probando muchas.
const intentos = new Map();

function estaBloqueado(usuario) {
  const registro = intentos.get(usuario);
  return Boolean(registro && registro.hasta > Date.now());
}

function registrarFallo(usuario) {
  // Para que nadie llene la memoria inventando miles de usuarios
  if (intentos.size > 1000) intentos.clear();

  const registro = intentos.get(usuario) || { cuenta: 0, hasta: 0 };
  registro.cuenta += 1;
  if (registro.cuenta >= MAX_INTENTOS) {
    registro.cuenta = 0;
    registro.hasta = Date.now() + MINUTOS_BLOQUEO * 60 * 1000;
  }
  intentos.set(usuario, registro);
}

// Datos falsos para que el login tarde lo mismo cuando el usuario no existe.
// Si no, midiendo el tiempo se podría saber qué usuarios existen.
const SAL_FALSA = "00".repeat(16);
const HASH_FALSO = "00".repeat(64);

// ---------- Login (la única ruta pública de este archivo) ----------
router.post("/login", async (req, res) => {
  try {
    const { usuario, clave } = req.body || {};

    // Exigimos que sean TEXTO. Si alguien mandara un objeto como
    // {"$ne": null}, podría engañar a la búsqueda (inyección NoSQL).
    if (typeof usuario !== "string" || typeof clave !== "string" || !usuario.trim() || !clave) {
      return res.status(400).json({ error: "Escribe tu usuario y tu contraseña." });
    }
    const nombre = usuario.trim().toLowerCase();

    if (estaBloqueado(nombre)) {
      return res.status(429).json({
        error: `Demasiados intentos fallidos. Espera ${MINUTOS_BLOQUEO} minutos.`,
      });
    }

    const admin = await Admin.findOne({ usuario: nombre });
    const claveOk = await claveCorrecta(
      clave,
      admin ? admin.sal : SAL_FALSA,
      admin ? admin.hash : HASH_FALSO
    );

    if (!admin || !claveOk) {
      registrarFallo(nombre);
      // Mismo mensaje en ambos casos: no revelamos si el usuario existe
      return res.status(401).json({ error: "Usuario o contraseña incorrectos." });
    }

    intentos.delete(nombre);

    // Creamos la ficha: el navegador recibe el token; la base de datos guarda su huella
    const token = crearToken();
    await Sesion.create({
      tokenHash: hashToken(token),
      admin: admin._id,
      expira: new Date(Date.now() + HORAS_SESION * 60 * 60 * 1000),
    });

    res.json({ token });
  } catch (error) {
    responderError(res, error);
  }
});

// ---------- Desde aquí, TODAS las rutas exigen sesión iniciada ----------
router.use(autenticar);

function validarId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ error: "Identificador inválido." });
  }
  next();
}

// Cerrar sesión: borra la ficha de la base de datos
router.post("/logout", async (req, res) => {
  try {
    await Sesion.deleteOne({ _id: req.sesion._id });
    res.json({ ok: true });
  } catch (error) {
    responderError(res, error);
  }
});

// --- Mensajes de contacto ---
router.get("/mensajes", async (req, res) => {
  try {
    res.json(await Mensaje.find().sort({ createdAt: -1 }));
  } catch (error) {
    responderError(res, error);
  }
});

router.delete("/mensajes/:id", validarId, async (req, res) => {
  try {
    const borrado = await Mensaje.findByIdAndDelete(req.params.id);
    if (!borrado) return res.status(404).json({ error: "El mensaje no existe." });
    res.json({ ok: true });
  } catch (error) {
    responderError(res, error);
  }
});

// --- Reseñas (el admin ve TODAS; las pendientes salen primero) ---
router.get("/resenas", async (req, res) => {
  try {
    res.json(await Resena.find().sort({ aprobada: 1, createdAt: -1 }));
  } catch (error) {
    responderError(res, error);
  }
});

router.patch("/resenas/:id/aprobar", validarId, async (req, res) => {
  try {
    const resena = await Resena.findByIdAndUpdate(
      req.params.id,
      { aprobada: true },
      { new: true }
    );
    if (!resena) return res.status(404).json({ error: "La reseña no existe." });
    res.json(resena);
  } catch (error) {
    responderError(res, error);
  }
});

router.delete("/resenas/:id", validarId, async (req, res) => {
  try {
    const borrada = await Resena.findByIdAndDelete(req.params.id);
    if (!borrada) return res.status(404).json({ error: "La reseña no existe." });
    res.json({ ok: true });
  } catch (error) {
    responderError(res, error);
  }
});

module.exports = router;
