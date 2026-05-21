'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, TrendingDown, ExternalLink } from 'lucide-react';
import { color, fmt, h, semClass, PriceData } from '@/lib/utils';

interface Props {
  variant?: 'compact' | 'full';
  ctaText?: string;
}

export default function PriceLiveWidget({ variant = 'compact', ctaText }: Props) {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [currentHour, setCurrentHour] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentHour(new Date().getHours());

    fetch('/api/precios?day=today')
      .then(r => r.json())
      .then(d => {
        if (d.prices?.length) setPrices(d.prices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="price-live-widget loading">
        <div className="loading-text">Cargando precio de la luz…</div>
      </div>
    );
  }

  if (!prices.length) return null;

  const cur = prices.find(p => p.hour === currentHour) || prices[0];
  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const sc = semClass(cur.price);

  return (
    <>
      <div className={`price-live-widget ${sc}`}>
        <div className="plw-header">
          <Clock size={16} className="icon-accent" />
          <span className="plw-label">Precio de la luz ahora · {h(currentHour)}</span>
        </div>

        <div className="plw-main">
          <div className="plw-price inter-numbers" style={{ color: color(cur.price) }}>
            {fmt(cur.price)}
            <span className="plw-unit"> c€/kWh</span>
          </div>

          {variant === 'full' && (
            <div className="plw-best">
              <TrendingDown size={14} className="icon-green" />
              <span>Hora más barata: <strong>{h(minP.hour)}</strong> ({fmt(minP.price)} c€)</span>
            </div>
          )}
        </div>

        <Link href="/precio-luz-hoy" className="plw-cta">
          {ctaText || 'Ver precio por horas'}
          <ExternalLink size={12} />
        </Link>
      </div>

      <style jsx>{`
        .price-live-widget {
          background: linear-gradient(135deg, var(--surface2), var(--surface));
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 16px 18px;
          margin: 20px 0;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 16px;
        }

        .price-live-widget.green {
          border-color: rgba(34, 197, 94, 0.25);
        }
        .price-live-widget.yellow {
          border-color: rgba(245, 158, 11, 0.25);
        }
        .price-live-widget.red {
          border-color: rgba(239, 68, 68, 0.25);
        }

        .plw-header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: var(--text-soft);
          font-weight: 700;
          width: 100%;
        }

        .plw-main {
          display: flex;
          flex-direction: column;
          gap: 6px;
          flex: 1;
          min-width: 180px;
        }

        .plw-price {
          font-family: 'Inter', sans-serif;
          font-size: 32px;
          font-weight: 900;
          line-height: 1;
        }

        .plw-unit {
          font-size: 13px;
          color: var(--muted);
          font-weight: 400;
        }

        .plw-best {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: var(--text-soft);
        }

        :global(.plw-cta) {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 14px;
          background: var(--accent-bg);
          color: var(--accent);
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          border: 1px solid rgba(129, 140, 248, 0.2);
          text-decoration: none;
          transition: all 0.2s;
        }

        :global(.plw-cta:hover) {
          background: rgba(129, 140, 248, 0.16);
          text-decoration: none;
        }

        .loading {
          background: var(--surface2);
        }

        .loading-text {
          color: var(--muted);
          font-size: 13px;
        }

        @media (max-width: 480px) {
          .price-live-widget {
            padding: 14px 16px;
          }
          .plw-price {
            font-size: 28px;
          }
        }
      `}</style>
    </>
  );
}
