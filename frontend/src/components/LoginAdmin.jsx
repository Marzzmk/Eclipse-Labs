import { useState } from "react";
import Aviso from "./Aviso";
import { pedir } from "../api";

// Formulario de inicio de sesión. "entrar" es una función que nos da la página Admin
// y que se llama con el token cuando el login sale bien.
export default function LoginAdmin({ entrar }) {
  const [form, setForm] = useState({ usuario: "", clave: "" });
  const [aviso, setAviso] = useState({ texto: "", exito: true });
  const [enviando, setEnviando] = useState(false);

  function cambiar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value });
  }

  async function enviar(evento) {
    evento.preventDefault();
    setEnviando(true);

    try {
      const { token } = await pedir("/api/admin/login", { metodo: "POST", datos: form });
      entrar(token); // la página Admin cambia sola al panel
    } catch (error) {
      setAviso({ texto: error.message, exito: false });
      setEnviando(false);
    }
  }

  return (
    <section className="contacto">
      <h2>Acceso administrador</h2>
      <p className="intro-pagina">Solo para el equipo de Eclipse Labs.</p>

      <form className="formulario" onSubmit={enviar}>
        <label htmlFor="admin-usuario">Usuario</label>
        <input
          type="text"
          id="admin-usuario"
          name="usuario"
          autoComplete="username"
          required
          value={form.usuario}
          onChange={cambiar}
        />

        <label htmlFor="admin-clave">Contraseña</label>
        <input
          type="password"
          id="admin-clave"
          name="clave"
          autoComplete="current-password"
          required
          value={form.clave}
          onChange={cambiar}
        />

        <button type="submit" className="boton" disabled={enviando}>
          Entrar
        </button>
        <Aviso aviso={aviso} />
      </form>
    </section>
  );
}
