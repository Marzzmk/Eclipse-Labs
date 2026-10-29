// "irA" es la función de App para cambiar de página
export default function Footer({ irA }) {
  return (
    <footer className="pie-de-pagina" id="footer">
      <div>
        <h2>Eclipse Labs</h2>
        <p>Innovación que se juega</p>
        <h2>Contacto</h2>
        <a href="mailto:eclipselabs@gmail.com">eclipselabs@gmail.com</a>
        <a href="https://eclipselabs.com">eclipselabs.com</a>

        <a
          href="#admin"
          className="enlace-admin"
          onClick={(evento) => {
            evento.preventDefault();
            irA("admin");
          }}
        >
          Acceso administrador
        </a>
      </div>
    </footer>
  );
}
