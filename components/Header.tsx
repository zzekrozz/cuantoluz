'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Zap, Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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
    <>
      <nav className="main-nav">
        <Link href="/" className="logo">
          <span className="logo-icon">
            <Zap size={16} strokeWidth={2.5} />
          </span>
          Cuanto<em onClick={toggleTheme}>Luz</em>
        </Link>

        <div className="nav-links desktop-only">
          <Link href="/calculadoras">Calculadoras</Link>
          <Link href="/electrodomesticos">Electrodomésticos</Link>
          <Link href="/guias">Guías</Link>
        </div>

        <div className="nav-right">
          <div className="live desktop-only">
            <div className="live-dot"></div>
            Actualizado
          </div>
          <button
            type="button"
            className="menu-btn mobile-only"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="mobile-menu mobile-only">
          <Link href="/" onClick={() => setMenuOpen(false)}>Precio luz hoy</Link>
          <Link href="/precio-luz-manana" onClick={() => setMenuOpen(false)}>Precio luz mañana</Link>
          <Link href="/calculadoras" onClick={() => setMenuOpen(false)}>Calculadoras</Link>
          <Link href="/electrodomesticos" onClick={() => setMenuOpen(false)}>Electrodomésticos</Link>
          <Link href="/guias" onClick={() => setMenuOpen(false)}>Guías</Link>
          <Link href="/sobre" onClick={() => setMenuOpen(false)}>Sobre</Link>
        </div>
      )}

      <style jsx>{`
        .nav-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .menu-btn {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 10px;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text);
          cursor: pointer;
        }

        .mobile-menu {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 10px;
          margin: -4px 0 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        :global(.mobile-menu a) {
          display: block;
          padding: 12px 14px;
          color: var(--text);
          text-decoration: none;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          transition: background 0.15s;
        }

        :global(.mobile-menu a:hover) {
          background: var(--surface2);
          text-decoration: none;
        }

        .desktop-only {
          display: flex;
        }

        .mobile-only {
          display: none;
        }

        @media (max-width: 767px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
        }
      `}</style>
    </>
  );
}
