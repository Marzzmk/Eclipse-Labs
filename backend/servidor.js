require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Mensaje = require("./modelos/Mensaje");
const Resena = require("./modelos/Resena");

const app = express();
const PUERTO = process.env.PORT || 3000;

// ---------- Configuración ----------
// cors permite que tu página (que vive en otro dominio, como GitHub Pages)
// pueda hablar con este servidor. FRONTEND_URL limita quién puede hacerlo.
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
// express.json() convierte el cuerpo de las peticiones (JSON) en un objeto: req.body
app.use(express.json());

// ---------- Ayuda ----------
// Responde con un error claro. Si el error viene de las reglas del esquema
// (campo vacío, correo inválido...) es culpa de los datos enviados: código 400.
// Cualquier otro error es del servidor: código 500.
function responderError(res, error) {
  if (error.name === "ValidationError") {
    const primero = Object.values(error.errors)[0];
    const mensaje =
      primero.name === "CastError" ? "Datos inválidos." : primero.message;
    return res.status(400).json({ error: mensaje });
  }
  console.error(error);
  res.status(500).json({ error: "Error del servidor. Intenta más tarde." });
}

// ---------- Rutas ----------

// Para comprobar que el servidor está vivo
app.get("/api/estado", (req, res) => {
  res.json({ ok: true, mensaje: "Servidor de Eclipse Labs funcionando" });
});

// Recibe el formulario de contacto
app.post("/api/contacto", async (req, res) => {
  try {
    // Sacamos SOLO los campos que esperamos; cualquier otro dato se ignora
    const { nombre, correo, asunto, mensaje } = req.body || {};
    await Mensaje.create({ nombre, correo, asunto, mensaje });
    res.status(201).json({ ok: true });
  } catch (error) {
    responderError(res, error);
  }
});

// Devuelve solo las reseñas aprobadas (las públicas), las más nuevas primero
app.get("/api/resenas", async (req, res) => {
  try {
    const resenas = await Resena.find({ aprobada: true })
      .sort({ createdAt: -1 })
      .select("nombre puntuacion comentario createdAt");
    res.json(resenas);
  } catch (error) {
    responderError(res, error);
  }
});

// Recibe una reseña nueva. Queda pendiente hasta que el admin la apruebe.
app.post("/api/resenas", async (req, res) => {
  try {
    // OJO: NO tomamos "aprobada" del body. Si lo hiciéramos, cualquiera podría
    // mandar aprobada: true y publicar su reseña sin revisión.
    const { nombre, puntuacion, comentario } = req.body || {};
    await Resena.create({ nombre, puntuacion, comentario });
    res.status(201).json({ ok: true });
  } catch (error) {
    responderError(res, error);
  }
});

// ---------- Errores ----------
// Ruta que no existe
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada." });
});

// JSON mal formado u otro error inesperado
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(400).json({ error: "Datos inválidos." });
});

// ---------- Arrancar ----------
// Primero nos conectamos a MongoDB y, solo si funciona, abrimos el servidor.
async function iniciar() {
  if (!process.env.MONGODB_URI) {
    console.error("Falta MONGODB_URI en el archivo .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");

    app.listen(PUERTO, () => {
      console.log(`Servidor corriendo en http://localhost:${PUERTO}`);
    });
  } catch (error) {
    console.error("No se pudo conectar a MongoDB:", error.message);
    process.exit(1);
  }
}

iniciar();