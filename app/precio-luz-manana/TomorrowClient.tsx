'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fmt, fmtE, h, color, semClass, PriceData } from '@/lib/utils';
import { BarChart3, Moon, Clock } from 'lucide-react';
import RelatedLinks from '@/components/RelatedLinks';

export default function TomorrowClient() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [date, setDate] = useState('');
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/precios?day=tomorrow')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.prices?.length) {
          setPrices(d.prices);
          setDate(d.date || '');
          setAvailable(true);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{
          width: '32px', height: '32px', margin: '0 auto 14px',
          border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
          borderRadius: '50%', animation: 'spin 0.7s linear infinite'
        }} />
        <div style={{ color: 'var(--text-soft)', fontSize: '14px' }}>Cargando precios…</div>
      </div>
    );
  }

  if (!available || !prices.length) {
    return (
      <>
        <div className="not-available-card">
          <Clock size={32} className="icon-yellow" />
          <h2>Aún no están disponibles los precios de mañana</h2>
          <p>
            Red Eléctrica de España publica los precios del día siguiente a partir de las <strong>20:15h</strong>. Vuelve un poco más tarde para consultarlos.
          </p>
          <Link href="/" className="cta-link">
            Ver el precio de la luz hoy →
          </Link>
        </div>

        <RelatedLinks
          links={[
            { title: 'Precio de la luz hoy', description: 'Consulta los precios actualizados hora a hora.', url: '/' },
            { title: '¿Qué es el PVPC?', description: 'Cómo funciona la tarifa regulada.', url: '/guias/que-es-pvpc' },
            { title: 'Mejor hora para poner la lavadora', description: 'Dato vivo con el precio del día.', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
          ]}
        />

        <style jsx>{`
          .not-available-card {
            background: var(--surface);
            border: 1px solid var(--border);
            border-radius: 18px;
            padding: 48px 24px;
            text-align: center;
          }
          .not-available-card h2 {
            font-family: 'Syne', sans-serif;
            font-size: 22px;
            font-weight: 800;
            margin: 16px 0 12px;
          }
          .not-available-card p {
            color: var(--text-soft);
            line-height: 1.6;
            max-width: 460px;
            margin: 0 auto 20px;
          }
          :global(.cta-link) {
            display: inline-block;
            padding: 12px 22px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            border-radius: 12px;
            font-weight: 700;
            text-decoration: none;
          }
        `}</style>
      </>
    );
  }

  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const maxP = prices.reduce((a, b) => (a.price > b.price ? a : b));
  const avg = prices.reduce((s, p) => s + p.price, 0) / prices.length;

  return (
    <>
      <div className="hero-tomorrow">
        <div className="hero-tomorrow-grid">
          <div>
            <div className="t-label"><Moon size={14} /> Hora más barata</div>
            <div className="t-price inter-numbers" style={{ color: 'var(--green-bright)' }}>{h(minP.hour)}</div>
            <div className="t-unit">{fmt(minP.price)} c€/kWh</div>
          </div>
          <div className="divider">
            <div className="t-label"><Clock size={14} /> Hora más cara</div>
            <div className="t-price inter-numbers" style={{ color: 'var(--red)' }}>{h(maxP.hour)}</div>
            <div className="t-unit">{fmt(maxP.price)} c€/kWh</div>
          </div>
          <div className="divider">
            <div className="t-label"><BarChart3 size={14} /> Precio medio</div>
            <div className="t-price inter-numbers" style={{ color: 'var(--yellow)' }}>{fmt(avg)}</div>
            <div className="t-unit">c€/kWh</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Precios hora a hora · Mañana {date && `(${date})`}</div>
        <div className="table-wrap">
          <table className="price-table">
            <thead><tr><th>Hora</th><th>Precio</th></tr></thead>
            <tbody>
              {prices.map(p => {
                const isBest = p.hour === minP.hour;
                const isWorst = p.hour === maxP.hour;
                return (
                  <tr key={p.hour} className={isBest ? 'best-row' : isWorst ? 'worst-row' : ''}>
                    <td>
                      {h(p.hour)} – {h((p.hour + 1) % 24)}
                      {isBest && <span style={{ fontSize: '10px', color: 'var(--green-bright)', fontWeight: 600 }}> ← MÁS BARATA</span>}
                      {isWorst && <span style={{ fontSize: '10px', color: 'var(--red)', fontWeight: 600 }}> ← MÁS CARA</span>}
                    </td>
                    <td>
                      <strong style={{ color: color(p.price) }}>{fmt(p.price)}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}> c€/kWh</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <section className="seo-context">
        <h2>¿Cuándo se publican los precios de mañana?</h2>
        <p>
          Red Eléctrica de España (REE) publica el precio de la luz del día siguiente todos los días a partir de las <strong>20:15h</strong>. Una vez publicado, el dato es definitivo y no cambia. En esta página verás los precios en cuanto estén disponibles.
        </p>
        <h2>Cómo aprovechar el dato de mañana</h2>
        <p>
          Saber los precios con antelación te permite planificar el consumo: programar la lavadora o el lavavajillas con función de inicio diferido, decidir cuándo cargar el coche eléctrico, o simplemente saber a qué hora poner el aire acondicionado. Si quieres entender cómo funciona todo, consulta nuestra <Link href="/guias/que-es-pvpc">guía del PVPC</Link>.
        </p>
      </section>

      <RelatedLinks
        links={[
          { title: 'Precio de la luz hoy', description: 'Datos actualizados de hoy.', url: '/' },
          { title: 'Mejor hora para poner la lavadora', description: 'Dato vivo con el precio de mañana.', url: '/electrodomesticos/mejor-hora-poner-lavadora' },
          { title: 'Calculadora de lavadora', description: 'Cuánto cuesta cada lavado.', url: '/calculadoras/lavadora' },
          { title: '¿Qué es el PVPC?', description: 'Cómo se calcula el precio horario.', url: '/guias/que-es-pvpc' },
        ]}
      />

      <style jsx>{`
        .hero-tomorrow {
          background: linear-gradient(135deg, var(--surface2), var(--surface));
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 16px;
        }
        .hero-tomorrow-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 24px;
        }
        .hero-tomorrow-grid > div { position: relative; }
        .hero-tomorrow-grid > .divider { border-left: 1px solid var(--border); padding-left: 24px; }
        .t-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-soft); margin-bottom: 10px; display: flex; align-items: center; gap: 4px; }
        .t-price { font-family: 'Syne', sans-serif; font-size: clamp(36px, 5vw, 56px); font-weight: 800; line-height: 1; margin-bottom: 8px; }
        .t-unit { font-size: 13px; color: var(--muted); }

        .price-table tr.best-row td { background: rgba(34,197,94,0.05); }
        .price-table tr.worst-row td { background: rgba(239,68,68,0.05); }

        .seo-context { margin: 32px 0; padding: 28px 24px; background: var(--surface); border: 1px solid var(--border); border-radius: 18px; }
        .seo-context h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; margin: 0 0 12px; }
        .seo-context h2:not(:first-child) { margin-top: 24px; }
        .seo-context p { color: var(--text-soft); line-height: 1.7; margin-bottom: 12px; }
        :global(.seo-context a) { color: var(--accent); }

        @media (max-width: 767px) {
          .hero-tomorrow-grid { grid-template-columns: 1fr; gap: 20px; }
          .hero-tomorrow-grid > .divider { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 20px; }
          .hero-tomorrow { padding: 24px 20px; }
        }
      `}</style>
    </>
  );
}
