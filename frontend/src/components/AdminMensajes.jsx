import { pedir } from "../api";
import { formatearFecha } from "../formato";
import useAdminDatos from "../hooks/useAdminDatos";
import Aviso from "./Aviso";

export default function AdminMensajes({ token, salir }) {
  const { datos: mensajes, setDatos, cargando, error, manejarError } = useAdminDatos(
    "/api/admin/mensajes",
    token,
    salir
  );

  async function borrar(id) {
    if (!window.confirm("¿Seguro que quieres borrar este mensaje?")) return;
    try {
      await pedir("/api/admin/mensajes/" + id, { metodo: "DELETE", token });
      setDatos((lista) => lista.filter((m) => m._id !== id));
    } catch (e) {
      manejarError(e);
    }
  }

  return (
    <div>
      <p className="admin-resumen">Mensajes recibidos: {mensajes.length}</p>

      {cargando && <p>Cargando...</p>}
      {error && <Aviso aviso={{ texto: error, exito: false }} />}
      {!cargando && !error && mensajes.length === 0 && <p>Aún no hay mensajes.</p>}

      {mensajes.map((mensaje) => (
        <article className="admin-item" key={mensaje._id}>
          <p className="admin-meta">
            {mensaje.nombre} · {mensaje.correo} · {formatearFecha(mensaje.createdAt)}
          </p>
          <p>
            <strong>{mensaje.asunto}</strong>
          </p>
          <p>{mensaje.mensaje}</p>

          <div className="admin-acciones">
            <button
              className="boton boton-pequeno boton-peligro"
              onClick={() => borrar(mensaje._id)}
            >
              Borrar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
