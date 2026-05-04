'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CookiesBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem('cuantoluz-cookies');
    if (!accepted) {
      // Pequeño delay para que no parpadee al cargar
      setTimeout(() => setShow(true), 500);
    }

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('cuantoluz-theme');
    if (savedTheme === 'light') {
      document.body.classList.add('light-mode');
    }
  }, []);

  const accept = () => {
    localStorage.setItem('cuantoluz-cookies', 'accepted');
    setShow(false);
  };

  const reject = () => {
    localStorage.setItem('cuantoluz-cookies', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="cookies-banner">
      <h4>🍪 Esta web usa cookies</h4>
      <p>
        Usamos cookies técnicas para que la web funcione, analíticas para mejorarla
        y publicitarias para mantenerla gratis. Puedes aceptar o rechazar las no esenciales.{' '}
        <Link href="/politica-cookies">Más info</Link>.
      </p>
      <div className="cookies-actions">
        <button onClick={reject}>Rechazar</button>
        <button className="accept" onClick={accept}>
          Aceptar todas
        </button>
      </div>
    </div>
  );
}
