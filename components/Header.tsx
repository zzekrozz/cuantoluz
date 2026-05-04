'use client';

import Link from 'next/link';

export default function Header() {
  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('light-mode');
      localStorage.setItem(
        'cuantoluz-theme',
        document.body.classList.contains('light-mode') ? 'light' : 'dark'
      );
    }
  };

  return (
    <nav className="main-nav">
      <Link href="/" className="logo">
        
        Cuanto<em onClick={toggleTheme}>Luz</em>
      </Link>
      <div className="nav-links">
        <Link href="/que-es-pvpc">¿Qué es el PVPC?</Link>
        <Link href="/como-ahorrar">Cómo ahorrar</Link>
        <Link href="/sobre">Sobre</Link>
      </div>
      <div className="live">
        <div className="live-dot"></div>
        Actualizado
      </div>
    </nav>
  );
}
