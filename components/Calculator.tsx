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

type ActiveCalc = 'time' | 'ev' | 'myday';

const defaultOverrides: Record<string, { kwh?: number; kw?: number }> = {
  lavadora_basica: { kwh: 1.0 },
  lavadora_normal: { kwh: 1.0 },
  lavadora_estandar: { kwh: 1.0 },
  lavadora_eficiente: { kwh: 0.6 },
  lavadora_a: { kwh: 0.6 },
  lavadora_a9: { kwh: 0.6 }
};

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
  const minP = prices.reduce((a, b) => (a.price < b.price ? a : b));
  const maxP = prices.reduce((a, b) => (a.price > b.price ? a : b));

  const [activeCalc, setActiveCalc] = useState<ActiveCalc>('time');
  const [customOverrides, setCustomOverrides] = useState(defaultOverrides);

  const getAppType = (key: string) => appliances[key]?.type;

  const getAppKwh = (key: string) => {
    const app = appliances[key];
    const override = customOverrides[key];

    if (override?.kwh !== undefined) return override.kwh;
    if (app?.kwh !== undefined) return app.kwh;

    return 1;
  };

  const getAppKw = (key: string) => {
    const app = appliances[key];
    const override = customOverrides[key];

    if (override?.kw !== undefined) return override.kw;
    if (app?.kw !== undefined) return app.kw;

    if (app?.type === 'cycle') {
      return getAppKwh(key) / Math.max(1, app.duration || 1);
    }

    return 1;
  };

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

  const handleTimeAppChange = (key: string) => {
    setTimeApp(key);
    setTimeKw(getAppKw(key));
    setTimeResult(null);
  };

  const updateCustomConsumption = (key: string, value: number) => {
    if (getAppType(key) === 'cycle') {
      setCustomOverrides(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          kwh: value
        }
      }));
    } else {
      setTimeKw(value);
      setCustomOverrides(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          kw: value
        }
      }));
    }
  };

  const getEnergyForApp = (key: string, durationH: number, customKw?: number) => {
    if (getAppType(key) === 'cycle') {
      return getAppKwh(key);
    }

    return (customKw ?? getAppKw(key)) * durationH;
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
    const isCycle = app.type === 'cycle';

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
      const totalKwhRange = getEnergyForApp(timeApp, durationH, timeKw);

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
        duration: durationH,
        kwh: totalKwhRange
      });
    });

    const totalHours = totalMinutes / 60;
    const totalKwh = rangeDetails.reduce((sum, r) => sum + r.kwh, 0);

    setTimeResult({
      totalCost,
      totalKwh,
      totalHours,
      app,
      kw: timeKw,
      isCycle,
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
    const safeDuration = Math.max(1, Math.round(myDayDuration));
    const kwh = getEnergyForApp(myDayApp, safeDuration);
    const cost = calculateVariableCost(prices, myDayHour, myDayMin, safeDuration, kwh);

    setMyDayItems([
      ...myDayItems,
      {
        id: Date.now(),
        key: myDayApp,
        label: app.label,
        icon: app.icon,
        startH: myDayHour,
        startM: myDayMin,
        duration: safeDuration,
        kwh,
        cost,
        type: app.type
      }
    ]);

    setMyDayDuration(safeDuration);
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
    { id: 'time' as const, icon: '⚡', label: 'Aparatos' },
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

      <div className={`calc-section ${activeCalc === 'time' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">⚡ Aparatos por horas</div>

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
                {timeResult.totalHours.toFixed(2)}h · {timeResult.totalKwh.toFixed(2)} kWh
              </div>

              {timeResult.isCycle && (
                <div className="cycle-note">
                  Este aparato se calcula como consumo total del ciclo, no como consumo lineal por hora.
                </div>
              )}

              <div className="range-details">
                {timeResult.rangeDetails.map((range: any, index: number) => (
                  <div key={index}>
                    · {range.from} → {range.to} ({range.duration.toFixed(2)}h ·{' '}
                    {range.kwh.toFixed(2)} kWh) = {fmtMoney(range.cost)}
                  </div>
                ))}
              </div>

              <div className="result-top-comparison">
                <div className="result-mini">
                  <span className="result-mini-label">Todo en hora barata</span>
                  <span className="result-mini-value green">
                    {fmtMoney(timeResult.costAtBest)}
                  </span>
                </div>

                <div className="result-mini">
                  <span className="result-mini-label">Todo en hora cara</span>
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
                  .filter(([_, value]) => value.type === 'time' || value.type === 'cycle')
                  .map(([key, value]) => {
                    const isCycle = value.type === 'cycle';
                    const consumption = isCycle ? getAppKwh(key) : getAppKw(key);

                    return (
                      <option key={key} value={key}>
                        {value.icon} {value.label} · {consumption.toFixed(2)}{' '}
                        {isCycle ? 'kWh/ciclo' : 'kW'}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="big-field">
              <label>
                {getAppType(timeApp) === 'cycle'
                  ? 'Consumo total estimado (kWh)'
                  : 'Potencia estimada (kW)'}
              </label>
              <input
                type="number"
                value={getAppType(timeApp) === 'cycle' ? getAppKwh(timeApp) : timeKw}
                onChange={e => updateCustomConsumption(timeApp, parseFloat(e.target.value) || 0)}
                min="0.01"
                max="20"
                step="0.01"
              />
            </div>
          </div>

          <div className="big-field">
            <label>Franjas de uso</label>

            {timeRanges.map(range => (
              <div key={range.id} className="time-range-card">
                <div className="trange-grid">
                  <div className="trange-group">
                    <span className="trange-label">Desde</span>
                    <div className="trange-selects">
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
                  </div>

                  <div className="trange-group">
                    <span className="trange-label">Hasta</span>
                    <div className="trange-selects">
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
                  </div>
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
                  <optgroup label="Aparatos">
                    {Object.entries(appliances)
                      .filter(([_, value]) => value.type === 'time' || value.type === 'cycle')
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
                  onChange={e => {
                    const value = parseInt(e.target.value, 10);
                    setMyDayDuration(Number.isNaN(value) ? 1 : Math.max(1, Math.min(24, value)));
                  }}
                  min="1"
                  max="24"
                  step="1"
                  inputMode="numeric"
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
        grid-template-columns: repeat(3, 1fr);
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

      .cycle-note {
        margin-top: 10px;
        padding: 10px 12px;
        border-radius: 10px;
        background: var(--accent-bg);
        border: 1px solid rgba(129, 140, 248, 0.2);
        color: var(--text-soft);
        font-size: 12px;
        line-height: 1.5;
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
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 6px;
        background: var(--surface2);
        padding: 6px;
        border-radius: 12px;
      }

      .toggle-opt {
        all: unset;
        box-sizing: border-box;
        padding: 12px 14px;
        border-radius: 10px;
        font-size: 14px;
        font-weight: 800;
        color: var(--text-soft);
        background: transparent;
        min-height: 44px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
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
        all: unset;
        box-sizing: border-box;
        width: 100%;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
        border-radius: 14px;
        font-family: 'Syne', sans-serif;
        font-weight: 800;
        font-size: 16px;
        padding: 16px;
        min-height: 56px;
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        letter-spacing: -0.2px;
        transition: all 0.2s ease;
        cursor: pointer;
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
        color: #06150c;
      }

      .time-range-card {
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 8px;
      }

      .trange-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .trange-group {
        min-width: 0;
      }

      .trange-label {
        display: block;
        font-size: 12px;
        color: var(--text-soft);
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 6px;
      }

      .trange-selects {
        display: grid;
        grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
        align-items: center;
        gap: 8px;
      }

      .trange-selects select {
        width: 100%;
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
        font-weight: 800;
      }

      .trange-remove {
        all: unset;
        box-sizing: border-box;
        width: 100%;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.25);
        color: var(--red);
        border-radius: 10px;
        padding: 9px 12px;
        font-size: 12px;
        font-weight: 800;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: all 0.2s ease;
        cursor: pointer;
      }

      .trange-remove:hover {
        background: rgba(239, 68, 68, 0.16);
      }

      .btn-add-range {
        all: unset;
        box-sizing: border-box;
        width: 100%;
        background: var(--accent-bg);
        color: var(--accent);
        border: 1px dashed rgba(129, 140, 248, 0.4);
        border-radius: 12px;
        padding: 13px 14px;
        font-size: 14px;
        font-weight: 800;
        margin-top: 8px;
        min-height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        transition: all 0.2s ease;
        cursor: pointer;
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
        font-size: 18px;
        font-weight: 800;
        border-radius: 10px;
        min-height: 34px;
        min-width: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        cursor: pointer;
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
          grid-template-columns: 1fr;
        }

        .card {
          padding: 18px;
          border-radius: 16px;
        }

        .calculator-grid,
        .calculator-grid.ev-grid {
          grid-template-columns: 1fr;
        }

        .trange-grid {
          grid-template-columns: 1fr;
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
      }
    `}</style>
  );
}
