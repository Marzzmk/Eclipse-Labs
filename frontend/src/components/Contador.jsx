import { useEffect, useState } from "react";
import useVisible from "../hooks/useVisible";

// Número que cuenta desde 0 hasta "meta" cuando aparece en pantalla.
// "meta" es una prop: un dato que le pasamos desde afuera.
export default function Contador({ meta }) {
  const [ref, visible] = useVisible(0.5);
  const [valor, setValor] = useState(0);

  useEffect(() => {
    if (!visible) return;

    let actual = 0;
    const incremento = meta / 100;

    const intervalo = setInterval(() => {
      actual += incremento;
      if (actual >= meta) {
        setValor(meta);
        clearInterval(intervalo);
      } else {
        setValor(Math.floor(actual));
      }
    }, 20);

    return () => clearInterval(intervalo);
  }, [visible, meta]);

  return (
    <h3 ref={ref} className="numero">
      {valor}
    </h3>
  );
}
