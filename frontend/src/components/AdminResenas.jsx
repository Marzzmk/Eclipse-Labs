import { pedir } from "../api";
import { formatearFecha } from "../formato";
import useAdminDatos from "../hooks/useAdminDatos";
import Aviso from "./Aviso";

export default function AdminResenas({ token, salir }) {
  const { datos: resenas, setDatos, cargando, error, manejarError } = useAdminDatos(
    "/api/admin/resenas",
    token,
    salir
  );

  const pendientes = resenas.filter((r) => !r.aprobada).length;

  async function aprobar(id) {
    try {
      await pedir("/api/admin/resenas/" + id + "/aprobar", { metodo: "PATCH", token });
      // Actualizamos la lista en pantalla: la reseña pasa a aprobada
      setDatos((lista) => lista.map((r) => (r._id === id ? { ...r, aprobada: true } : r)));
    } catch (e) {
      manejarError(e);
    }
  }

  async function borrar(id) {
    if (!window.confirm("¿Seguro que quieres borrar esta reseña?")) return;
    try {
      await pedir("/api/admin/resenas/" + id, { metodo: "DELETE", token });
      setDatos((lista) => lista.filter((r) => r._id !== id));
    } catch (e) {
      manejarError(e);
    }
  }

  return (
    <div>
      <p className="admin-resumen">
        Total: {resenas.length} · Pendientes de aprobar: {pendientes}
      </p>

      {cargando && <p>Cargando...</p>}
      {error && <Aviso aviso={{ texto: error, exito: false }} />}
      {!cargando && !error && resenas.length === 0 && <p>Aún no hay reseñas.</p>}

      {resenas.map((resena) => (
        <article
          className={"admin-item" + (resena.aprobada ? "" : " pendiente")}
          key={resena._id}
        >
          <p className="admin-meta">
            {resena.nombre} · {formatearFecha(resena.createdAt)}
          </p>
          <p className="estrellas-resena">
            {"★".repeat(resena.puntuacion) + "☆".repeat(5 - resena.puntuacion)}
          </p>
          <p>{resena.comentario}</p>
          <p>
            <span className={"admin-etiqueta " + (resena.aprobada ? "aprobada" : "pendiente")}>
              {resena.aprobada ? "Publicada" : "Pendiente"}
            </span>
          </p>

          <div className="admin-acciones">
            {!resena.aprobada && (
              <button className="boton boton-pequeno" onClick={() => aprobar(resena._id)}>
                Aprobar
              </button>
            )}
            <button
              className="boton boton-pequeno boton-peligro"
              onClick={() => borrar(resena._id)}
            >
              Borrar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
