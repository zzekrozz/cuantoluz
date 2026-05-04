'use client';

import { useState } from 'react';
import {
  appliances, cars, FAST_CHARGE_PRICE,
  fmt, fmtMoney, h, hm,
  color, getPriceAtHour, calculateCyclePrice,
  PriceData
} from '@/lib/utils';

interface Props {
  prices: PriceData[];
  currentHour: number;
}

interface MyDayItem {
  id: number;
  key: string;
  label: string;
  icon: string;
  startH: number;
  startM: number;
  duration: number;
  kwh: number;
  cost: number;
  type: string;
}

interface TimeRange {
  id: number;
  startH: number;
  startM: number;
  endH: number;
  endM: number;
}

type ActiveCalc = 'cycle' | 'time' | 'ev' | 'myday';

export default function Calculator({ prices, currentHour }: Props) {
  const minP = prices.reduce((a, b) => a.price < b.price ? a : b);
  const maxP = prices.reduce((a, b) => a.price > b.price ? a : b);

  // Mobile: which calc is active
  const [activeCalc, setActiveCalc] = useState<ActiveCalc>('cycle');

  // Cycle calculator
  const [cycleApp, setCycleApp] = useState('lavadora_basica');
  const [cycleMode, setCycleMode] = useState<'simple' | 'advanced'>('simple');
  const [cycleStartH, setCycleStartH] = useState(currentHour);
  const [cycleStartM, setCycleStartM] = useState(0);
  const [cycleDuration, setCycleDuration] = useState(2);
  const [cycleKwh, setCycleKwh] = useState(0.9);
  const [cycleResult, setCycleResult] = useState<any>(null);

  // Time calculator
  const [timeApp, setTimeApp] = useState('aire_inverter');
  const [timeKw, setTimeKw] = useState(1.0);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { id: 1, startH: currentHour, startM: 0, endH: (currentHour + 1) % 24, endM: 0 }
  ]);
  const [timeResult, setTimeResult] = useState<any>(null);

  // EV
  const [evModel, setEvModel] = useState('tesla_3');
  const [evChargeMode, setEvChargeMode] = useState<'home' | 'fast'>('home');
  const [evFrom, setEvFrom] = useState(20);
  const [evTo, setEvTo] = useState(80);
  const [evHour, setEvHour] = useState(currentHour);
  const [evCustomKwh, setEvCustomKwh] = useState(60);
  const [evCustomPer100, setEvCustomPer100] = useState(16);
  const [evResult, setEvResult] = useState<any>(null);

  // Mi Dia
  const [myDayApp, setMyDayApp] = useState('lavadora_basica');
  const [myDayHour, setMyDayHour] = useState(currentHour);
  const [myDayMin, setMyDayMin] = useState(0);
  const [myDayDuration, setMyDayDuration] = useState(2);
  const [myDayItems, setMyDayItems] = useState<MyDayItem[]>([]);
  const [showOptimization, setShowOptimization] = useState(false);

  // ============ CYCLE ============
  const handleCycleAppChange = (key: string) => {
    setCycleApp(key);
    const app = appliances[key];
    setCycleKwh(app.kwh);
    setCycleDuration(app.duration);
  };

  const calcCycle = () => {
    const app = appliances[cycleApp];
    const startH = cycleStartH;
    const startM = cycleMode === 'simple' ? 0 : cycleStartM;
    const cost = calculateCyclePrice(prices, startH, startM, cycleDuration, cycleKwh);
    const costAtBest = calculateCyclePrice(prices, minP.hour, 0, cycleDuration, cycleKwh);
    const costAtWorst = calculateCyclePrice(prices, maxP.hour, 0, cycleDuration, cycleKwh);

    setCycleResult({
      cost, costAtBest, costAtWorst,
      app, startH, startM,
      duration: cycleDuration, kwh: cycleKwh,
      priceAtHour: getPriceAtHour(prices, startH)
    });
  };

  // ============ TIME ============
  const handleTimeAppChange = (key: string) => {
    setTimeApp(key);
    setTimeKw(appliances[key].kw);
  };

  const addTimeRange = () => {
    const newId = Math.max(0, ...timeRanges.map(r => r.id)) + 1;
    setTimeRanges([...timeRanges, {
      id: newId,
      startH: currentHour,
      startM: 0,
      endH: (currentHour + 1) % 24,
      endM: 0
    }]);
  };

  const removeTimeRange = (id: number) => {
    if (timeRanges.length === 1) return;
    setTimeRanges(timeRanges.filter(r => r.id !== id));
  };

  const updateTimeRange = (id: number, field: keyof TimeRange, value: number) => {
    setTimeRanges(timeRanges.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const calcTime = () => {
    const app = appliances[timeApp];
    let totalCost = 0;
    let totalMinutes = 0;
    const rangeDetails: any[] = [];

    timeRanges.forEach(r => {
      const startTotalMin = r.startH * 60 + r.startM;
      let endTotalMin = r.endH * 60 + r.endM;
      if (endTotalMin <= startTotalMin) endTotalMin += 24 * 60;
      const durationMin = endTotalMin - startTotalMin;
      const durationH = durationMin / 60;
      const totalKwhRange = timeKw * durationH;
      const rangeCost = calculateCyclePrice(prices, r.startH, r.startM, durationH, totalKwhRange);
      totalCost += rangeCost;
      totalMinutes += durationMin;
      rangeDetails.push({
        from: hm(r.startH, r.startM),
        to: hm(r.endH % 24, r.endM),
        cost: rangeCost,
        duration: durationH
      });
    });

    const totalHours = totalMinutes / 60;
    const totalKwh = timeKw * totalHours;

    setTimeResult({
      totalCost, totalKwh, totalHours,
      app, kw: timeKw,
      rangeDetails,
      costAtBest: totalKwh * minP.price,
      costAtWorst: totalKwh * maxP.price,
    });
  };

  // ============ EV ============
  const calcEv = () => {
    const isCustom = evModel === 'custom';
    const car = isCustom
      ? { label: 'Personalizado', per100: evCustomPer100, battery: evCustomKwh }
      : cars[evModel];

    if (evTo <= evFrom) {
      alert('La carga final debe ser mayor que la inicial');
      return;
    }

    const kwhNeeded = car.battery * (evTo - evFrom) / 100;
    const priceAtHour = getPriceAtHour(prices, evHour);
    const costHome = kwhNeeded * priceAtHour;
    const costFast = kwhNeeded * FAST_CHARGE_PRICE;
    const costUsed = evChargeMode === 'home' ? costHome : costFast;
    const kmRange = (kwhNeeded / car.per100) * 100;

    setEvResult({
      car, isCustom, kwhNeeded, priceAtHour, costHome, costFast, costUsed, kmRange,
      from: evFrom, to: evTo, hour: evHour, chargeMode: evChargeMode
    });
  };

  // ============ MI DIA ============
  const addToMyDay = () => {
    const app = appliances[myDayApp];
    let cost: number, kwh: number;

    if (app.type === 'cycle') {
      kwh = app.kwh;
      cost = calculateCyclePrice(prices, myDayHour, myDayMin, myDayDuration, kwh);
    } else {
      kwh = app.kw * myDayDuration;
      cost = calculateCyclePrice(prices, myDayHour, myDayMin, myDayDuration, kwh);
    }

    setMyDayItems([...myDayItems, {
      id: Date.now(),
      key: myDayApp,
      label: app.label,
      icon: app.icon,
      startH: myDayHour,
      startM: myDayMin,
      duration: myDayDuration,
      kwh,
      cost,
      type: app.type
    }]);
    setShowOptimization(false);
  };

  const removeMyDayItem = (id: number) => {
    setMyDayItems(myDayItems.filter(i => i.id !== id));
    setShowOptimization(false);
  };

  const optimizations = myDayItems.map(item => {
    let bestHour = 0;
    let bestCost = Infinity;
    for (let h = 0; h < 24; h++) {
      const c = calculateCyclePrice(prices, h, 0, item.duration, item.kwh);
      if (c < bestCost) {
        bestCost = c;
        bestHour = h;
      }
    }
    return { ...item, bestHour, bestCost, savings: item.cost - bestCost };
  });

  const totalCostMyDay = myDayItems.reduce((s, i) => s + i.cost, 0);
  const optimizedCost = optimizations.reduce((s, i) => s + i.bestCost, 0);
  const totalSavings = totalCostMyDay - optimizedCost;
  const totalKwh = myDayItems.reduce((s, i) => s + i.kwh, 0);

  // ============ RENDER ============
  const calcTabs = [
    { id: 'cycle' as const, icon: '🧺', label: 'Lavadora' },
    { id: 'time' as const, icon: '❄️', label: 'Aire/TV' },
    { id: 'ev' as const, icon: '🔋', label: 'Coche EV' },
    { id: 'myday' as const, icon: '📋', label: 'Mi día' },
  ];

  return (
    <>
      <CalculatorStyles />

      <div className="section-header">
        <div className="section-title">🧮 Calculadoras</div>
        <div className="section-sub">Calcula cuánto te cuesta cada cosa según la hora</div>
      </div>

      {/* MOBILE: Tab navigation - cards */}
      <div className="calc-nav">
        {calcTabs.map(tab => (
          <button
            key={tab.id}
            className={`calc-nav-btn ${activeCalc === tab.id ? 'active' : ''}`}
            onClick={() => setActiveCalc(tab.id)}
          >
            <div className="calc-nav-icon">{tab.icon}</div>
            <div className="calc-nav-label">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* CYCLE CALCULATOR */}
      <div className={`calc-section ${activeCalc === 'cycle' ? 'mobile-active' : ''}`}>
        <div className="card">
          <div className="card-title">🧺 Lavadora, secadora y lavavajillas</div>

          {/* RESULT TOP (mobile-first: shows above) */}
          {cycleResult && (
            <div className="result-top">
              <div className="result-top-label">Te costará</div>
              <div className="result-top-price" style={{ color: color(cycleResult.priceAtHour) }}>
                {fmtMoney(cycleResult.cost)}
              </div>
              <div className="result-top-info">
                {cycleResult.app.icon} {cycleResult.app.label} a las {hm(cycleResult.startH, cycleResult.startM)}
              </div>
              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Mejor hora ({h(minP.hour)})</span>
                  <span className="result-mini-value green">{fmtMoney(cycleResult.costAtBest)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">Peor hora ({h(maxP.hour)})</span>
                  <span className="result-mini-value red">{fmtMoney(cycleResult.costAtWorst)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">Diferencia</span>
                  <span className="result-mini-value accent">{fmtMoney(cycleResult.costAtWorst - cycleResult.costAtBest)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="big-field">
            <label>Aparato</label>
            <select value={cycleApp} onChange={e => handleCycleAppChange(e.target.value)}>
              {Object.entries(appliances).filter(([_, v]) => v.type === 'cycle').map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.label} · {v.kwh} kWh</option>
              ))}
            </select>
          </div>

          <div className="big-field">
            <label>Modo de hora</label>
            <div className="toggle-row big">
              <button className={`toggle-opt ${cycleMode === 'simple' ? 'active' : ''}`} onClick={() => setCycleMode('simple')}>Solo horas</button>
              <button className={`toggle-opt ${cycleMode === 'advanced' ? 'active' : ''}`} onClick={() => setCycleMode('advanced')}>Con minutos</button>
            </div>
          </div>

          {cycleMode === 'simple' ? (
            <div className="big-field">
              <label>Hora de inicio</label>
              <select value={cycleStartH} onChange={e => setCycleStartH(parseInt(e.target.value))}>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>{h(i)}</option>
                ))}
              </select>
            </div>
          ) : (
            <div className="row-2">
              <div className="big-field">
                <label>Hora</label>
                <select value={cycleStartH} onChange={e => setCycleStartH(parseInt(e.target.value))}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
              <div className="big-field">
                <label>Minutos</label>
                <select value={cycleStartM} onChange={e => setCycleStartM(parseInt(e.target.value))}>
                  {[0, 15, 30, 45].map(m => (
                    <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="row-2">
            <div className="big-field">
              <label>Duración (h)</label>
              <input type="number" value={cycleDuration} onChange={e => setCycleDuration(parseFloat(e.target.value) || 0)} min="0.5" max="8" step="0.5" />
            </div>
            <div className="big-field">
              <label>Consumo (kWh)</label>
              <input type="number" value={cycleKwh} onChange={e => setCycleKwh(parseFloat(e.target.value) || 0)} min="0.1" max="5" step="0.1" />
            </div>
          </div>

          <button className="btn-calc-big" onClick={calcCycle}>Calcular ⚡</button>
        </div>
      </div>

      {/* TIME CALCULATOR */}
      <div className={`calc-section ${activeCalc === 'time' ? 'mobile-active' : ''}`}>
        <div className="card">
          <div className="card-title">❄️ Aire, TV, calefacción (por horas)</div>

          {timeResult && (
            <div className="result-top">
              <div className="result-top-label">Te costará</div>
              <div className="result-top-price" style={{ color: color(timeResult.totalCost / timeResult.totalKwh) }}>
                {fmtMoney(timeResult.totalCost)}
              </div>
              <div className="result-top-info">
                {timeResult.app.icon} {timeResult.app.label} · {timeResult.totalHours.toFixed(2)}h totales
              </div>
              <div style={{ marginTop: '12px', fontSize: '12px', color: 'var(--muted)' }}>
                {timeResult.rangeDetails.map((r: any, i: number) => (
                  <div key={i}>· {r.from} → {r.to} ({r.duration.toFixed(2)}h) = {fmtMoney(r.cost)}</div>
                ))}
              </div>
              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Hora barata</span>
                  <span className="result-mini-value green">{fmtMoney(timeResult.costAtBest)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">Hora cara</span>
                  <span className="result-mini-value red">{fmtMoney(timeResult.costAtWorst)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">Diferencia</span>
                  <span className="result-mini-value accent">{fmtMoney(timeResult.costAtWorst - timeResult.costAtBest)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="row-2">
            <div className="big-field">
              <label>Aparato</label>
              <select value={timeApp} onChange={e => handleTimeAppChange(e.target.value)}>
                {Object.entries(appliances).filter(([_, v]) => v.type === 'time').map(([k, v]) => (
                  <option key={k} value={k}>{v.icon} {v.label} · {v.kw} kW</option>
                ))}
              </select>
            </div>
            <div className="big-field">
              <label>Potencia (kW)</label>
              <input type="number" value={timeKw} onChange={e => setTimeKw(parseFloat(e.target.value) || 0)} min="0.05" max="10" step="0.05" />
            </div>
          </div>

          <div className="big-field">
            <label>Franjas de uso</label>
            {timeRanges.map(range => (
              <div key={range.id} className="time-range-card">
                <div className="trange-row">
                  <span className="trange-label">Desde</span>
                  <select value={range.startH} onChange={e => updateTimeRange(range.id, 'startH', parseInt(e.target.value))}>
                    {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                  </select>
                  <span style={{ color: 'var(--muted)' }}>:</span>
                  <select value={range.startM} onChange={e => updateTimeRange(range.id, 'startM', parseInt(e.target.value))}>
                    {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                  </select>
                </div>
                <div className="trange-row">
                  <span className="trange-label">Hasta</span>
                  <select value={range.endH} onChange={e => updateTimeRange(range.id, 'endH', parseInt(e.target.value))}>
                    {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                  </select>
                  <span style={{ color: 'var(--muted)' }}>:</span>
                  <select value={range.endM} onChange={e => updateTimeRange(range.id, 'endM', parseInt(e.target.value))}>
                    {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                  </select>
                </div>
                {timeRanges.length > 1 && (
                  <button className="trange-remove" onClick={() => removeTimeRange(range.id)}>✕ Quitar</button>
                )}
              </div>
            ))}
            <button className="btn-add-range" onClick={addTimeRange}>+ Añadir otra franja</button>
          </div>

          <button className="btn-calc-big" onClick={calcTime}>Calcular ⚡</button>
        </div>
      </div>

      {/* EV */}
      <div className={`calc-section ${activeCalc === 'ev' ? 'mobile-active' : ''}`}>
        <div className="card">
          <div className="card-title">🔋 Coche eléctrico</div>

          {evResult && (
            <div className="result-top">
              <div className="result-top-label">Cargar costará</div>
              <div className="result-top-price" style={{ color: color(evResult.priceAtHour) }}>
                {fmtMoney(evResult.costUsed)}
              </div>
              <div className="result-top-info">
                {evResult.isCustom ? '🔧' : '🔋'} {evResult.car.label} · {evResult.from}% → {evResult.to}% ({evResult.kwhNeeded.toFixed(1)} kWh = {evResult.kmRange.toFixed(0)} km)
              </div>
              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Casa a las {h(evResult.hour)}</span>
                  <span className="result-mini-value green">{fmtMoney(evResult.costHome)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">Carga rápida</span>
                  <span className="result-mini-value red">{fmtMoney(evResult.costFast)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">Diferencia</span>
                  <span className="result-mini-value accent">{fmtMoney(evResult.costFast - evResult.costHome)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="big-field">
            <label>Modelo</label>
            <select value={evModel} onChange={e => setEvModel(e.target.value)}>
              {Object.entries(cars).map(([k, v]) => (
                <option key={k} value={k}>{v.label} · {v.battery} kWh</option>
              ))}
            </select>
          </div>

          {evModel === 'custom' && (
            <div className="custom-block">
              <div className="custom-block-title">🔧 Datos personalizados</div>
              <div className="row-2">
                <div className="big-field">
                  <label>Batería (kWh)</label>
                  <input type="number" value={evCustomKwh} onChange={e => setEvCustomKwh(parseFloat(e.target.value) || 0)} min="10" max="200" step="1" />
                </div>
                <div className="big-field">
                  <label>kWh / 100km</label>
                  <input type="number" value={evCustomPer100} onChange={e => setEvCustomPer100(parseFloat(e.target.value) || 0)} min="8" max="30" step="0.5" />
                </div>
              </div>
            </div>
          )}

          <div className="big-field">
            <label>Tipo de carga</label>
            <div className="toggle-row big">
              <button className={`toggle-opt ${evChargeMode === 'home' ? 'active' : ''}`} onClick={() => setEvChargeMode('home')}>🏠 En casa</button>
              <button className={`toggle-opt ${evChargeMode === 'fast' ? 'active' : ''}`} onClick={() => setEvChargeMode('fast')}>⚡ Rápida</button>
            </div>
          </div>

          <div className="row-2">
            <div className="big-field">
              <label>Desde (%)</label>
              <input type="number" value={evFrom} onChange={e => setEvFrom(parseInt(e.target.value) || 0)} min="0" max="100" />
            </div>
            <div className="big-field">
              <label>Hasta (%)</label>
              <input type="number" value={evTo} onChange={e => setEvTo(parseInt(e.target.value) || 0)} min="0" max="100" />
            </div>
          </div>

          <div className="big-field">
            <label>Hora de carga</label>
            <select value={evHour} onChange={e => setEvHour(parseInt(e.target.value))}>
              {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{h(i)}</option>)}
            </select>
          </div>

          <button className="btn-calc-big" onClick={calcEv}>Calcular ⚡</button>
        </div>
      </div>

      {/* MI DIA */}
      <div className={`calc-section ${activeCalc === 'myday' ? 'mobile-active' : ''}`}>
        <div className="card">
          <div className="card-title">📋 Mi día completo</div>

          {myDayItems.length > 0 && (
            <div className="result-top">
              <div className="result-top-label">Total del día</div>
              <div className="result-top-price" style={{ color: color(totalCostMyDay / totalKwh) }}>
                {fmtMoney(totalCostMyDay)}
              </div>
              <div className="result-top-info">{totalKwh.toFixed(2)} kWh · {myDayItems.length} usos</div>
              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Si optimizas</span>
                  <span className="result-mini-value green">{fmtMoney(optimizedCost)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">Ahorro posible</span>
                  <span className="result-mini-value accent">{fmtMoney(totalSavings)}</span>
                </div>
                <div className="result-mini">
                  <span className="result-mini-label">% mejora</span>
                  <span className="result-mini-value green">{Math.round((totalSavings / totalCostMyDay) * 100)}%</span>
                </div>
              </div>
            </div>
          )}

          <div className="myday-add">
            <div className="big-field">
              <label>Aparato</label>
              <select value={myDayApp} onChange={e => setMyDayApp(e.target.value)}>
                <optgroup label="Ciclos">
                  {Object.entries(appliances).filter(([_, v]) => v.type === 'cycle').map(([k, v]) => (
                    <option key={k} value={k}>{v.icon} {v.label}</option>
                  ))}
                </optgroup>
                <optgroup label="Por horas">
                  {Object.entries(appliances).filter(([_, v]) => v.type === 'time').map(([k, v]) => (
                    <option key={k} value={k}>{v.icon} {v.label}</option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="row-2">
              <div className="big-field">
                <label>Hora</label>
                <select value={myDayHour} onChange={e => setMyDayHour(parseInt(e.target.value))}>
                  {Array.from({ length: 24 }, (_, i) => <option key={i} value={i}>{String(i).padStart(2, '0')}</option>)}
                </select>
              </div>
              <div className="big-field">
                <label>Minutos</label>
                <select value={myDayMin} onChange={e => setMyDayMin(parseInt(e.target.value))}>
                  {[0, 15, 30, 45].map(m => <option key={m} value={m}>{String(m).padStart(2, '0')}</option>)}
                </select>
              </div>
            </div>

            <div className="big-field">
              <label>Duración (h)</label>
              <input type="number" value={myDayDuration} onChange={e => setMyDayDuration(parseFloat(e.target.value) || 0)} min="0.25" max="24" step="0.25" />
            </div>

            <button className="btn-calc-big btn-add" onClick={addToMyDay}>+ Añadir a mi día</button>
          </div>

          {myDayItems.length === 0 ? (
            <div className="myday-empty">📋 Tu día está vacío. Añade aparatos arriba.</div>
          ) : (
            <>
              <div className="myday-list">
                {myDayItems.map(item => (
                  <div key={item.id} className="myday-item">
                    <div style={{ fontSize: '24px' }}>{item.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px' }}>{item.label}</div>
                      <div style={{ fontSize: '12px', color: 'var(--muted)' }}>
                        {hm(item.startH, item.startM)} · {item.duration}h · {item.kwh.toFixed(2)} kWh
                      </div>
                    </div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: '16px', color: color(item.cost / item.kwh) }}>
                      {fmtMoney(item.cost)}
                    </div>
                    <button className="myday-remove" onClick={() => removeMyDayItem(item.id)}>✕</button>
                  </div>
                ))}
              </div>

              <button className="btn-calc-big" onClick={() => setShowOptimization(!showOptimization)} style={{ marginTop: '12px' }}>
                {showOptimization ? '⬆️ Ocultar' : '⚡ Optimizar mi día'}
              </button>

              {showOptimization && (
                <div className="myday-tips">
                  <div className="myday-tips-title">💡 Recomendaciones</div>
                  {optimizations.map(r => (
                    <div key={r.id} className="myday-tip">
                      {r.savings < 0.01 ? (
                        <span style={{ color: 'var(--text-soft)' }}>{r.icon} <strong>{r.label}</strong> — Ya está bien</span>
                      ) : (
                        <span>{r.icon} <strong>{r.label}</strong>: mueve de {hm(r.startH, r.startM)} → <strong style={{ color: 'var(--green-bright)' }}>{h(r.bestHour)}</strong> · ahorras <strong style={{ color: 'var(--green-bright)' }}>{fmtMoney(r.savings)}</strong></span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function CalculatorStyles() {
  return (
    <style jsx global>{`
      .section-header { margin: 32px 0 16px; padding: 0 4px; }
      .section-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; margin-bottom: 6px; }
      .section-sub { font-size: 14px; color: var(--text-soft); }

      /* MOBILE TAB NAVIGATION */
      .calc-nav {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }
      .calc-nav-btn {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px 8px;
        cursor: pointer;
        font-family: inherit;
        text-align: center;
        transition: all 0.2s;
        color: var(--text-soft);
      }
      .calc-nav-btn:hover { border-color: var(--accent); }
      .calc-nav-btn.active {
        background: var(--accent-bg);
        border-color: var(--accent);
        color: var(--text);
      }
      .calc-nav-icon { font-size: 24px; margin-bottom: 4px; }
      .calc-nav-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

      /* CALC SECTIONS */
      .calc-section { display: block; margin-bottom: 16px; }

      /* Cards */
      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 24px;
      }
      .card-title {
        font-family: 'Syne', sans-serif;
        font-size: 16px; font-weight: 700;
        margin-bottom: 18px;
      }

      /* RESULT TOP */
      .result-top {
        background: linear-gradient(135deg, var(--surface2), var(--surface));
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 22px;
        margin-bottom: 22px;
        animation: up 0.3s ease both;
      }
      .result-top-label {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        color: var(--text-soft);
        margin-bottom: 6px;
      }
      .result-top-price {
        font-family: 'Syne', sans-serif;
        font-size: 48px;
        font-weight: 800;
        line-height: 1;
        margin-bottom: 8px;
      }
      .result-top-info {
        font-size: 14px;
        color: var(--text);
      }
      .result-top-comparison {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--border);
      }
      .result-mini {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .result-mini-label {
        font-size: 10px;
        color: var(--muted);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .result-mini-value {
        font-family: 'Syne', sans-serif;
        font-size: 14px;
        font-weight: 700;
      }
      .result-mini-value.green { color: var(--green-bright); }
      .result-mini-value.red { color: var(--red); }
      .result-mini-value.accent { color: var(--accent); }

      /* BIG FIELDS (mobile-friendly) */
      .big-field {
        margin-bottom: 14px;
      }
      .big-field label {
        display: block;
        font-size: 12px;
        color: var(--text-soft);
        margin-bottom: 6px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 500;
      }
      .big-field select,
      .big-field input {
        width: 100%;
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
        font-size: 16px;
        padding: 14px 16px;
        outline: none;
        appearance: none;
        transition: border-color 0.15s;
        min-height: 50px;
      }
      .big-field select:focus,
      .big-field input:focus {
        border-color: var(--accent);
      }
      .big-field select {
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8aabc' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 16px center;
        padding-right: 40px;
      }

      .row-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      /* TOGGLE BIG */
      .toggle-row { display: flex; gap: 6px; background: var(--surface2); padding: 5px; border-radius: 12px; }
      .toggle-row.big { padding: 6px; }
      .toggle-opt {
        flex: 1;
        padding: 12px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        color: var(--text-soft);
        cursor: pointer;
        border: none;
        background: transparent;
        font-family: inherit;
        transition: all 0.2s;
        min-height: 44px;
      }
      .toggle-opt.active { background: var(--surface3); color: var(--text); }

      /* BIG BUTTONS */
      .btn-calc-big {
        width: 100%;
        background: var(--accent-soft);
        color: white;
        border: none;
        border-radius: 14px;
        font-family: 'Syne', sans-serif;
        font-weight: 700;
        font-size: 17px;
        padding: 16px;
        cursor: pointer;
        transition: opacity 0.2s;
        min-height: 56px;
      }
      .btn-calc-big:hover { opacity: 0.9; }
      .btn-calc-big.btn-add { background: var(--green); }

      /* TIME RANGE CARDS */
      .time-range-card {
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 8px;
      }
      .trange-row {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }
      .trange-row:last-of-type { margin-bottom: 0; }
      .trange-label {
        font-size: 12px;
        color: var(--text-soft);
        font-weight: 600;
        min-width: 50px;
        text-transform: uppercase;
      }
      .trange-row select {
        flex: 1;
        background: var(--surface3);
        border: 1px solid var(--border);
        border-radius: 10px;
        color: var(--text);
        padding: 10px 12px;
        font-family: inherit;
        font-size: 15px;
        appearance: none;
        min-height: 42px;
      }
      .trange-remove {
        background: rgba(239,68,68,0.1);
        border: 1px solid rgba(239,68,68,0.2);
        color: var(--red);
        border-radius: 8px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 8px;
        width: 100%;
      }
      .btn-add-range {
        background: var(--accent-bg);
        color: var(--accent);
        border: 1px dashed rgba(129,140,248,0.3);
        border-radius: 12px;
        padding: 12px;
        width: 100%;
        cursor: pointer;
        font-family: inherit;
        font-size: 14px;
        font-weight: 600;
        margin-top: 8px;
        min-height: 48px;
      }

      /* CUSTOM BLOCK */
      .custom-block {
        background: var(--accent-bg);
        border: 1px solid rgba(129,140,248,0.2);
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 14px;
      }
      .custom-block-title {
        font-size: 12px;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 700;
        margin-bottom: 12px;
      }

      /* MY DAY */
      .myday-add {
        padding-bottom: 18px;
        margin-bottom: 18px;
        border-bottom: 1px solid var(--border);
      }
      .myday-empty {
        text-align: center;
        color: var(--muted);
        font-size: 14px;
        padding: 30px 20px;
        background: var(--surface2);
        border-radius: 12px;
      }
      .myday-list {
        background: var(--surface2);
        border-radius: 12px;
        overflow: hidden;
      }
      .myday-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        border-bottom: 1px solid var(--border-soft);
      }
      .myday-item:last-child { border-bottom: none; }
      .myday-remove {
        background: transparent;
        border: none;
        color: var(--muted);
        cursor: pointer;
        font-size: 18px;
        padding: 4px 8px;
        min-height: 32px;
        min-width: 32px;
      }
      .myday-remove:hover { color: var(--red); }

      .myday-tips {
        margin-top: 12px;
        background: var(--green-bg);
        border: 1px solid rgba(34,197,94,0.2);
        border-radius: 12px;
        padding: 14px;
      }
      .myday-tips-title {
        font-size: 12px;
        color: var(--green-bright);
        font-weight: 700;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .myday-tip {
        font-size: 13px;
        padding: 6px 0;
        line-height: 1.5;
      }

      /* ============ MOBILE FIRST ============ */
      @media (max-width: 767px) {
        .calc-section { display: none; }
        .calc-section.mobile-active { display: block; }
        
        .card { padding: 18px; border-radius: 16px; }
        
        .calc-nav-btn { padding: 12px 6px; }
        .calc-nav-icon { font-size: 22px; }
        .calc-nav-label { font-size: 10px; }
        
        .result-top-price { font-size: 40px; }
        .result-top-comparison {
          grid-template-columns: 1fr;
          gap: 10px;
        }
        .result-mini {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
      }

      /* ============ DESKTOP ============ */
      @media (min-width: 768px) {
        .calc-nav { display: none; }
        .calc-section { display: block; }
      }
    `}</style>
  );
}
