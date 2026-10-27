// Mensaje bajo los formularios: verde si todo salió bien, rosa si hubo un error.
// Recibe un objeto { texto, exito }.
export default function Aviso({ aviso }) {
  const clases =
    "aviso-form" + (aviso.texto ? " visible" : "") + (aviso.exito ? "" : " error");

  return <p className={clases}>{aviso.texto}</p>;
}
