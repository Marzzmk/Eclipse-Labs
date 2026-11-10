// ============================================================================
// ESTE ARCHIVO ES LA ÚNICA PARTE QUE HABLA CON LA IA (Gemini, de Google).
// Si algún día quieres usar otro proveedor, solo se cambia este archivo.
//
// Usamos el SDK oficial de Google: el paquete "@google/genai"
// (se instala con:  npm install @google/genai   DENTRO de la carpeta backend).
// ============================================================================
const { GoogleGenAI } = require("@google/genai");
const { INSTRUCCIONES } = require("./conocimiento");

// El "cliente" es el objeto que sabe hablar con Gemini. Se crea una sola vez,
// la primera vez que alguien pregunta (así el servidor arranca aunque aún no
// hayas puesto la clave).
let cliente = null;

function obtenerCliente() {
  if (!cliente) {
    const clave = process.env.GEMINI_API_KEY;
    if (!clave) {
      throw new Error("Falta GEMINI_API_KEY en el archivo .env");
    }
    // La clave secreta solo vive aquí, en el backend. Nunca en React.
    cliente = new GoogleGenAI({ apiKey: clave });
  }
  return cliente;
}

// Recibe la pregunta y (opcional) el id de la conversación anterior.
// Devuelve { respuesta, conversacionId }.
//
// Gemini guarda la conversación por nosotros: cada respuesta trae un "id", y si en
// la siguiente pregunta se lo devolvemos como previous_interaction_id, Gemini
// recuerda de qué hablábamos. Por eso no hay que reenviar todo el historial.
async function preguntarIA(mensaje, conversacionId) {
  const ai = obtenerCliente();

  const pedido = {
    model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
    input: mensaje,
    // Las reglas y la información de Eclipse Labs. Se envían en CADA pregunta
    // para que el bot nunca se salga de su papel.
    system_instruction: INSTRUCCIONES,
  };
  if (conversacionId) {
    pedido.previous_interaction_id = conversacionId;
  }

  // Si Gemini no responde en 20 segundos, cortamos y lanzamos un error
  // (así el chat nunca se queda en "Escribiendo..." para siempre).
  let temporizador;
  const limite = new Promise((_, rechazar) => {
    temporizador = setTimeout(
      () => rechazar(new Error("Gemini no respondió en 20 segundos")),
      20000
    );
  });
  let interaccion;
  try {
    interaccion = await Promise.race([ai.interactions.create(pedido), limite]);
  } finally {
    clearTimeout(temporizador);
  }

  const texto = (interaccion.output_text || "").trim();
  if (!texto) {
    throw new Error("La IA devolvió una respuesta vacía.");
  }
  return { respuesta: texto, conversacionId: interaccion.id };
}

module.exports = { preguntarIA };