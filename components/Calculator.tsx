'use client';

import { useState } from 'react';
import {
  appliances,
  cars,
  FAST_CHARGE_PRICE,
  fmtMoney,
  h,
  hm,
  color,
  getPriceAtHour,
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

function calculateVariableCost(
  prices: PriceData[],
  startH: number,
  startM: number,
  durationHours: number, 
  totalKwh: number
) {
  if (!prices?.length || durationHours <= 0 || totalKwh <= 0) return 0;

  let totalCost = 0;
  let minutesLeft = Math.round(durationHours * 60);
  let currentHour = startH;
  let currentMinute = startM;

  const kwhPerMinute = totalKwh / minutesLeft;

  while (minutesLeft > 0) {
    const minutesUntilNextHour = currentMinute === 0 ? 60 : 60 - currentMinute;
    const minutesThisBlock = Math.min(minutesLeft, minutesUntilNextHour);

    const hourPrice = getPriceAtHour(prices, currentHour);
    const kwhThisBlock = kwhPerMinute * minutesThisBlock;

    totalCost += kwhThisBlock * hourPrice;

    minutesLeft -= minutesThisBlock;
    currentMinute = 0;
    currentHour = (currentHour + 1) % 24;
  }

  return totalCost;
}

export default function Calculator({ prices, currentHour }: Props) {
  const minP = prices.reduce((a, b) => a.price < b.price ? a : b);
  const maxP = prices.reduce((a, b) => a.price > b.price ? a : b);

  const [activeCalc, setActiveCalc] = useState<ActiveCalc>('cycle');

  const [cycleApp, setCycleApp] = useState('lavadora_basica');
  const [cycleMode, setCycleMode] = useState<'simple' | 'advanced'>('simple');
  const [cycleStartH, setCycleStartH] = useState(currentHour);
  const [cycleStartM, setCycleStartM] = useState(0);
  const [cycleDuration, setCycleDuration] = useState(2);
  const [cycleKwh, setCycleKwh] = useState(0.9);
  const [cycleResult, setCycleResult] = useState<any>(null);

  const [timeApp, setTimeApp] = useState('aire_inverter');
  const [timeKw, setTimeKw] = useState(1.0);
  const [timeRanges, setTimeRanges] = useState<TimeRange[]>([
    { id: 1, startH: currentHour, startM: 0, endH: (currentHour + 1) % 24, endM: 0 }
  ]);
  const [timeResult, setTimeResult] = useState<any>(null);

  const [evModel, setEvModel] = useState('tesla_3');
  const [evChargeMode, setEvChargeMode] = useState<'home' | 'fast'>('home');
  const [evFrom, setEvFrom] = useState(20);
  const [evTo, setEvTo] = useState(80);
  const [evHour, setEvHour] = useState(currentHour);
  const [evCustomKwh, setEvCustomKwh] = useState(60);
  const [evCustomPer100, setEvCustomPer100] = useState(16);
  const [evResult, setEvResult] = useState<any>(null);

  const [myDayApp, setMyDayApp] = useState('lavadora_basica');
  const [myDayHour, setMyDayHour] = useState(currentHour);
  const [myDayMin, setMyDayMin] = useState(0);
  const [myDayDuration, setMyDayDuration] = useState(2);
  const [myDayItems, setMyDayItems] = useState<MyDayItem[]>([]);
  const [showOptimization, setShowOptimization] = useState(false);

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

    const cost = calculateVariableCost(prices, startH, startM, cycleDuration, cycleKwh);
    const costAtBest = calculateVariableCost(prices, minP.hour, 0, cycleDuration, cycleKwh);
    const costAtWorst = calculateVariableCost(prices, maxP.hour, 0, cycleDuration, cycleKwh);

    setCycleResult({
      cost,
      costAtBest,
      costAtWorst,
      app,
      startH,
      startM,
      duration: cycleDuration,
      kwh: cycleKwh,
      priceAtHour: getPriceAtHour(prices, startH)
    });
  };

  const handleTimeAppChange = (key: string) => {
    setTimeApp(key);
    setTimeKw(appliances[key].kw);
  };

  const addTimeRange = () => {
    const newId = Math.max(0, ...timeRanges.map(r => r.id)) + 1;

    setTimeRanges([
      ...timeRanges,
      {
        id: newId,
        startH: currentHour,
        startM: 0,
        endH: (currentHour + 1) % 24,
        endM: 0
      }
    ]);
  };

  const removeTimeRange = (id: number) => {
    if (timeRanges.length === 1) return;
    setTimeRanges(timeRanges.filter(r => r.id !== id));
  };

  const updateTimeRange = (id: number, field: keyof TimeRange, value: number) => {
    setTimeRanges(timeRanges.map(r => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const calcTime = () => {
    const app = appliances[timeApp];
    let totalCost = 0;
    let totalMinutes = 0;
    const rangeDetails: any[] = [];

    timeRanges.forEach(r => {
      const startTotalMin = r.startH * 60 + r.startM;
      let endTotalMin = r.endH * 60 + r.endM;

      if (endTotalMin <= startTotalMin) {
        endTotalMin += 24 * 60;
      }

      const durationMin = endTotalMin - startTotalMin;
      const durationH = durationMin / 60;
      const totalKwhRange = timeKw * durationH;

      const rangeCost = calculateVariableCost(
        prices,
        r.startH,
        r.startM,
        durationH,
        totalKwhRange
      );

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
      totalCost,
      totalKwh,
      totalHours,
      app,
      kw: timeKw,
      rangeDetails,
      costAtBest: totalKwh * minP.price,
      costAtWorst: totalKwh * maxP.price
    });
  };

  const calcEv = () => {
    const isCustom = evModel === 'custom';

    const car = isCustom
      ? { label: 'Personalizado', per100: evCustomPer100, battery: evCustomKwh }
      : cars[evModel];

    if (evTo <= evFrom) {
      alert('La carga final debe ser mayor que la inicial');
      return;
    }

    const kwhNeeded = (car.battery * (evTo - evFrom)) / 100;
    const priceAtHour = getPriceAtHour(prices, evHour);

    const costHome = kwhNeeded * priceAtHour;
    const costFast = kwhNeeded * FAST_CHARGE_PRICE;
    const costUsed = evChargeMode === 'home' ? costHome : costFast;
    const kmRange = (kwhNeeded / car.per100) * 100;

    setEvResult({
      car,
      isCustom,
      kwhNeeded,
      priceAtHour,
      costHome,
      costFast,
      costUsed,
      kmRange,
      from: evFrom,
      to: evTo,
      hour: evHour,
      chargeMode: evChargeMode
    });
  };

  const addToMyDay = () => {
    const app = appliances[myDayApp];

    let cost: number;
    let kwh: number;

    if (app.type === 'cycle') {
      kwh = app.kwh;
      cost = calculateVariableCost(prices, myDayHour, myDayMin, myDayDuration, kwh);
    } else {
      kwh = app.kw * myDayDuration;
      cost = calculateVariableCost(prices, myDayHour, myDayMin, myDayDuration, kwh);
    }

    setMyDayItems([
      ...myDayItems,
      {
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
      }
    ]);

    setShowOptimization(false);
  };

  const removeMyDayItem = (id: number) => {
    setMyDayItems(myDayItems.filter(i => i.id !== id));
    setShowOptimization(false);
  };

  const optimizations = myDayItems.map(item => {
    let bestHour = 0;
    let bestCost = Infinity;

    for (let hour = 0; hour < 24; hour++) {
      const cost = calculateVariableCost(prices, hour, 0, item.duration, item.kwh);

      if (cost < bestCost) {
        bestCost = cost;
        bestHour = hour;
      }
    }

    return {
      ...item,
      bestHour,
      bestCost,
      savings: item.cost - bestCost
    };
  });

  const totalCostMyDay = myDayItems.reduce((sum, item) => sum + item.cost, 0);
  const optimizedCost = optimizations.reduce((sum, item) => sum + item.bestCost, 0);
  const totalSavings = totalCostMyDay - optimizedCost;
  const totalKwh = myDayItems.reduce((sum, item) => sum + item.kwh, 0);

  const calcTabs = [
    { id: 'cycle' as const, icon: '🧺', label: 'Lavadora' },
    { id: 'time' as const, icon: '❄️', label: 'Aire/TV' },
    { id: 'ev' as const, icon: '🔋', label: 'Coche EV' },
    { id: 'myday' as const, icon: '📋', label: 'Mi día' }
  ];

  return (
    <>
      <CalculatorStyles />

      <div className="section-header">
        <div className="section-title">🧮 Calculadoras</div>
        <div className="section-sub">Calcula cuánto te cuesta cada cosa según la hora</div>
      </div>

      <div className="calc-nav">
        {calcTabs.map(tab => (
          <button
            key={tab.id}
            type="button"
            className={`calc-nav-btn ${activeCalc === tab.id ? 'active' : ''}`}
            onClick={() => setActiveCalc(tab.id)}
          >
            <div className="calc-nav-icon">{tab.icon}</div>
            <div className="calc-nav-label">{tab.label}</div>
          </button>
        ))}
      </div>

      <div className={`calc-section ${activeCalc === 'cycle' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">🧺 Lavadora, secadora y lavavajillas</div>

          {cycleResult && (
            <div className="result-top">
              <div className="result-top-label">Te costará</div>
              <div
                className="result-top-price"
                style={{ color: color(cycleResult.priceAtHour) }}
              >
                {fmtMoney(cycleResult.cost)}
              </div>

              <div className="result-top-info">
                {cycleResult.app.icon} {cycleResult.app.label} a las{' '}
                {hm(cycleResult.startH, cycleResult.startM)}
              </div>

              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Mejor hora ({h(minP.hour)})</span>
                  <span className="result-mini-value green">
                    {fmtMoney(cycleResult.costAtBest)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Peor hora ({h(maxP.hour)})</span>
                  <span className="result-mini-value red">
                    {fmtMoney(cycleResult.costAtWorst)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Diferencia</span>
                  <span className="result-mini-value accent">
                    {fmtMoney(cycleResult.costAtWorst - cycleResult.costAtBest)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="calculator-grid">
            <div className="big-field field-wide">
              <label>Aparato</label>
              <select value={cycleApp} onChange={e => handleCycleAppChange(e.target.value)}>
                {Object.entries(appliances)
                  .filter(([_, value]) => value.type === 'cycle')
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label} · {value.kwh} kWh
                    </option>
                  ))}
              </select>
            </div>

            <div className="big-field">
              <label>Modo de hora</label>
              <div className="toggle-row big">
                <button
                  type="button"
                  className={`toggle-opt ${cycleMode === 'simple' ? 'active' : ''}`}
                  onClick={() => setCycleMode('simple')}
                >
                  Solo horas
                </button>
                <button
                  type="button"
                  className={`toggle-opt ${cycleMode === 'advanced' ? 'active' : ''}`}
                  onClick={() => setCycleMode('advanced')}
                >
                  Con minutos
                </button>
              </div>
            </div>

            {cycleMode === 'simple' ? (
              <div className="big-field">
                <label>Hora de inicio</label>
                <select value={cycleStartH} onChange={e => setCycleStartH(parseInt(e.target.value))}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {h(i)}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <>
                <div className="big-field">
                  <label>Hora</label>
                  <select value={cycleStartH} onChange={e => setCycleStartH(parseInt(e.target.value))}>
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="big-field">
                  <label>Minutos</label>
                  <select value={cycleStartM} onChange={e => setCycleStartM(parseInt(e.target.value))}>
                    {[0, 15, 30, 45].map(minute => (
                      <option key={minute} value={minute}>
                        {String(minute).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="big-field">
              <label>Duración (h)</label>
              <input
                type="number"
                value={cycleDuration}
                onChange={e => setCycleDuration(parseFloat(e.target.value) || 0)}
                min="0.5"
                max="8"
                step="0.5"
              />
            </div>

            <div className="big-field">
              <label>Consumo (kWh)</label>
              <input
                type="number"
                value={cycleKwh}
                onChange={e => setCycleKwh(parseFloat(e.target.value) || 0)}
                min="0.1"
                max="5"
                step="0.1"
              />
            </div>
          </div>

          <button type="button" className="btn-calc-big" onClick={calcCycle}>
            Calcular ⚡
          </button>
        </div>
      </div>

      <div className={`calc-section ${activeCalc === 'time' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">❄️ Aire, TV, calefacción por horas</div>

          {timeResult && (
            <div className="result-top">
              <div className="result-top-label">Te costará</div>
              <div
                className="result-top-price"
                style={{ color: color(timeResult.totalCost / timeResult.totalKwh) }}
              >
                {fmtMoney(timeResult.totalCost)}
              </div>

              <div className="result-top-info">
                {timeResult.app.icon} {timeResult.app.label} ·{' '}
                {timeResult.totalHours.toFixed(2)}h totales
              </div>

              <div className="range-details">
                {timeResult.rangeDetails.map((range: any, index: number) => (
                  <div key={index}>
                    · {range.from} → {range.to} ({range.duration.toFixed(2)}h) ={' '}
                    {fmtMoney(range.cost)}
                  </div>
                ))}
              </div>

              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Hora barata</span>
                  <span className="result-mini-value green">
                    {fmtMoney(timeResult.costAtBest)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Hora cara</span>
                  <span className="result-mini-value red">
                    {fmtMoney(timeResult.costAtWorst)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Diferencia</span>
                  <span className="result-mini-value accent">
                    {fmtMoney(timeResult.costAtWorst - timeResult.costAtBest)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="calculator-grid">
            <div className="big-field">
              <label>Aparato</label>
              <select value={timeApp} onChange={e => handleTimeAppChange(e.target.value)}>
                {Object.entries(appliances)
                  .filter(([_, value]) => value.type === 'time')
                  .map(([key, value]) => (
                    <option key={key} value={key}>
                      {value.icon} {value.label} · {value.kw} kW
                    </option>
                  ))}
              </select>
            </div>

            <div className="big-field">
              <label>Potencia (kW)</label>
              <input
                type="number"
                value={timeKw}
                onChange={e => setTimeKw(parseFloat(e.target.value) || 0)}
                min="0.05"
                max="10"
                step="0.05"
              />
            </div>
          </div>

          <div className="big-field">
            <label>Franjas de uso</label>

            {timeRanges.map(range => (
              <div key={range.id} className="time-range-card">
                <div className="trange-row">
                  <span className="trange-label">Desde</span>

                  <select
                    value={range.startH}
                    onChange={e => updateTimeRange(range.id, 'startH', parseInt(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>

                  <span className="trange-separator">:</span>

                  <select
                    value={range.startM}
                    onChange={e => updateTimeRange(range.id, 'startM', parseInt(e.target.value))}
                  >
                    {[0, 15, 30, 45].map(minute => (
                      <option key={minute} value={minute}>
                        {String(minute).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="trange-row">
                  <span className="trange-label">Hasta</span>

                  <select
                    value={range.endH}
                    onChange={e => updateTimeRange(range.id, 'endH', parseInt(e.target.value))}
                  >
                    {Array.from({ length: 24 }, (_, i) => (
                      <option key={i} value={i}>
                        {String(i).padStart(2, '0')}
                      </option>
                    ))}
                  </select>

                  <span className="trange-separator">:</span>

                  <select
                    value={range.endM}
                    onChange={e => updateTimeRange(range.id, 'endM', parseInt(e.target.value))}
                  >
                    {[0, 15, 30, 45].map(minute => (
                      <option key={minute} value={minute}>
                        {String(minute).padStart(2, '0')}
                      </option>
                    ))}
                  </select>
                </div>

                {timeRanges.length > 1 && (
                  <button
                    type="button"
                    className="trange-remove"
                    onClick={() => removeTimeRange(range.id)}
                  >
                    Quitar
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="btn-add-range" onClick={addTimeRange}>
              + Añadir otra franja
            </button>
          </div>

          <button type="button" className="btn-calc-big" onClick={calcTime}>
            Calcular ⚡
          </button>
        </div>
      </div>

      <div className={`calc-section ${activeCalc === 'ev' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">🔋 Coche eléctrico</div>

          {evResult && (
            <div className="result-top">
              <div className="result-top-label">Cargar costará</div>
              <div
                className="result-top-price"
                style={{ color: color(evResult.priceAtHour) }}
              >
                {fmtMoney(evResult.costUsed)}
              </div>

              <div className="result-top-info">
                {evResult.isCustom ? '🔧' : '🔋'} {evResult.car.label} · {evResult.from}% →{' '}
                {evResult.to}% ({evResult.kwhNeeded.toFixed(1)} kWh ={' '}
                {evResult.kmRange.toFixed(0)} km)
              </div>

              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Casa a las {h(evResult.hour)}</span>
                  <span className="result-mini-value green">
                    {fmtMoney(evResult.costHome)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Carga rápida</span>
                  <span className="result-mini-value red">
                    {fmtMoney(evResult.costFast)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Diferencia</span>
                  <span className="result-mini-value accent">
                    {fmtMoney(evResult.costFast - evResult.costHome)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="calculator-grid ev-grid">
            <div className="big-field">
              <label>Modelo</label>
              <select value={evModel} onChange={e => setEvModel(e.target.value)}>
                {Object.entries(cars).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label} · {value.battery} kWh
                  </option>
                ))}
              </select>
            </div>

            <div className="big-field">
              <label>Tipo de carga</label>
              <div className="toggle-row big">
                <button
                  type="button"
                  className={`toggle-opt ${evChargeMode === 'home' ? 'active' : ''}`}
                  onClick={() => setEvChargeMode('home')}
                >
                  🏠 Casa
                </button>
                <button
                  type="button"
                  className={`toggle-opt ${evChargeMode === 'fast' ? 'active' : ''}`}
                  onClick={() => setEvChargeMode('fast')}
                >
                  ⚡ Rápida
                </button>
              </div>
            </div>

            <div className="big-field">
              <label>Carga desde</label>
              <input
                type="number"
                value={evFrom}
                onChange={e => setEvFrom(parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            <div className="big-field">
              <label>Hasta</label>
              <input
                type="number"
                value={evTo}
                onChange={e => setEvTo(parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            <div className="big-field">
              <label>Hora de carga</label>
              <select value={evHour} onChange={e => setEvHour(parseInt(e.target.value))}>
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={i}>
                    {h(i)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {evModel === 'custom' && (
            <div className="custom-block">
              <div className="custom-block-title">Datos personalizados</div>

              <div className="calculator-grid">
                <div className="big-field">
                  <label>Batería (kWh)</label>
                  <input
                    type="number"
                    value={evCustomKwh}
                    onChange={e => setEvCustomKwh(parseFloat(e.target.value) || 0)}
                    min="10"
                    max="200"
                    step="1"
                  />
                </div>

                <div className="big-field">
                  <label>kWh / 100 km</label>
                  <input
                    type="number"
                    value={evCustomPer100}
                    onChange={e => setEvCustomPer100(parseFloat(e.target.value) || 0)}
                    min="8"
                    max="30"
                    step="0.5"
                  />
                </div>
              </div>
            </div>
          )}

          <button type="button" className="btn-calc-big" onClick={calcEv}>
            Calcular carga →
          </button>
        </div>
      </div>

      <div className={`calc-section ${activeCalc === 'myday' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">📋 Mi día completo</div>

          {myDayItems.length > 0 && (
            <div className="result-top">
              <div className="result-top-label">Total del día</div>
              <div
                className="result-top-price"
                style={{ color: color(totalCostMyDay / totalKwh) }}
              >
                {fmtMoney(totalCostMyDay)}
              </div>

              <div className="result-top-info">
                {totalKwh.toFixed(2)} kWh · {myDayItems.length} usos
              </div>

              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Si optimizas</span>
                  <span className="result-mini-value green">
                    {fmtMoney(optimizedCost)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Ahorro posible</span>
                  <span className="result-mini-value accent">
                    {fmtMoney(totalSavings)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">% mejora</span>
                  <span className="result-mini-value green">
                    {Math.round((totalSavings / totalCostMyDay) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="myday-add">
            <div className="calculator-grid">
              <div className="big-field">
                <label>Aparato</label>
                <select value={myDayApp} onChange={e => setMyDayApp(e.target.value)}>
                  <optgroup label="Ciclos">
                    {Object.entries(appliances)
                      .filter(([_, value]) => value.type === 'cycle')
                      .map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.icon} {value.label}
                        </option>
                      ))}
                  </optgroup>

                  <optgroup label="Por horas">
                    {Object.entries(appliances)
                      .filter(([_, value]) => value.type === 'time')
                      .map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.icon} {value.label}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div className="big-field">
                <label>Hora</label>
                <select value={myDayHour} onChange={e => setMyDayHour(parseInt(e.target.value))}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="big-field">
                <label>Minutos</label>
                <select value={myDayMin} onChange={e => setMyDayMin(parseInt(e.target.value))}>
                  {[0, 15, 30, 45].map(minute => (
                    <option key={minute} value={minute}>
                      {String(minute).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="big-field">
                <label>Duración (h)</label>
                <input
                  type="number"
                  value={myDayDuration}
                  onChange={e => setMyDayDuration(parseFloat(e.target.value) || 0)}
                  min="0.25"
                  max="24"
                  step="0.25"
                />
              </div>
            </div>

            <button type="button" className="btn-calc-big btn-add" onClick={addToMyDay}>
              + Añadir a mi día
            </button>
          </div>

          {myDayItems.length === 0 ? (
            <div className="myday-empty">Tu día está vacío. Añade aparatos arriba.</div>
          ) : (
            <>
              <div className="myday-list">
                {myDayItems.map(item => (
                  <div key={item.id} className="myday-item">
                    <div className="myday-icon">{item.icon}</div>

                    <div className="myday-content">
                      <div className="myday-name">{item.label}</div>
                      <div className="myday-meta">
                        {hm(item.startH, item.startM)} · {item.duration}h ·{' '}
                        {item.kwh.toFixed(2)} kWh
                      </div>
                    </div>

                    <div
                      className="myday-price"
                      style={{ color: color(item.cost / item.kwh) }}
                    >
                      {fmtMoney(item.cost)}
                    </div>

                    <button
                      type="button"
                      className="myday-remove"
                      onClick={() => removeMyDayItem(item.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-calc-big"
                onClick={() => setShowOptimization(!showOptimization)}
              >
                {showOptimization ? 'Ocultar optimización' : 'Optimizar mi día'}
              </button>

              {showOptimization && (
                <div className="myday-tips">
                  <div className="myday-tips-title">Recomendaciones</div>

                  {optimizations.map(result => (
                    <div key={result.id} className="myday-tip">
                      {result.savings < 0.01 ? (
                        <span>
                          {result.icon} <strong>{result.label}</strong> ya está bien colocado.
                        </span>
                      ) : (
                        <span>
                          {result.icon} <strong>{result.label}</strong>: mueve de{' '}
                          {hm(result.startH, result.startM)} a{' '}
                          <strong style={{ color: 'var(--green-bright)' }}>
                            {h(result.bestHour)}
                          </strong>{' '}
                          y ahorras{' '}
                          <strong style={{ color: 'var(--green-bright)' }}>
                            {fmtMoney(result.savings)}
                          </strong>
                        </span>
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
      .section-header {
        margin: 32px 0 16px;
        padding: 0 4px;
      }

      .section-title {
        font-family: 'Syne', sans-serif;
        font-size: 22px;
        font-weight: 800;
        margin-bottom: 6px;
      }

      .section-sub {
        font-size: 14px;
        color: var(--text-soft);
      }

      .calc-nav {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 8px;
        margin-bottom: 16px;
      }

      .calc-nav-btn {
        all: unset;
        box-sizing: border-box;
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px 8px;
        cursor: pointer;
        font-family: inherit;
        text-align: center;
        transition: all 0.2s ease;
        color: var(--text-soft);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .calc-nav-btn:hover {
        border-color: var(--accent);
        transform: translateY(-1px);
      }

      .calc-nav-btn.active {
        background: var(--accent-bg);
        border-color: var(--accent);
        color: var(--text);
      }

      .calc-nav-icon {
        font-size: 24px;
        margin-bottom: 4px;
      }

      .calc-nav-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .calc-section {
        display: none;
        margin-bottom: 16px;
      }

      .calc-section.active {
        display: block;
      }

      .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 24px;
      }

      .card-title {
        font-family: 'Syne', sans-serif;
        font-size: 16px;
        font-weight: 700;
        margin-bottom: 18px;
      }

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
        font-family: 'Inter', sans-serif;
        font-size: clamp(40px, 6vw, 58px);
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
        font-family: 'Inter', sans-serif;
        font-size: 14px;
        font-weight: 800;
      }

      .result-mini-value.green {
        color: var(--green-bright);
      }

      .result-mini-value.red {
        color: var(--red);
      }

      .result-mini-value.accent {
        color: var(--accent);
      }

      .range-details {
        margin-top: 12px;
        font-size: 12px;
        color: var(--muted);
        line-height: 1.6;
      }

      .calculator-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .calculator-grid.ev-grid {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      .field-wide {
        grid-column: span 2;
      }

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
        font-weight: 600;
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
        transition: border-color 0.15s ease;
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

      .toggle-row {
        display: flex;
        gap: 6px;
        background: var(--surface2);
        padding: 6px;
        border-radius: 12px;
      }

.toggle-opt {
  flex: 1;
  box-sizing: border-box;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  color: var(--text-soft);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  background: transparent;
  transition: all 0.2s ease;
  min-height: 44px;
  text-align: center;
}

.toggle-opt:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.04);
}

.toggle-opt.active {
  background: var(--surface3);
  color: var(--text);
  box-shadow: inset 0 0 0 1px var(--border);
}

.btn-calc-big {
  width: 100%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 14px;
  font-family: 'Syne', sans-serif;
  font-weight: 800;
  font-size: 16px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 56px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  letter-spacing: -0.2px;
}

.btn-calc-big:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.28);
}

.btn-calc-big:active {
  transform: translateY(0);
  box-shadow: none;
}

.btn-calc-big.btn-add {
  background: linear-gradient(135deg, var(--green), var(--green-bright));
}

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

      .trange-row:last-of-type {
        margin-bottom: 0;
      }

      .trange-label {
        font-size: 12px;
        color: var(--text-soft);
        font-weight: 700;
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

      .trange-separator {
        color: var(--muted);
      }

      .trange-remove {
        all: unset;
        box-sizing: border-box;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: var(--red);
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 12px;
        font-weight: 800;
        cursor: pointer;
        margin-top: 8px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: all 0.2s ease;
      }

      .trange-remove:hover {
        background: rgba(239, 68, 68, 0.16);
      }

      .btn-add-range {
        all: unset;
        box-sizing: border-box;
        background: var(--accent-bg);
        color: var(--accent);
        border: 1px dashed rgba(129, 140, 248, 0.4);
        border-radius: 12px;
        padding: 13px 14px;
        width: 100%;
        cursor: pointer;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 800;
        margin-top: 8px;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: all 0.2s ease;
      }

      .btn-add-range:hover {
        background: rgba(129, 140, 248, 0.16);
        border-color: rgba(129, 140, 248, 0.65);
      }

      .custom-block {
        background: var(--accent-bg);
        border: 1px solid rgba(129, 140, 248, 0.2);
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 14px;
      }

      .custom-block-title {
        font-size: 12px;
        color: var(--accent);
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 800;
        margin-bottom: 12px;
      }

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
        margin-bottom: 12px;
      }

      .myday-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px;
        border-bottom: 1px solid var(--border-soft);
      }

      .myday-item:last-child {
        border-bottom: none;
      }

      .myday-icon {
        font-size: 24px;
      }

      .myday-content {
        flex: 1;
        min-width: 0;
      }

      .myday-name {
        font-weight: 700;
        font-size: 14px;
      }

      .myday-meta {
        font-size: 12px;
        color: var(--muted);
      }

      .myday-price {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        font-size: 16px;
      }

      .myday-remove {
        all: unset;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 0.04);
        border: 1px solid var(--border);
        color: var(--muted);
        cursor: pointer;
        font-size: 18px;
        font-weight: 800;
        border-radius: 10px;
        min-height: 34px;
        min-width: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .myday-remove:hover {
        color: var(--red);
        border-color: rgba(239, 68, 68, 0.35);
        background: rgba(239, 68, 68, 0.08);
      }

      .myday-tips {
        margin-top: 12px;
        background: var(--green-bg);
        border: 1px solid rgba(34, 197, 94, 0.2);
        border-radius: 12px;
        padding: 14px;
      }

      .myday-tips-title {
        font-size: 12px;
        color: var(--green-bright);
        font-weight: 800;
        margin-bottom: 10px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .myday-tip {
        font-size: 13px;
        padding: 6px 0;
        line-height: 1.5;
      }

      @media (max-width: 767px) {
        .calc-nav {
          grid-template-columns: repeat(2, 1fr);
        }

        .card {
          padding: 18px;
          border-radius: 16px;
        }

        .calculator-grid,
        .calculator-grid.ev-grid {
          grid-template-columns: 1fr;
        }

        .field-wide {
          grid-column: span 1;
        }

        .result-top-price {
          font-size: 42px;
        }

        .result-top-comparison {
          grid-template-columns: 1fr;
          gap: 10px;
        }

        .result-mini {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .trange-row {
          flex-wrap: wrap;
        }
        .calculator-grid button.toggle-opt,
.big-field button.toggle-opt,
.toggle-row button.toggle-opt {
  appearance: none;
  -webkit-appearance: none;
  flex: 1;
  box-sizing: border-box;
  padding: 12px 14px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 800;
  color: var(--text-soft);
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  background: transparent;
  transition: all 0.2s ease;
  min-height: 44px;
  text-align: center;
}

.calculator-grid button.toggle-opt:hover,
.big-field button.toggle-opt:hover,
.toggle-row button.toggle-opt:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.04);
}

.calculator-grid button.toggle-opt.active,
.big-field button.toggle-opt.active,
.toggle-row button.toggle-opt.active {
  background: var(--surface3);
  color: var(--text);
  box-shadow: inset 0 0 0 1px var(--border);
}
      }
      /* FIX DEFINITIVO BOTONES CALCULADORA */

.calc-nav button,
.calc-section button,
.toggle-row button,
.time-range-card button,
.myday-list button {
  all: unset !important;
  box-sizing: border-box !important;
  font-family: 'DM Sans', sans-serif !important;
  cursor: pointer !important;
}

/* Botones de pestañas superiores */
.calc-nav-btn {
  background: var(--surface) !important;
  border: 1px solid var(--border) !important;
  border-radius: 12px !important;
  padding: 14px 8px !important;
  color: var(--text-soft) !important;
  text-align: center !important;
  transition: all 0.2s ease !important;
  display: flex !important;
  flex-direction: column !important;
  align-items: center !important;
  justify-content: center !important;
}

.calc-nav-btn:hover {
  border-color: var(--accent) !important;
  transform: translateY(-1px) !important;
}

.calc-nav-btn.active {
  background: var(--accent-bg) !important;
  border-color: var(--accent) !important;
  color: var(--text) !important;
}

/* Botones tipo Solo horas / Con minutos / Casa / Rápida */
.toggle-opt {
  flex: 1 !important;
  padding: 12px 14px !important;
  border-radius: 10px !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  color: var(--text-soft) !important;
  background: transparent !important;
  min-height: 44px !important;
  text-align: center !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
}

.toggle-opt:hover {
  color: var(--text) !important;
  background: rgba(255, 255, 255, 0.04) !important;
}

.toggle-opt.active {
  background: var(--surface3) !important;
  color: var(--text) !important;
  box-shadow: inset 0 0 0 1px var(--border) !important;
}

/* Botones grandes: Calcular, Añadir, Optimizar */
.btn-calc-big {
  width: 100% !important;
  background: linear-gradient(135deg, #6366f1, #8b5cf6) !important;
  color: white !important;
  border-radius: 14px !important;
  font-family: 'Syne', sans-serif !important;
  font-weight: 800 !important;
  font-size: 16px !important;
  padding: 16px !important;
  min-height: 56px !important;
  margin-top: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  letter-spacing: -0.2px !important;
  transition: all 0.2s ease !important;
}

.btn-calc-big:hover {
  transform: translateY(-1px) !important;
  box-shadow: 0 10px 28px rgba(99, 102, 241, 0.28) !important;
}

.btn-calc-big:active {
  transform: translateY(0) !important;
  box-shadow: none !important;
}

.btn-calc-big.btn-add {
  background: linear-gradient(135deg, var(--green), var(--green-bright)) !important;
  color: #06150c !important;
}

/* Botón añadir franja */
.btn-add-range {
  width: 100% !important;
  background: var(--accent-bg) !important;
  color: var(--accent) !important;
  border: 1px dashed rgba(129, 140, 248, 0.4) !important;
  border-radius: 12px !important;
  padding: 13px 14px !important;
  font-size: 14px !important;
  font-weight: 800 !important;
  margin-top: 8px !important;
  min-height: 48px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  transition: all 0.2s ease !important;
}

.btn-add-range:hover {
  background: rgba(129, 140, 248, 0.16) !important;
  border-color: rgba(129, 140, 248, 0.65) !important;
}

/* Botón quitar franja */
.trange-remove {
  width: 100% !important;
  background: rgba(239, 68, 68, 0.1) !important;
  border: 1px solid rgba(239, 68, 68, 0.25) !important;
  color: var(--red) !important;
  border-radius: 10px !important;
  padding: 9px 12px !important;
  font-size: 12px !important;
  font-weight: 800 !important;
  margin-top: 8px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-align: center !important;
  transition: all 0.2s ease !important;
}

.trange-remove:hover {
  background: rgba(239, 68, 68, 0.16) !important;
}

/* Botón X de Mi día */
.myday-remove {
  background: rgba(255, 255, 255, 0.04) !important;
  border: 1px solid var(--border) !important;
  color: var(--muted) !important;
  font-size: 18px !important;
  font-weight: 800 !important;
  border-radius: 10px !important;
  min-height: 34px !important;
  min-width: 34px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.2s ease !important;
}

.myday-remove:hover {
  color: var(--red) !important;
  border-color: rgba(239, 68, 68, 0.35) !important;
  background: rgba(239, 68, 68, 0.08) !important;
}
    `}</style>
  );
}
