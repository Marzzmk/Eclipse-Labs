import { useState } from "react";
import Animado from "../components/Animado";
import Aviso from "../components/Aviso";
import { enviarAlServidor } from "../api";

const formularioVacio = { nombre: "", correo: "", asunto: "", mensaje: "" };

export default function Contacto() {
  const [form, setForm] = useState(formularioVacio);
  const [aviso, setAviso] = useState({ texto: "", exito: true });
  const [enviando, setEnviando] = useState(false);

  // Guarda en "form" lo que el usuario escribe, campo por campo
  function cambiar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault(); // evita que la página se recargue
    setEnviando(true);

    const nombre = form.nombre.trim();

    try {
      await enviarAlServidor("/api/contacto", {
        nombre: nombre,
        correo: form.correo.trim(),
        asunto: form.asunto.trim(),
        mensaje: form.mensaje.trim(),
      });
      setAviso({ texto: "¡Gracias, " + nombre + "! Recibimos tu mensaje.", exito: true });
      setForm(formularioVacio);
    } catch (error) {
      setAviso({ texto: error.message, exito: false });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="pagina-interna">
      <Animado>
        <section className="contacto" id="contacto">
          <h2>Contáctanos</h2>
          <p className="intro-pagina">
            ¿Tienes una idea, una duda o quieres jugar con nosotros? Escríbenos.
          </p>

          <form className="formulario" onSubmit={enviar}>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Tu nombre"
              required
              value={form.nombre}
              onChange={cambiar}
            />

            <label htmlFor="correo">Correo electrónico</label>
            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="tucorreo@ejemplo.com"
              required
              value={form.correo}
              onChange={cambiar}
            />

            <label htmlFor="asunto">Asunto</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              placeholder="¿Sobre qué quieres hablar?"
              required
              value={form.asunto}
              onChange={cambiar}
            />

            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows={6}
              placeholder="Escribe tu mensaje aquí..."
              required
              value={form.mensaje}
              onChange={cambiar}
            />

            <button type="submit" className="boton" disabled={enviando}>
              Enviar mensaje
            </button>
            <Aviso aviso={aviso} />
          </form>
        </section>
      </Animado>
    </main>
  );
}
