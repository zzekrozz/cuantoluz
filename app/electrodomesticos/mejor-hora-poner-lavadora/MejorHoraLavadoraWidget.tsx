'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fmtMoney, color, h, calculateCyclePrice, PriceData } from '@/lib/utils';
import { Clock, TrendingDown, TrendingUp, Shirt, ExternalLink } from 'lucide-react';

export default function MejorHoraLavadoraWidget() {
  const [todayPrices, setTodayPrices] = useState<PriceData[]>([]);
  const [tomorrowPrices, setTomorrowPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/precios?day=today').then(r => r.json()),
      fetch('/api/precios?day=tomorrow').then(r => r.json()),
    ])
      .then(([today, tomorrow]) => {
        if (today.prices?.length) setTodayPrices(today.prices);
        if (tomorrow.success && tomorrow.prices?.length) setTomorrowPrices(tomorrow.prices);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mhl-loading">
        <div className="mhl-spinner" />
        <span>Buscando la mejor hora para hoy…</span>
      </div>
    );
  }

  if (!todayPrices.length) return <div className="mhl-error">No se han podido cargar los precios.</div>;

  // Calcular mejor hora HOY para una lavadora estándar
  const LAVADORA_KWH = 0.8;
  const LAVADORA_DURATION = 2;

  function getBestHour(prices: PriceData[]) {
    let bestHour = 0;
    let bestCost = Infinity;
    for (let h = 0; h < 24; h++) {
      const cost = calculateCyclePrice(prices, h, 0, LAVADORA_DURATION, LAVADORA_KWH);
      if (cost < bestCost) { bestCost = cost; bestHour = h; }
    }
    return { hour: bestHour, cost: bestCost };
  }

  function getWorstHour(prices: PriceData[]) {
    let worstHour = 0;
    let worstCost = 0;
    for (let h = 0; h < 24; h++) {
      const cost = calculateCyclePrice(prices, h, 0, LAVADORA_DURATION, LAVADORA_KWH);
      if (cost > worstCost) { worstCost = cost; worstHour = h; }
    }
    return { hour: worstHour, cost: worstCost };
  }

  const todayBest = getBestHour(todayPrices);
  const todayWorst = getWorstHour(todayPrices);
  const todaySavings = todayWorst.cost - todayBest.cost;
  const savingsPct = todayWorst.cost > 0 ? Math.round((todaySavings / todayWorst.cost) * 100) : 0;

  const tomorrowBest = tomorrowPrices.length ? getBestHour(tomorrowPrices) : null;

  return (
    <>
      {/* MEJOR HORA HOY - destacado */}
      <div className="mhl-hero">
        <div className="mhl-hero-label"><Shirt size={14} className="icon-accent" /> Mejor hora para poner la lavadora HOY</div>
        <div className="mhl-hero-hour inter-numbers" style={{ color: 'var(--green-bright)' }}>{h(todayBest.hour)}</div>
        <div className="mhl-hero-desc">
          Te costaría <strong>{fmtMoney(todayBest.cost)}</strong> por lavado (estándar, 0,8 kWh).
        </div>

        <div className="mhl-comparison">
          <div className="mhl-mini">
            <span className="mhl-mini-label"><TrendingDown size={11} className="icon-green" /> Mejor hora</span>
            <span className="mhl-mini-value green">{h(todayBest.hour)} · {fmtMoney(todayBest.cost)}</span>
          </div>
          <div className="mhl-mini">
            <span className="mhl-mini-label"><TrendingUp size={11} className="icon-red" /> Peor hora</span>
            <span className="mhl-mini-value red">{h(todayWorst.hour)} · {fmtMoney(todayWorst.cost)}</span>
          </div>
          <div className="mhl-mini">
            <span className="mhl-mini-label">💰 Ahorras</span>
            <span className="mhl-mini-value accent">{fmtMoney(todaySavings)} ({savingsPct}%)</span>
          </div>
        </div>

        <Link href="/calculadoras/lavadora" className="mhl-cta">
          Calcular con mi programa real
          <ExternalLink size={12} />
        </Link>
      </div>

      {/* MEJOR HORA MAÑANA si está disponible */}
      {tomorrowBest && (
        <div className="mhl-tomorrow">
          <div className="mhl-tomorrow-label"><Clock size={14} /> Mejor hora MAÑANA</div>
          <div className="mhl-tomorrow-content">
            <span className="mhl-tomorrow-hour">{h(tomorrowBest.hour)}</span>
            <span className="mhl-tomorrow-cost">({fmtMoney(tomorrowBest.cost)} por lavado estándar)</span>
          </div>
        </div>
      )}

      <style jsx>{`
        .mhl-loading, .mhl-error { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 60px 24px; text-align: center; color: var(--text-soft); display: flex; align-items: center; justify-content: center; gap: 12px; }
        .mhl-spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.7s linear infinite; }

        .mhl-hero { background: linear-gradient(135deg, var(--surface2), var(--surface)); border: 1px solid var(--border); border-radius: 18px; padding: 32px 28px; margin-bottom: 16px; }
        .mhl-hero-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--text-soft); margin-bottom: 8px; display: flex; align-items: center; gap: 6px; font-weight: 700; }
        .mhl-hero-hour { font-family: 'Inter', sans-serif; font-size: clamp(56px, 10vw, 88px); font-weight: 900; line-height: 1; margin-bottom: 12px; }
        .mhl-hero-desc { font-size: 15px; color: var(--text-soft); margin-bottom: 20px; }
        .mhl-hero-desc strong { color: var(--text); font-weight: 700; }

        .mhl-comparison { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; padding: 16px; background: var(--surface); border-radius: 12px; margin-bottom: 20px; }
        .mhl-mini { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
        .mhl-mini-label { font-size: 10px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.5px; display: flex; align-items: center; gap: 4px; }
        .mhl-mini-value { font-family: 'Inter', sans-serif; font-size: 14px; font-weight: 800; }
        .mhl-mini-value.green { color: var(--green-bright); } .mhl-mini-value.red { color: var(--red); } .mhl-mini-value.accent { color: var(--accent); }

        :global(.mhl-cta) { display: inline-flex; align-items: center; gap: 6px; padding: 12px 20px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border-radius: 12px; font-weight: 700; text-decoration: none; transition: transform 0.2s; }
        :global(.mhl-cta:hover) { transform: translateY(-1px); text-decoration: none; }

        .mhl-tomorrow { background: var(--accent-bg); border: 1px solid rgba(129, 140, 248, 0.2); border-radius: 14px; padding: 16px 20px; display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .mhl-tomorrow-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--accent); font-weight: 800; display: flex; align-items: center; gap: 6px; }
        .mhl-tomorrow-content { display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap; }
        .mhl-tomorrow-hour { font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 800; color: var(--text); }
        .mhl-tomorrow-cost { font-size: 13px; color: var(--text-soft); }

        @media (max-width: 600px) {
          .mhl-hero { padding: 24px 20px; }
          .mhl-comparison { grid-template-columns: 1fr; gap: 8px; }
          .mhl-mini { flex-direction: row; justify-content: space-between; }
          .mhl-tomorrow { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
      `}</style>
    </>
  );
}
