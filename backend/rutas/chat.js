const express = require("express");
const { preguntarIA } = require("../chatbot/ia");
const limitarChat = require("../middleware/limitarChat");

const router = express.Router();

const MAX_LARGO_MENSAJE = 500; // caracteres máximos por pregunta
const MAX_LARGO_ID = 200; // un id de conversación nunca es tan largo

// POST /api/chat   (el límite de uso se revisa primero)
// El navegador manda:   { mensaje: "Hola", conversacionId: "..." }   (el id es opcional)
// El servidor responde: { respuesta: "texto de la IA", conversacionId: "..." }
router.post("/", limitarChat, async (req, res) => {
  const { mensaje, conversacionId } = req.body || {};

  // 1) Validar el mensaje. Comprobamos que sea texto (typeof) para que nadie
  //    pueda mandar un objeto raro. trim() quita espacios: "   " cuenta como vacío.
  if (typeof mensaje !== "string" || !mensaje.trim()) {
    return res.status(400).json({ error: "Escribe un mensaje." });
  }
  if (mensaje.length > MAX_LARGO_MENSAJE) {
    return res.status(400).json({ error: "El mensaje es muy largo (máximo 500 caracteres)." });
  }

  // 2) Validar el id de la conversación: si viene, debe ser un texto corto
  if (conversacionId !== undefined && conversacionId !== null) {
    if (typeof conversacionId !== "string" || conversacionId.length > MAX_LARGO_ID) {
      return res.status(400).json({ error: "Conversación inválida." });
    }
  }

  try {
    // 3) Preguntarle a Gemini
    const datos = await preguntarIA(mensaje.trim(), conversacionId || undefined);
    res.json(datos);
  } catch (error) {
    // El detalle real se anota en la terminal del backend; al visitante le damos
    // un mensaje simple (así no le mostramos datos internos).
    console.error("Error con Gemini:", error.message);

    // 429 = se pasó el límite gratuito de Gemini
    if (error.status === 429 || /RESOURCE_EXHAUSTED|429/.test(error.message)) {
      return res.status(429).json({
        error: "Estoy recibiendo muchas preguntas, intenta en un minuto.",
      });
    }
    // 503 = Gemini está saturado ("alta demanda"). Suele pasar en el modelo más nuevo.
    if (error.status === 503 || /UNAVAILABLE|high demand|503/i.test(error.message)) {
      return res.status(503).json({
        error: "El asistente tiene mucha demanda ahora mismo. Intenta de nuevo en unos segundos.",
      });
    }
    res.status(500).json({
      error: "El asistente no está disponible en este momento. Puedes escribirnos desde la página de Contacto.",
    });
  }
});

module.exports = router;