'use client';

import { useEffect, useState } from 'react';
import { fmtMoney, color, h, calculateCyclePrice, PriceData } from '@/lib/utils';
import { Snowflake, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

const TYPES = {
  inverter_small: { label: 'Inverter pequeño (1x1)', kw: 0.9 },
  inverter_med: { label: 'Inverter mediano (2x1)', kw: 1.2 },
  inverter_big: { label: 'Inverter grande (3x1)', kw: 1.8 },
  old_med: { label: 'Antiguo mediano', kw: 2.0 },
  old_big: { label: 'Antiguo grande', kw: 2.8 },
};

export default function AireCalculator() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<keyof typeof TYPES>('inverter_med');
  const [hours, setHours] = useState(4);
  const [startHour, setStartHour] = useState(20);

  useEffect(() => {
    fetch('/api/precios?day=today')
      .then(r => r.json())
      .then(d => { if (d.prices?.length) setPrices(d.prices); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="ac-loading"><div className="ac-spinner" /> Cargando…</div>;
  if (!prices.length) return <div className="ac-error">Error cargando precios.</div>;

  const kw = TYPES[type].kw;
  const totalKwh = kw * hours;
  const cost = calculateCyclePrice(prices, startHour, 0, hours, totalKwh);
  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const maxP = prices.reduce((a, b) => (a.price > b.price ? a : b));
  const costBest = calculateCyclePrice(prices, minP.hour, 0, hours, totalKwh);
  const costWorst = calculateCyclePrice(prices, maxP.hour, 0, hours, totalKwh);
  const costPerHour = cost / hours;
  const costMonth = cost * 30;

  return (
    <>
      <div className="ac-card">
        <div className="ac-result">
          <div className="ac-result-label"><Snowflake size={14} className="icon-accent" /> Coste total del uso</div>
          <div className="ac-result-price inter-numbers" style={{ color: color(cost / totalKwh) }}>{fmtMoney(cost)}</div>
          <div className="ac-result-info">
            {TYPES[type].label} · {hours}h · {totalKwh.toFixed(1)} kWh · {fmtMoney(costPerHour)}/h
          </div>

          <div className="ac-comparison">
            <div className="ac-mini">
              <span className="ac-mini-label"><TrendingDown size={11} /> Mejor hora ({h(minP.hour)})</span>
              <span className="ac-mini-value green">{fmtMoney(costBest)}</span>
            </div>
            <div className="ac-mini">
              <span className="ac-mini-label"><TrendingUp size={11} /> Peor hora ({h(maxP.hour)})</span>
              <span className="ac-mini-value red">{fmtMoney(costWorst)}</span>
            </div>
            <div className="ac-mini">
              <span className="ac-mini-label"><Sparkles size={11} /> 30 días igual</span>
              <span className="ac-mini-value accent">{fmtMoney(costMonth)}</span>
            </div>
          </div>
        </div>

        <div className="ac-form">
          <div className="ac-row">
            <div className="ac-field">
              <label>Tipo de aire</label>
              <select value={type} onChange={e => setType(e.target.value as keyof typeof TYPES)}>
                {Object.entries(TYPES).map(([k, t]) => (
                  <option key={k} value={k}>{t.label} · {t.kw} kW</option>
                ))}
              </select>
            </div>
            <div className="ac-field">
              <label>Hora de inicio</label>
              <select value={startHour} onChange={e => setStartHour(parseInt(e.target.value))}>
                {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{h(i)}</option>)}
              </select>
            </div>
          </div>
          <div className="ac-row">
            <div className="ac-field" style={{ gridColumn: 'span 2' }}>
              <label>Horas de uso: {hours}h</label>
              <input type="range" min="1" max="12" value={hours} onChange={e => setHours(parseInt(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .ac-card { background: linear-gradient(135deg, var(--surface2), var(--surface)); border: 1px solid var(--border); border-radius: 18px; padding: 24px; }
        .ac-loading, .ac-error { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 60px 24px; text-align: center; color: var(--text-soft); display: flex; align-items: center; justify-content: center; gap: 12px; }
        .ac-spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
        .ac-result { padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
        .ac-result-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-soft); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; font-weight: 700; }
        .ac-result-price { font-family: 'Inter', sans-serif; font-size: clamp(36px, 6vw, 52px); font-weight: 800; line-height: 1; margin-bottom: 8px; }
        .ac-result-info { font-size: 13px; color: var(--text-soft); }
        .ac-comparison { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .ac-mini { display: flex; flex-direction: column; gap: 4px; }
        .ac-mini-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px; }
        .ac-mini-value { font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 800; }
        .ac-mini-value.green { color: var(--green-bright); }
        .ac-mini-value.red { color: var(--red); }
        .ac-mini-value.accent { color: var(--accent); }
        .ac-form { margin-bottom: 0; }
        .ac-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px; }
        .ac-field { display: flex; flex-direction: column; }
        .ac-field label { display: block; font-size: 11px; color: var(--text-soft); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .ac-field select { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 0 14px; height: 48px; outline: none; appearance: none; box-sizing: border-box; background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8aabc' fill='none' stroke-width='1.5'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        .ac-field input[type='range'] { width: 100%; height: 6px; background: var(--surface2); border-radius: 3px; appearance: none; -webkit-appearance: none; }
        .ac-field input[type='range']::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; background: var(--accent); border-radius: 50%; cursor: pointer; }
        @media (max-width: 600px) {
          .ac-row { grid-template-columns: 1fr; }
          .ac-comparison { grid-template-columns: 1fr; gap: 8px; }
          .ac-mini { flex-direction: row; justify-content: space-between; }
          .ac-card { padding: 20px 18px; }
        }
      `}</style>
    </>
  );
}
