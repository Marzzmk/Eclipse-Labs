import useVisible from "../hooks/useVisible";

// Envuelve cualquier contenido y lo hace aparecer suavemente al hacer scroll.
// "children" es todo lo que se escribe entre <Animado> y </Animado>.
export default function Animado({ children }) {
  const [ref, visible] = useVisible(0.2);

  return (
    <div ref={ref} className={"animado" + (visible ? " visible" : "")}>
      {children}
    </div>
  );
}
