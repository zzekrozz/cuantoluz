'use client';

import { useEffect, useState } from 'react';
import { fmtMoney, color, h, cars, FAST_CHARGE_PRICE, GASOLINE_PRICE_PER_LITER, GASOLINE_CONSUMPTION_L_PER_100, getPriceAtHour, PriceData } from '@/lib/utils';
import { Battery, Car, Zap, Home, Fuel, TrendingDown } from 'lucide-react';

export default function CocheElectricoCalculator() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  const [model, setModel] = useState('tesla_3');
  const [fromPct, setFromPct] = useState(20);
  const [toPct, setToPct] = useState(80);
  const [hour, setHour] = useState(new Date().getHours());

  useEffect(() => {
    fetch('/api/precios?day=today')
      .then(r => r.json())
      .then(d => { if (d.prices?.length) setPrices(d.prices); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="ev-loading"><div className="ev-spinner" /> Cargando precios…</div>;
  }

  if (!prices.length) {
    return <div className="ev-error">Error cargando precios.</div>;
  }

  const car = cars[model];
  const kwhNeeded = Math.max(0, (car.battery * (toPct - fromPct)) / 100);
  const priceAtHour = getPriceAtHour(prices, hour);
  const costAtHour = kwhNeeded * priceAtHour;

  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const maxP = prices.reduce((a, b) => (a.price > b.price ? a : b));
  const costBest = kwhNeeded * minP.price;
  const costWorst = kwhNeeded * maxP.price;
  const costFast = kwhNeeded * FAST_CHARGE_PRICE;

  const km = (kwhNeeded / car.per100) * 100;

  // Comparativa con gasolina
  const literosGasolina = (km * GASOLINE_CONSUMPTION_L_PER_100) / 100;
  const costoGasolina = literosGasolina * GASOLINE_PRICE_PER_LITER;
  const ahorro = costoGasolina - costAtHour;

  return (
    <>
      <div className="ev-card">
        <div className="ev-result">
          <div className="ev-result-label"><Battery size={14} className="icon-green" /> Coste de la carga en casa</div>
          <div className="ev-result-price inter-numbers" style={{ color: color(priceAtHour) }}>{fmtMoney(costAtHour)}</div>
          <div className="ev-result-info">
            {car.label} · {kwhNeeded.toFixed(1)} kWh · {km.toFixed(0)} km · {h(hour)}
          </div>

          <div className="ev-comparison">
            <div className="ev-mini">
              <span className="ev-mini-label"><TrendingDown size={11} /> Mejor hora ({h(minP.hour)})</span>
              <span className="ev-mini-value green">{fmtMoney(costBest)}</span>
            </div>
            <div className="ev-mini">
              <span className="ev-mini-label"><Zap size={11} /> Carga rápida</span>
              <span className="ev-mini-value red">{fmtMoney(costFast)}</span>
            </div>
            <div className="ev-mini">
              <span className="ev-mini-label"><Fuel size={11} /> Si fuera gasolina</span>
              <span className="ev-mini-value red">{fmtMoney(costoGasolina)}</span>
            </div>
          </div>

          {ahorro > 0 && (
            <div className="ev-savings">
              <TrendingDown size={16} className="icon-green" />
              <span>Ahorras <strong>{fmtMoney(ahorro)}</strong> respecto a hacer estos {km.toFixed(0)} km con gasolina</span>
            </div>
          )}
        </div>

        <div className="ev-form">
          <div className="ev-row">
            <div className="ev-field">
              <label>Modelo</label>
              <select value={model} onChange={e => setModel(e.target.value)}>
                {Object.entries(cars).filter(([k]) => k !== 'custom').map(([key, c]) => (
                  <option key={key} value={key}>{c.label} · {c.battery} kWh</option>
                ))}
              </select>
            </div>
            <div className="ev-field">
              <label>Hora de carga</label>
              <select value={hour} onChange={e => setHour(parseInt(e.target.value))}>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{h(i)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="ev-row">
            <div className="ev-field">
              <label>Carga desde ({fromPct}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={fromPct}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  setFromPct(v);
                  if (v >= toPct) setToPct(Math.min(100, v + 10));
                }}
              />
            </div>
            <div className="ev-field">
              <label>Hasta ({toPct}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                value={toPct}
                onChange={e => {
                  const v = parseInt(e.target.value);
                  setToPct(v);
                  if (v <= fromPct) setFromPct(Math.max(0, v - 10));
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ev-card { background: linear-gradient(135deg, var(--surface2), var(--surface)); border: 1px solid var(--border); border-radius: 18px; padding: 24px; }
        .ev-loading, .ev-error { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 60px 24px; text-align: center; color: var(--text-soft); display: flex; align-items: center; justify-content: center; gap: 12px; }
        .ev-spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }

        .ev-result { padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
        .ev-result-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-soft); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; font-weight: 700; }
        .ev-result-price { font-family: 'Inter', sans-serif; font-size: clamp(36px, 6vw, 52px); font-weight: 800; line-height: 1; margin-bottom: 8px; }
        .ev-result-info { font-size: 13px; color: var(--text-soft); }

        .ev-comparison { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .ev-mini { display: flex; flex-direction: column; gap: 4px; }
        .ev-mini-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px; }
        .ev-mini-value { font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 800; }
        .ev-mini-value.green { color: var(--green-bright); }
        .ev-mini-value.red { color: var(--red); }

        .ev-savings { display: flex; align-items: center; gap: 10px; background: var(--green-bg); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: 12px; padding: 12px 14px; margin-top: 16px; font-size: 13px; color: var(--text); }
        .ev-savings strong { color: var(--green-bright); font-weight: 800; }

        .ev-form { margin-bottom: 0; }
        .ev-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px; }
        .ev-field { display: flex; flex-direction: column; }
        .ev-field label { display: block; font-size: 11px; color: var(--text-soft); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .ev-field select, .ev-field input[type='number'] { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 0 14px; height: 48px; outline: none; appearance: none; -webkit-appearance: none; box-sizing: border-box; }
        .ev-field select { background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8aabc' fill='none' stroke-width='1.5'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }

        .ev-field input[type='range'] { width: 100%; height: 6px; background: var(--surface2); border-radius: 3px; appearance: none; -webkit-appearance: none; }
        .ev-field input[type='range']::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; background: var(--accent); border-radius: 50%; cursor: pointer; }
        .ev-field input[type='range']::-moz-range-thumb { width: 20px; height: 20px; background: var(--accent); border-radius: 50%; cursor: pointer; border: 0; }

        @media (max-width: 600px) {
          .ev-row { grid-template-columns: 1fr; }
          .ev-comparison { grid-template-columns: 1fr; gap: 8px; }
          .ev-mini { flex-direction: row; justify-content: space-between; align-items: center; }
          .ev-card { padding: 20px 18px; }
        }
      `}</style>
    </>
  );
}
