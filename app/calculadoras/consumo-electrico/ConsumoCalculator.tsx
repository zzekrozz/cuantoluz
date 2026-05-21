'use client';

import { useEffect, useState } from 'react';
import { fmtMoney, color, h, calculateCyclePrice, PriceData } from '@/lib/utils';
import { Zap, TrendingDown, TrendingUp, Sparkles, ClipboardList } from 'lucide-react';

export default function ConsumoCalculator() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  const [watts, setWatts] = useState(1000);
  const [hours, setHours] = useState(1);
  const [daysPerMonth, setDaysPerMonth] = useState(30);
  const [startHour, setStartHour] = useState(new Date().getHours());

  useEffect(() => {
    fetch('/api/precios?day=today').then(r => r.json()).then(d => { if (d.prices?.length) setPrices(d.prices); }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="cs-loading"><div className="cs-spinner" /> Cargando…</div>;
  if (!prices.length) return <div className="cs-error">Error cargando precios.</div>;

  const kw = watts / 1000;
  const totalKwh = kw * hours;
  const cost = calculateCyclePrice(prices, startHour, 0, hours, totalKwh);
  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const maxP = prices.reduce((a, b) => (a.price > b.price ? a : b));
  const costBest = calculateCyclePrice(prices, minP.hour, 0, hours, totalKwh);
  const costWorst = calculateCyclePrice(prices, maxP.hour, 0, hours, totalKwh);
  const costMonth = cost * daysPerMonth;
  const costYear = cost * daysPerMonth * 12;

  return (
    <>
      <div className="cs-card">
        <div className="cs-result">
          <div className="cs-result-label"><ClipboardList size={14} className="icon-accent" /> Coste por uso</div>
          <div className="cs-result-price inter-numbers" style={{ color: color(cost / totalKwh) }}>{fmtMoney(cost)}</div>
          <div className="cs-result-info">{watts} W × {hours}h = {totalKwh.toFixed(2)} kWh</div>

          <div className="cs-comparison">
            <div className="cs-mini"><span className="cs-mini-label"><TrendingDown size={11} /> Mejor hora</span><span className="cs-mini-value green">{fmtMoney(costBest)}</span></div>
            <div className="cs-mini"><span className="cs-mini-label"><TrendingUp size={11} /> Peor hora</span><span className="cs-mini-value red">{fmtMoney(costWorst)}</span></div>
            <div className="cs-mini"><span className="cs-mini-label"><Sparkles size={11} /> Al mes</span><span className="cs-mini-value accent">{fmtMoney(costMonth)}</span></div>
          </div>
        </div>

        <div className="cs-form">
          <div className="cs-row">
            <div className="cs-field">
              <label>Potencia (W)</label>
              <input type="number" value={watts} min="1" max="10000" step="10" onChange={e => setWatts(Math.max(1, parseInt(e.target.value) || 0))} />
            </div>
            <div className="cs-field">
              <label>Horas/día</label>
              <input type="number" value={hours} min="0.1" max="24" step="0.1" onChange={e => setHours(Math.max(0.1, parseFloat(e.target.value) || 0.1))} />
            </div>
          </div>
          <div className="cs-row">
            <div className="cs-field">
              <label>Días al mes</label>
              <input type="number" value={daysPerMonth} min="1" max="31" onChange={e => setDaysPerMonth(Math.max(1, Math.min(31, parseInt(e.target.value) || 1)))} />
            </div>
            <div className="cs-field">
              <label>Hora de inicio</label>
              <select value={startHour} onChange={e => setStartHour(parseInt(e.target.value))}>
                {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{h(i)}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="cs-summary">
          <div><div className="cs-sum-label">AL MES</div><div className="cs-sum-value inter-numbers">{fmtMoney(costMonth)}</div></div>
          <div><div className="cs-sum-label">AL AÑO</div><div className="cs-sum-value inter-numbers">{fmtMoney(costYear)}</div></div>
        </div>
      </div>

      <style jsx>{`
        .cs-card { background: linear-gradient(135deg, var(--surface2), var(--surface)); border: 1px solid var(--border); border-radius: 18px; padding: 24px; }
        .cs-loading, .cs-error { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 60px; text-align: center; color: var(--text-soft); display: flex; align-items: center; justify-content: center; gap: 12px; }
        .cs-spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }
        .cs-result { padding-bottom: 20px; border-bottom: 1px solid var(--border); margin-bottom: 20px; }
        .cs-result-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-soft); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; font-weight: 700; }
        .cs-result-price { font-family: 'Inter', sans-serif; font-size: clamp(36px, 6vw, 52px); font-weight: 800; line-height: 1; margin-bottom: 8px; }
        .cs-result-info { font-size: 13px; color: var(--text-soft); }
        .cs-comparison { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 16px; padding-top: 16px; border-top: 1px solid var(--border); }
        .cs-mini { display: flex; flex-direction: column; gap: 4px; }
        .cs-mini-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px; }
        .cs-mini-value { font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 800; }
        .cs-mini-value.green { color: var(--green-bright); } .cs-mini-value.red { color: var(--red); } .cs-mini-value.accent { color: var(--accent); }
        .cs-form { margin-bottom: 20px; }
        .cs-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 12px; }
        .cs-field label { display: block; font-size: 11px; color: var(--text-soft); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; }
        .cs-field select, .cs-field input { width: 100%; background: var(--surface2); border: 1px solid var(--border); border-radius: 12px; color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 15px; padding: 0 14px; height: 48px; outline: none; appearance: none; box-sizing: border-box; }
        .cs-field select { background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8aabc' fill='none' stroke-width='1.5'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 36px; }
        .cs-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; padding: 16px; background: var(--accent-bg); border: 1px solid rgba(129, 140, 248, 0.2); border-radius: 12px; }
        .cs-sum-label { font-size: 10px; color: var(--text-soft); margin-bottom: 4px; letter-spacing: 0.5px; }
        .cs-sum-value { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 800; color: var(--accent); }
        @media (max-width: 600px) {
          .cs-row { grid-template-columns: 1fr; }
          .cs-comparison { grid-template-columns: 1fr; }
          .cs-mini { flex-direction: row; justify-content: space-between; }
          .cs-card { padding: 20px 18px; }
        }
      `}</style>
    </>
  );
}
