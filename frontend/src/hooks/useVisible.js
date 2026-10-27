import { useEffect, useRef, useState } from "react";

// Un "hook" propio: una función reutilizable que dice si un elemento ya se ve en pantalla.
// Devuelve [ref, visible]:
//  - ref: se le pone al elemento que queremos vigilar
//  - visible: pasa a true la primera vez que el elemento aparece al hacer scroll
export default function useVisible(umbral = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setVisible(true);
          observador.disconnect(); // solo la primera vez
        }
      },
      { threshold: umbral }
    );

    observador.observe(elemento);
    // Al desaparecer el componente, dejamos de vigilar
    return () => observador.disconnect();
  }, [umbral]);

  return [ref, visible];
}
