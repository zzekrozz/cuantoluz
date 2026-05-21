'use client';

import { useEffect, useState } from 'react';
import { fmtMoney, color, h, calculateCyclePrice, PriceData } from '@/lib/utils';
import { UtensilsCrossed, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

const PROGRAMS = {
  eco: { label: 'Eco (más eficiente)', kwh: 0.85, duration: 3.5 },
  normal: { label: 'Normal', kwh: 1.2, duration: 2.0 },
  quick: { label: 'Rápido', kwh: 1.0, duration: 0.5 },
  intensive: { label: 'Intensivo', kwh: 1.8, duration: 2.5 },
};

export default function LavavajillasCalculator() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [program, setProgram] = useState<keyof typeof PROGRAMS>('eco');
  const [startHour, setStartHour] = useState(new Date().getHours());
  const [perWeek, setPerWeek] = useState(5);

  useEffect(() => {
    fetch('/api/precios?day=today').then(r => r.json()).then(d => { if (d.prices?.length) setPrices(d.prices); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="lvj-loading"><div className="lvj-spinner" /> Cargando…</div>;
  if (!prices.length) return <div className="lvj-error">Error.</div>;

  const p = PROGRAMS[program];
  const cost = calculateCyclePrice(prices, startHour, 0, p.duration, p.kwh);
  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const maxP = prices.reduce((a, b) => (a.price > b.price ? a : b));
  const costBest = calculateCyclePrice(prices, minP.hour, 0, p.duration, p.kwh);
  const costWorst = calculateCyclePrice(prices, maxP.hour, 0, p.duration, p.kwh);
  const costYear = cost * perWeek * 52;
  const savingsYear = (cost - costBest) * perWeek * 52;

  return (
    <>
      <div className="lvj-card">
        <div className="lvj-result">
          <div className="lvj-result-label"><UtensilsCrossed size={14} className="icon-accent" /> Coste del ciclo</div>
          <div className="lvj-result-price inter-numbers" style={{ color: color(cost / p.kwh) }}>{fmtMoney(cost)}</div>
          <div className="lvj-result-info">{p.label} · {p.kwh} kWh · {p.duration}h</div>

          <div className="lvj-comparison">
            <div className="lvj-mini"><span className="lvj-mini-label"><TrendingDown size={11} /> Mejor hora</span><span className="lvj-mini-value green">{fmtMoney(costBest)}</span></div>
            <div className="lvj-mini"><span className="lvj-mini-label"><TrendingUp size={11} /> Peor hora</span><span className="lvj-mini-value red">{fmtMoney(costWorst)}</span></div>
            <div className="lvj-mini"><span className="lvj-mini-label"><Sparkles size={11} /> Año entero</span><span className="lvj-mini-value accent">{fmtMoney(costYear)}</span></div>
          </div>

          {savingsYear > 1 && <div className="lvj-savings"><Sparkles size={16} className="icon-green" /> Ahorrarías <strong>{fmtMoney(savingsYear)}/año</strong> usándolo en la mejor hora</div>}
        </div>

        <div className="lvj-form">
          <div className="lvj-row">
            <div className="lvj-field">
              <label>Programa</label>
              <select value={program} onChange={e => setProgram(e.target.value as keyof typeof PROGRAMS)}>
                {Object.entries(PROGRAMS).map(([k, v]) => <option key={k} value={k}>{v.label} · {v.kwh} kWh</option>)}
              </select>
            </div>
            <div className="lvj-field">
              <label>Hora de inicio</label>
              <select value={startHour} onChange={e => setStartHour(parseInt(e.target.value))}>
                {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{h(i)}</option>)}
              </select>
            </div>
          </div>
          <div className="lvj-row">
            <div className="lvj-field">
              <label>Ciclos/semana</label>
              <input type="number" value={perWeek} min="1" max="21" onChange={e => setPerWeek(Math.max(1, Math.min(21, parseInt(e.target.value) || 1)))} />
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lvj-card { background: linear-gradient(135deg, var(--surface2), var(--surface)); border: 1px solid var(--border); border-radius: 18px; padding: 24px; }
        .lvj-loading, .lvj-error { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 60px; text-align: center; color: var(--text-soft); display: flex; align-items: center; justify-content: center; gap: 12px; }
        .lvj-spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
        .lvj-result { padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
        .lvj-result-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-soft); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; font-weight: 700; }
        .lvj-result-price { font-family: 'Inter', sans-serif; font-size: clamp(36px, 6vw, 52px); font-weight: 800; line-height: 1; margin-bottom: 8px; }
        .lvj-result-info { font-size: 13px; color: var(--text-soft); }
        .lvj-comparison { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .lvj-mini { display: flex; flex-direction: column; gap: 4px; }
        .lvj-mini-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px; }
        .lvj-mini-value { font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 800; }
        .lvj-mini-value.green { color: var(--green-bright); } .lvj-mini-value.red { color: var(--red); } .lvj-mini-value.accent { color: var(--accent); }
        .lvj-savings { display: flex; align-items: center; gap: 10px; background: var(--green-bg); border: 1px solid rgba(34, 197, 94, 0.25); border-radius: 12px; padding: 12px 14px; margin-top: 16px; font-size: 13px; }
        .lvj-savings strong { color: var(--green-bright); font-weight: 800; }
        .lvj-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px; }
        .lvj-field { display: flex; flex-direction: column; }
        .lvj-field label { display: block; font-size: 11px; color: var(--text-soft); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .lvj-field select, .lvj-field input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 0 14px; height: 48px; outline: none; appearance: none; box-sizing: border-box; }
        .lvj-field select { background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8aabc' fill='none' stroke-width='1.5'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        @media (max-width: 600px) {
          .lvj-row { grid-template-columns: 1fr; }
          .lvj-comparison { grid-template-columns: 1fr; }
          .lvj-mini { flex-direction: row; justify-content: space-between; }
          .lvj-card { padding: 20px 18px; }
        }
      `}</style>
    </>
  );
}
