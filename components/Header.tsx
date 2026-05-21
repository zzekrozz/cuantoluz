'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

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
  <header className="site-header">
    <nav className="main-nav">
      <Link href="/" className="logo">
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
      .site-header {
        position: relative;
        z-index: 100;
      }

      .nav-right {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
      }

      .menu-btn {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 14px;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text);
        cursor: pointer;
      }

      .mobile-menu {
        position: absolute;
        top: calc(100% + 12px);
        right: 0;
        width: min(320px, calc(100vw - 32px));
        background: rgba(15, 16, 28, 0.98);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 14px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.45);
        z-index: 200;
      }

      :global(.mobile-menu a) {
        display: block;
        padding: 15px 18px;
        color: var(--text);
        text-decoration: none;
        font-size: 16px;
        font-weight: 700;
        border-radius: 14px;
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
        :global(nav.main-nav) {
          display: grid !important;
          grid-template-columns: 48px 1fr 48px;
          align-items: center;
          justify-content: initial !important;
          flex-wrap: nowrap !important;
        }

        :global(.logo) {
          grid-column: 2;
          justify-self: center;
          width: auto !important;
          display: flex !important;
          text-align: center;
        }

        .nav-right {
          grid-column: 3;
          justify-self: end;
        }

        .desktop-only {
          display: none;
        }

        .mobile-only {
          display: flex;
        }
      }
          `}</style>
    </header>
  );
}
