import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div className="footer-col-title">Precio de la luz</div>
            <Link href="/">Precio luz hoy</Link>
            <Link href="/precio-luz-manana">Precio luz mañana</Link>
            <Link href="/precio-luz-por-horas">Precio por horas</Link>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Calculadoras</div>
            <Link href="/calculadoras/lavadora">Lavadora</Link>
            <Link href="/calculadoras/coche-electrico">Coche eléctrico</Link>
            <Link href="/calculadoras/aire-acondicionado">Aire acondicionado</Link>
            <Link href="/calculadoras/lavavajillas">Lavavajillas</Link>
            <Link href="/calculadoras/consumo-electrico">Consumo general</Link>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Guías</div>
            <Link href="/guias/que-es-pvpc">¿Qué es el PVPC?</Link>
            <Link href="/guias/mercado-regulado-vs-mercado-libre">Mercado regulado vs libre</Link>
            <Link href="/guias/como-funciona-precio-luz-por-horas">Cómo funciona el precio</Link>
            <Link href="/guias/como-ahorrar-luz-en-casa">Cómo ahorrar luz</Link>
            <Link href="/guias/que-electrodomesticos-consumen-mas">Qué consume más</Link>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Información</div>
            <Link href="/sobre">Sobre CuantoLuz</Link>
            <Link href="/metodologia">Metodología</Link>
            <Link href="/aviso-legal">Aviso legal</Link>
            <Link href="/politica-privacidad">Privacidad</Link>
            <Link href="/politica-cookies">Cookies</Link>
          </div>
        </div>

        <div className="footer-info">
          <p>
            Datos de Red Eléctrica de España (REE) · Actualizados automáticamente
          </p>
          <p>
            ¿Errores, sugerencias o colaboraciones?{' '}
            <a href="mailto:cuantoluz@gmail.com" style={{ color: 'var(--accent)' }}>
              cuantoluz@gmail.com
            </a>
          </p>
          <p>
            © {new Date().getFullYear()} CuantoLuz · Esta web es informativa
          </p>
        </div>
      </div>
    </footer>
  );
}
