import { useEffect, useState } from "react";
import { API_URL, enviarAlServidor } from "../api";
import Aviso from "./Aviso";

const formularioVacio = { nombre: "", puntuacion: "", comentario: "" };

export default function Resenas() {
  // Estados: datos que, al cambiar, hacen que React vuelva a dibujar el componente
  const [resenas, setResenas] = useState([]);
  const [form, setForm] = useState(formularioVacio);
  const [aviso, setAviso] = useState({ texto: "", exito: true });
  const [enviando, setEnviando] = useState(false);

  // useEffect con [] se ejecuta una sola vez, cuando el componente aparece
  useEffect(() => {
    async function cargar() {
      try {
        const respuesta = await fetch(API_URL + "/api/resenas");
        const datos = await respuesta.json();
        if (respuesta.ok) setResenas(datos);
      } catch (error) {
        console.log("No se pudieron cargar las reseñas");
      }
    }
    cargar();
  }, []);

  // Se ejecuta cada vez que el usuario escribe en un campo
  function cambiar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true); // bloquea el botón para no enviar dos veces

    try {
      await enviarAlServidor("/api/resenas", {
        nombre: form.nombre.trim(),
        puntuacion: parseInt(form.puntuacion),
        comentario: form.comentario.trim(),
      });
      setAviso({
        texto: "¡Gracias! Tu reseña se publicará cuando la revisemos.",
        exito: true,
      });
      setForm(formularioVacio);
    } catch (error) {
      setAviso({ texto: error.message, exito: false });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="resenas" id="resenas">
      <h2>Reseñas de la comunidad</h2>
      <p className="intro-pagina">Cuéntanos qué piensas de Eclipse Labs.</p>

      <div className="tarjetas-resenas">
        {/* Si no hay reseñas mostramos un mensaje; si hay, una tarjeta por cada una */}
        {resenas.length === 0 && (
          <p className="sin-resenas">Aún no hay reseñas. ¡Sé la primera persona en opinar!</p>
        )}

        {resenas.map((resena) => (
          <div className="resena" key={resena._id}>
            <p className="estrellas-resena">
              {"★".repeat(resena.puntuacion) + "☆".repeat(5 - resena.puntuacion)}
            </p>
            {/* React escapa el texto solo: nadie puede meter código malicioso aquí */}
            <p className="texto-resena">{resena.comentario}</p>
            <p className="autor-resena">— {resena.nombre}</p>
          </div>
        ))}
      </div>

      <form className="formulario formulario-resena" onSubmit={enviar}>
        <h3>Deja tu reseña</h3>

        <label htmlFor="resena-nombre">Nombre</label>
        <input
          type="text"
          id="resena-nombre"
          name="nombre"
          placeholder="Tu nombre"
          maxLength={40}
          required
          value={form.nombre}
          onChange={cambiar}
        />

        <label htmlFor="resena-puntuacion">Puntuación</label>
        <select
          id="resena-puntuacion"
          name="puntuacion"
          required
          value={form.puntuacion}
          onChange={cambiar}
        >
          <option value="">Elige una puntuación</option>
          <option value="5">★★★★★ (5)</option>
          <option value="4">★★★★☆ (4)</option>
          <option value="3">★★★☆☆ (3)</option>
          <option value="2">★★☆☆☆ (2)</option>
          <option value="1">★☆☆☆☆ (1)</option>
        </select>

        <label htmlFor="resena-comentario">Comentario</label>
        <textarea
          id="resena-comentario"
          name="comentario"
          rows={4}
          maxLength={300}
          placeholder="¿Qué te pareció?"
          required
          value={form.comentario}
          onChange={cambiar}
        />

        <button type="submit" className="boton" disabled={enviando}>
          Publicar reseña
        </button>
        <Aviso aviso={aviso} />
      </form>
    </section>
  );
}
