// Pone límites al chatbot para que nadie gaste tu crédito de IA
// (ni una persona escribiendo sin parar, ni muchas a la vez).
const MAX_POR_MINUTO = 6; // mensajes por persona (por dirección IP) cada minuto
const MAX_POR_DIA = 200; // mensajes en total, entre todos los visitantes

// Los contadores viven en la memoria del servidor (se reinician si se reinicia).
const porIp = new Map(); // ip -> { desde, cuenta }
let dia = { fecha: "", cuenta: 0 };

function limitarChat(req, res, next) {
  const ahora = Date.now();
  const hoy = new Date().toISOString().slice(0, 10); // "2026-10-28" (hora UTC)

  // Si cambió el día, el contador diario vuelve a cero
  if (dia.fecha !== hoy) dia = { fecha: hoy, cuenta: 0 };

  if (dia.cuenta >= MAX_POR_DIA) {
    return res.status(429).json({
      error: "El asistente alcanzó su límite de hoy. Vuelve mañana o escríbenos desde Contacto.",
    });
  }

  // OJO al publicar: detrás de un hosting, req.ip puede ser la del hosting y no la del
  // visitante. Lo ajustamos cuando publiquemos el backend.
  const ip = req.ip;
  let registro = porIp.get(ip);

  if (!registro || ahora - registro.desde > 60 * 1000) {
    // Para que nadie llene la memoria inventando miles de direcciones
    if (porIp.size > 5000) porIp.clear();
    registro = { desde: ahora, cuenta: 0 };
    porIp.set(ip, registro);
  }

  if (registro.cuenta >= MAX_POR_MINUTO) {
    return res.status(429).json({ error: "Vas muy rápido. Espera un minuto e intenta de nuevo." });
  }

  registro.cuenta += 1;
  dia.cuenta += 1;
  next(); // todo bien: la petición sigue su camino
}

module.exports = limitarChat;
