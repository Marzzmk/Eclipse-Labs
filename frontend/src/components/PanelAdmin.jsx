import { useState } from "react";
import { pedir } from "../api";
import AdminResenas from "./AdminResenas";
import AdminMensajes from "./AdminMensajes";

// El panel que ve el admin ya con sesión iniciada.
export default function PanelAdmin({ token, salir }) {
  // Qué pestaña se ve: "resenas" o "mensajes"
  const [pestana, setPestana] = useState("resenas");

  async function cerrarSesion() {
    try {
      // Le avisamos al servidor para que borre la ficha
      await pedir("/api/admin/logout", { metodo: "POST", token });
    } catch (error) {
      // Aunque falle, igual cerramos la sesión en este navegador
    }
    salir();
  }

  return (
    <section className="admin">
      <div className="admin-barra">
        <h2>Panel de administración</h2>
        <button className="boton boton-pequeno" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      <div className="admin-pestanas">
        <button
          className={"boton boton-pequeno" + (pestana === "resenas" ? " activa" : "")}
          onClick={() => setPestana("resenas")}
        >
          Reseñas
        </button>
        <button
          className={"boton boton-pequeno" + (pestana === "mensajes" ? " activa" : "")}
          onClick={() => setPestana("mensajes")}
        >
          Mensajes
        </button>
      </div>

      {pestana === "resenas" ? (
        <AdminResenas token={token} salir={salir} />
      ) : (
        <AdminMensajes token={token} salir={salir} />
      )}
    </section>
  );
}
