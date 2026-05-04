import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-links">
          <Link href="/sobre">Sobre</Link>
          <Link href="/que-es-pvpc">¿Qué es el PVPC?</Link>
          <Link href="/como-ahorrar">Cómo ahorrar</Link>
          <Link href="/precio-luz-manana">Precio mañana</Link>
          <Link href="/mercado-libre-vs-regulado">Mercado libre vs regulado</Link>
          <Link href="/politica-privacidad">Privacidad</Link>
          <Link href="/politica-cookies">Cookies</Link>
          <Link href="/aviso-legal">Aviso legal</Link>
        </div>
        <div className="footer-info">
          Datos de Red Eléctrica de España (REE) · Actualizados automáticamente · cuantoluz.es
          <br />
          © {new Date().getFullYear()} CuantoLuz. Esta web es informativa.
        </div>
      </div>
    </footer>
  );
}
