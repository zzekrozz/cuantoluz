'use client';

import { useEffect, useState } from 'react';
import { fmtMoney, color, h, hm, calculateCyclePrice, PriceData } from '@/lib/utils';
import { Shirt, Calculator as CalcIcon, TrendingDown, TrendingUp, Sparkles } from 'lucide-react';

const PROGRAMS = {
  eco_40_60: { label: 'Eco 40-60 (más eficiente)', kwh: 0.6, duration: 3 },
  cold: { label: 'Frío 20°C', kwh: 0.3, duration: 1.5 },
  warm_30: { label: '30°C', kwh: 0.5, duration: 2 },
  warm_40: { label: '40°C', kwh: 0.8, duration: 2 },
  hot_60: { label: '60°C', kwh: 1.2, duration: 2.5 },
  hot_90: { label: '90°C (algodón)', kwh: 2.0, duration: 2.5 },
  quick: { label: 'Rápido 30 min', kwh: 0.4, duration: 0.5 },
};

const EFFICIENCY = {
  a: { label: 'Clase A (eficiente)', factor: 0.85 },
  b: { label: 'Clase B', factor: 1.0 },
  c: { label: 'Clase C', factor: 1.15 },
  d: { label: 'Clase D (antigua)', factor: 1.35 },
};

export default function LavadoraCalculator() {
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  const [program, setProgram] = useState<keyof typeof PROGRAMS>('eco_40_60');
  const [efficiency, setEfficiency] = useState<keyof typeof EFFICIENCY>('a');
  const [startHour, setStartHour] = useState(new Date().getHours());
  const [startMin, setStartMin] = useState(0);
  const [cyclesPerWeek, setCyclesPerWeek] = useState(4);

  useEffect(() => {
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
      <div className="lav-loading">
        <div className="lav-spinner" />
        <span>Cargando precios actualizados…</span>
      </div>
    );
  }

  if (!prices.length) {
    return <div className="lav-error">Error cargando los precios. Vuelve a intentarlo.</div>;
  }

  const programData = PROGRAMS[program];
  const effFactor = EFFICIENCY[efficiency].factor;
  const actualKwh = programData.kwh * effFactor;

  // Coste a la hora seleccionada
  const costNow = calculateCyclePrice(prices, startHour, startMin, programData.duration, actualKwh);

  // Coste en la mejor hora
  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const maxP = prices.reduce((a, b) => (a.price > b.price ? a : b));
  const costBest = calculateCyclePrice(prices, minP.hour, 0, programData.duration, actualKwh);
  const costWorst = calculateCyclePrice(prices, maxP.hour, 0, programData.duration, actualKwh);

  // Costes recurrentes
  const costPerMonth = costNow * cyclesPerWeek * 4.33;
  const costPerYear = costNow * cyclesPerWeek * 52;
  const savingsPerYear = (costNow - costBest) * cyclesPerWeek * 52;

  const savingsPct = costNow > 0 ? Math.round((1 - costBest / costNow) * 100) : 0;

  return (
    <>
      <div className="lav-card">
        {/* RESULTADO DESTACADO */}
        <div className="lav-result">
          <div className="lav-result-label">
            <Shirt size={14} className="icon-accent" /> Coste del lavado
          </div>
          <div className="lav-result-price inter-numbers" style={{ color: color(costNow / actualKwh) }}>
            {fmtMoney(costNow)}
          </div>
          <div className="lav-result-info">
            {PROGRAMS[program].label} · {actualKwh.toFixed(2)} kWh · {programData.duration}h · Inicio a las {hm(startHour, startMin)}
          </div>

          <div className="lav-comparison">
            <div className="lav-mini">
              <span className="lav-mini-label"><TrendingDown size={11} /> Mejor hora ({h(minP.hour)})</span>
              <span className="lav-mini-value green">{fmtMoney(costBest)}</span>
            </div>
            <div className="lav-mini">
              <span className="lav-mini-label"><TrendingUp size={11} /> Peor hora ({h(maxP.hour)})</span>
              <span className="lav-mini-value red">{fmtMoney(costWorst)}</span>
            </div>
            <div className="lav-mini">
              <span className="lav-mini-label"><Sparkles size={11} /> Ahorro potencial</span>
              <span className="lav-mini-value accent">{savingsPct}%</span>
            </div>
          </div>
        </div>

        {/* CONTROLES */}
        <div className="lav-form">
          <div className="lav-row">
            <div className="lav-field">
              <label>Programa</label>
              <select value={program} onChange={e => setProgram(e.target.value as keyof typeof PROGRAMS)}>
                {Object.entries(PROGRAMS).map(([key, p]) => (
                  <option key={key} value={key}>{p.label} · {p.kwh} kWh</option>
                ))}
              </select>
            </div>

            <div className="lav-field">
              <label>Eficiencia energética</label>
              <select value={efficiency} onChange={e => setEfficiency(e.target.value as keyof typeof EFFICIENCY)}>
                {Object.entries(EFFICIENCY).map(([key, e]) => (
                  <option key={key} value={key}>{e.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="lav-row">
            <div className="lav-field">
              <label>Hora de inicio</label>
              <div className="lav-time">
                <select value={startHour} onChange={e => setStartHour(parseInt(e.target.value))}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                  ))}
                </select>
                <span>:</span>
                <select value={startMin} onChange={e => setStartMin(parseInt(e.target.value))}>
                  {[0, 15, 30, 45].map(m => (
                    <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="lav-field">
              <label>Lavados por semana</label>
              <input
                type="number"
                value={cyclesPerWeek}
                onChange={e => setCyclesPerWeek(Math.max(1, Math.min(30, parseInt(e.target.value) || 1)))}
                min="1"
                max="30"
              />
            </div>
          </div>
        </div>

        {/* COSTES RECURRENTES */}
        <div className="lav-recurring">
          <div className="lav-recurring-title">
            <CalcIcon size={14} /> Si lavas {cyclesPerWeek} veces por semana
          </div>
          <div className="lav-recurring-grid">
            <div>
              <div className="lr-label">AL MES</div>
              <div className="lr-value inter-numbers">{fmtMoney(costPerMonth)}</div>
            </div>
            <div>
              <div className="lr-label">AL AÑO</div>
              <div className="lr-value inter-numbers">{fmtMoney(costPerYear)}</div>
            </div>
            <div>
              <div className="lr-label">PODRÍAS AHORRAR</div>
              <div className="lr-value inter-numbers green">{fmtMoney(savingsPerYear)}/año</div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lav-card {
          background: linear-gradient(135deg, var(--surface2), var(--surface));
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 24px;
        }

        .lav-loading, .lav-error {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 18px;
          padding: 60px 24px;
          text-align: center;
          color: var(--text-soft);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .lav-spinner {
          width: 20px; height: 20px;
          border: 2px solid var(--border);
          border-top-color: var(--accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .lav-result {
          padding-bottom: 20px;
          border-bottom: 1px solid var(--border);
          margin-bottom: 20px;
        }
        .lav-result-label {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--text-soft);
          margin-bottom: 6px;
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
        }
        .lav-result-price {
          font-family: 'Inter', sans-serif;
          font-size: clamp(36px, 6vw, 52px);
          font-weight: 800;
          line-height: 1;
          margin-bottom: 8px;
        }
        .lav-result-info {
          font-size: 13px;
          color: var(--text-soft);
        }

        .lav-comparison {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid var(--border);
        }
        .lav-mini {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .lav-mini-label {
          font-size: 10px;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .lav-mini-value {
          font-family: 'Inter', sans-serif;
          font-size: 16px;
          font-weight: 800;
        }
        .lav-mini-value.green { color: var(--green-bright); }
        .lav-mini-value.red { color: var(--red); }
        .lav-mini-value.accent { color: var(--accent); }

        .lav-form {
          margin-bottom: 20px;
        }
        .lav-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
          margin-bottom: 12px;
        }
        .lav-field {
          display: flex;
          flex-direction: column;
        }
        .lav-field label {
          display: block;
          font-size: 11px;
          color: var(--text-soft);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .lav-field select,
        .lav-field input {
          width: 100%;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text);
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          padding: 0 14px;
          height: 48px;
          outline: none;
          appearance: none;
          -webkit-appearance: none;
          box-sizing: border-box;
        }
        .lav-field select {
          background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8aabc' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          padding-right: 36px;
        }
        .lav-time {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 0 12px;
          height: 48px;
        }
        .lav-time select {
          flex: 1;
          background: transparent;
          border: none;
          height: 100%;
          padding: 0;
          text-align: center;
          font-weight: 600;
        }
        .lav-time span {
          color: var(--muted);
          font-weight: 800;
        }

        .lav-recurring {
          background: var(--accent-bg);
          border: 1px solid rgba(129, 140, 248, 0.2);
          border-radius: 14px;
          padding: 18px;
        }
        .lav-recurring-title {
          font-size: 12px;
          color: var(--accent);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 800;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .lav-recurring-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }
        .lr-label {
          font-size: 10px;
          color: var(--text-soft);
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }
        .lr-value {
          font-family: 'Inter', sans-serif;
          font-size: 18px;
          font-weight: 800;
        }
        .lr-value.green { color: var(--green-bright); }

        @media (max-width: 600px) {
          .lav-row { grid-template-columns: 1fr; }
          .lav-comparison { grid-template-columns: 1fr; gap: 8px; }
          .lav-mini { flex-direction: row; justify-content: space-between; align-items: center; }
          .lav-recurring-grid { grid-template-columns: 1fr; gap: 8px; }
          .lav-recurring-grid > div { display: flex; justify-content: space-between; align-items: center; }
          .lav-card { padding: 20px 18px; }
        }
      `}</style>
    </>
  );
}
