import { useEffect, useRef, useState } from "react";
import "../chatbot.css";
import { pedir } from "../api";

const SALUDO =
  "¡Hola! Soy el asistente de Eclipse Labs. Pregúntame sobre nuestro estudio, nuestros juegos o esta página.";

// Botones con preguntas listas, para quien no sabe qué preguntar
const SUGERENCIAS = ["¿Qué es Eclipse Labs?", "¿Qué es Arcadia?", "¿Cómo puedo contactarlos?"];

export default function Chatbot() {
  // abierto: si la ventana del chat se ve o solo la burbuja
  const [abierto, setAbierto] = useState(false);
  // mensajes: la conversación. Cada uno es { role: "user" | "assistant", content: "texto" }
  const [mensajes, setMensajes] = useState([]);
  const [texto, setTexto] = useState(""); // lo que se está escribiendo
  const [enviando, setEnviando] = useState(false); // true mientras esperamos la respuesta
  const [error, setError] = useState("");
  // conversacionId: el "número de la charla" que nos da el backend (Gemini).
  // Si se lo devolvemos en cada pregunta, el bot recuerda de qué hablábamos.
  const [conversacionId, setConversacionId] = useState(null);

  // Referencia a la caja de mensajes, para poder bajarla hasta el final
  const listaRef = useRef(null);

  // Cada vez que llega un mensaje (o se abre el chat), bajamos hasta el último
  useEffect(() => {
    const lista = listaRef.current;
    if (lista) lista.scrollTop = lista.scrollHeight;
  }, [mensajes, enviando, abierto]);

  async function enviar(contenido) {
    const pregunta = contenido.trim();
    if (!pregunta || enviando) return;

    // Agregamos la pregunta a la conversación y limpiamos la caja de texto
    const conversacion = [...mensajes, { role: "user", content: pregunta }];
    setMensajes(conversacion);
    setTexto("");
    setError("");
    setEnviando(true);

    try {
      // Mandamos solo la pregunta nueva + el id de la charla (el saludo es solo visual)
      const datos = await pedir("/api/chat", {
        metodo: "POST",
        datos: { mensaje: pregunta, conversacionId },
      });
      setMensajes([...conversacion, { role: "assistant", content: datos.respuesta }]);
      setConversacionId(datos.conversacionId); // lo guardamos para la próxima pregunta
    } catch (e) {
      setError(e.message);
    } finally {
      setEnviando(false);
    }
  }

  function alEnviar(evento) {
    evento.preventDefault(); // evita que la página se recargue
    enviar(texto);
  }

  return (
    <>
      {/* Con el chat cerrado solo se ve la burbuja */}
      {!abierto && (
        <button
          className="chat-boton"
          onClick={() => setAbierto(true)}
          aria-label="Abrir el asistente de Eclipse Labs"
        >
          💬
        </button>
      )}

      {abierto && (
        <section className="chat-ventana" aria-label="Asistente de Eclipse Labs">
          <header className="chat-cabecera">
            <h3>Asistente Eclipse Labs</h3>
            <button
              className="chat-cerrar"
              onClick={() => setAbierto(false)}
              aria-label="Cerrar el asistente"
            >
              ✕
            </button>
          </header>

          <div className="chat-lista" ref={listaRef} aria-live="polite">
            <p className="chat-burbuja asistente">{SALUDO}</p>

            {/* Las sugerencias solo se ven mientras no se ha preguntado nada */}
            {mensajes.length === 0 && (
              <div className="chat-sugerencias">
                {SUGERENCIAS.map((pregunta) => (
                  <button key={pregunta} onClick={() => enviar(pregunta)}>
                    {pregunta}
                  </button>
                ))}
              </div>
            )}

            {/* Una burbuja por mensaje. Usamos el número de posición como key porque
                la lista solo crece al final y nunca se reordena. */}
            {mensajes.map((mensaje, posicion) => (
              <p
                key={posicion}
                className={"chat-burbuja " + (mensaje.role === "user" ? "usuario" : "asistente")}
              >
                {mensaje.content}
              </p>
            ))}

            {enviando && <p className="chat-burbuja asistente escribiendo">Escribiendo...</p>}
            {error && <p className="chat-error">{error}</p>}
          </div>

          <form className="chat-formulario" onSubmit={alEnviar}>
            <input
              type="text"
              value={texto}
              onChange={(evento) => setTexto(evento.target.value)}
              placeholder="Escribe tu pregunta..."
              maxLength={500}
              aria-label="Tu pregunta"
            />
            <button type="submit" disabled={enviando || !texto.trim()}>
              Enviar
            </button>
          </form>
        </section>
      )}
    </>
  );
}
