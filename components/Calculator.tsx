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
import {
  Clock, Gauge, Battery, ClipboardList, Plus, X, Wrench,
  Home, Sparkles, Settings, Calculator as CalcIcon
} from 'lucide-react';

interface Props {
  prices: PriceData[];
  currentHour: number;
}

interface MyDayItem {
  id: number;
  key: string;
  label: string;
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

// Componente para renderizar el icono de un aparato
function ApplianceIcon({ applianceKey, size = 18 }: { applianceKey: string; size?: number }) {
  const appliance = appliances[applianceKey];
  if (!appliance) return null;
  const Icon = appliance.icon;
  return <Icon size={size} className="icon-text" style={{ flexShrink: 0 }} />;
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
      appKey: timeApp,
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
    { id: 'time' as const, Icon: Clock, label: 'Aparatos' },
    { id: 'ev' as const, Icon: Battery, label: 'Coche EV' },
    { id: 'myday' as const, Icon: ClipboardList, label: 'Mi día' }
  ];

  return (
    <>
      <CalculatorStyles />

      <div className="section-header">
        <div className="section-title">
          <CalcIcon size={20} className="icon-text" />
          <span>Calculadoras</span>
        </div>
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
            <div className="calc-nav-icon">
              <tab.Icon size={22} strokeWidth={1.75} />
            </div>
            <div className="calc-nav-label">{tab.label}</div>
          </button>
        ))}
      </div>

      {/* APARATOS */}
      <div className={`calc-section ${activeCalc === 'time' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">
            <Clock size={16} className="icon-accent" />
            <span>Aparatos por horas</span>
          </div>

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
                <ApplianceIcon applianceKey={timeResult.appKey} size={16} />
                <span>{timeResult.app.label} ·{' '}
                {timeResult.totalHours.toFixed(2)}h · {timeResult.totalKwh.toFixed(2)} kWh</span>
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

          {/* APARATO + POTENCIA → 2 columnas alineadas */}
          <div className="form-grid form-grid-2">
            <div className="field-group">
              <label>Aparato</label>
              <select value={timeApp} onChange={e => handleTimeAppChange(e.target.value)}>
                {Object.entries(appliances)
                  .filter(([_, value]) => value.type === 'time' || value.type === 'cycle')
                  .map(([key, value]) => {
                    const isCycle = value.type === 'cycle';
                    const consumption = isCycle ? getAppKwh(key) : getAppKw(key);

                    return (
                      <option key={key} value={key}>
                        {value.label} · {consumption.toFixed(2)}{' '}
                        {isCycle ? 'kWh/ciclo' : 'kW'}
                      </option>
                    );
                  })}
              </select>
            </div>

            <div className="field-group">
              <label>
                {getAppType(timeApp) === 'cycle'
                  ? 'Consumo total (kWh)'
                  : 'Potencia (kW)'}
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

          {/* FRANJAS DE USO - NUEVOS INPUTS COMPACTOS HORIZONTALES */}
          <div className="field-group">
            <label>Franjas de uso</label>

            {timeRanges.map(range => (
              <div key={range.id} className="time-range-card">
                <div className="time-inputs-compact">
                  <div className="time-input-group">
                    <span className="time-input-label">Desde</span>
                    <div className="time-input-row">
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
                      <span className="time-input-separator">:</span>
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

                  <div className="time-input-group">
                    <span className="time-input-label">Hasta</span>
                    <div className="time-input-row">
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
                      <span className="time-input-separator">:</span>
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
                    <X size={14} />
                    Quitar franja
                  </button>
                )}
              </div>
            ))}

            <button type="button" className="btn-add-range" onClick={addTimeRange}>
              <Plus size={16} />
              Añadir otra franja
            </button>
          </div>

          <button type="button" className="btn-calc-big" onClick={calcTime}>
            <CalcIcon size={18} />
            Calcular
          </button>
        </div>
      </div>

      {/* COCHE EV */}
      <div className={`calc-section ${activeCalc === 'ev' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">
            <Battery size={16} className="icon-green" />
            <span>Coche eléctrico</span>
          </div>

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
                {evResult.isCustom ? <Wrench size={16} className="icon-accent" /> : <Battery size={16} className="icon-green" />}
                <span>{evResult.car.label} · {evResult.from}% →{' '}
                {evResult.to}% ({evResult.kwhNeeded.toFixed(1)} kWh ={' '}
                {evResult.kmRange.toFixed(0)} km)</span>
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

          {/* Modelo + Tipo de carga */}
          <div className="form-grid form-grid-2">
            <div className="field-group">
              <label>Modelo</label>
              <select value={evModel} onChange={e => setEvModel(e.target.value)}>
                {Object.entries(cars).map(([key, value]) => (
                  <option key={key} value={key}>
                    {value.label} · {value.battery} kWh
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label>Tipo de carga</label>
              <div className="toggle-row">
                <button
                  type="button"
                  className={`toggle-opt ${evChargeMode === 'home' ? 'active' : ''}`}
                  onClick={() => setEvChargeMode('home')}
                >
                  <Home size={14} />
                  Casa
                </button>
                <button
                  type="button"
                  className={`toggle-opt ${evChargeMode === 'fast' ? 'active' : ''}`}
                  onClick={() => setEvChargeMode('fast')}
                >
                  <Gauge size={14} />
                  Rápida
                </button>
              </div>
            </div>
          </div>

          {/* Carga desde + Hasta */}
          <div className="form-grid form-grid-2">
            <div className="field-group">
              <label>Carga desde (%)</label>
              <input
                type="number"
                value={evFrom}
                onChange={e => setEvFrom(parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>

            <div className="field-group">
              <label>Hasta (%)</label>
              <input
                type="number"
                value={evTo}
                onChange={e => setEvTo(parseInt(e.target.value) || 0)}
                min="0"
                max="100"
              />
            </div>
          </div>

          {/* Hora de carga */}
          <div className="field-group">
            <label>Hora de carga</label>
            <select value={evHour} onChange={e => setEvHour(parseInt(e.target.value))}>
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i}>
                  {h(i)}
                </option>
              ))}
            </select>
          </div>

          {evModel === 'custom' && (
            <div className="custom-block">
              <div className="custom-block-title">
                <Settings size={12} />
                Datos personalizados
              </div>

              <div className="form-grid form-grid-2">
                <div className="field-group">
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

                <div className="field-group">
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
            <Battery size={18} />
            Calcular carga
          </button>
        </div>
      </div>

      {/* MI DIA */}
      <div className={`calc-section ${activeCalc === 'myday' ? 'active' : ''}`}>
        <div className="card">
          <div className="card-title">
            <ClipboardList size={16} className="icon-accent" />
            <span>Mi día completo</span>
          </div>

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
            <div className="form-grid form-grid-2">
              <div className="field-group">
                <label>Aparato</label>
                <select value={myDayApp} onChange={e => setMyDayApp(e.target.value)}>
                  <optgroup label="Aparatos">
                    {Object.entries(appliances)
                      .filter(([_, value]) => value.type === 'time' || value.type === 'cycle')
                      .map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                  </optgroup>
                </select>
              </div>

              <div className="field-group">
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

            {/* HORA + MINUTOS - INPUTS COMPACTOS HORIZONTALES */}
            <div className="field-group">
              <label>Hora de inicio</label>
              <div className="time-input-row" style={{ marginTop: 0 }}>
                <select value={myDayHour} onChange={e => setMyDayHour(parseInt(e.target.value))}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>
                      {String(i).padStart(2, '0')}
                    </option>
                  ))}
                </select>
                <span className="time-input-separator">:</span>
                <select value={myDayMin} onChange={e => setMyDayMin(parseInt(e.target.value))}>
                  {[0, 15, 30, 45].map(minute => (
                    <option key={minute} value={minute}>
                      {String(minute).padStart(2, '0')}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button type="button" className="btn-calc-big btn-add" onClick={addToMyDay}>
              <Plus size={18} />
              Añadir a mi día
            </button>
          </div>

          {myDayItems.length === 0 ? (
            <div className="myday-empty">Tu día está vacío. Añade aparatos arriba.</div>
          ) : (
            <>
              <div className="myday-list">
                {myDayItems.map(item => (
                  <div key={item.id} className="myday-item">
                    <div className="myday-icon">
                      <ApplianceIcon applianceKey={item.key} size={22} />
                    </div>

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
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="btn-calc-big"
                onClick={() => setShowOptimization(!showOptimization)}
              >
                <Sparkles size={18} />
                {showOptimization ? 'Ocultar optimización' : 'Optimizar mi día'}
              </button>

              {showOptimization && (
                <div className="myday-tips">
                  <div className="myday-tips-title">
                    <Sparkles size={12} />
                    Recomendaciones
                  </div>

                  {optimizations.map(result => (
                    <div key={result.id} className="myday-tip">
                      <span className="myday-tip-icon">
                        <ApplianceIcon applianceKey={result.key} size={16} />
                      </span>
                      {result.savings < 0.01 ? (
                        <span>
                          <strong>{result.label}</strong> ya está bien colocado.
                        </span>
                      ) : (
                        <span>
                          <strong>{result.label}</strong>: mueve de{' '}
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
      *, *::before, *::after {
        box-sizing: border-box;
      }

      .section-header {
        margin: 32px 0 16px;
        padding: 0 4px;
      }

      .section-title {
        font-family: 'Syne', sans-serif;
        font-size: 22px;
        font-weight: 800;
        margin-bottom: 6px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .section-sub {
        font-size: 14px;
        color: var(--text-soft);
      }

      /* TABS NAV */
      .calc-nav {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
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
        gap: 6px;
        min-width: 0;
      }

      .calc-nav-btn:hover {
        border-color: var(--accent);
        transform: translateY(-1px);
        color: var(--text);
      }

      .calc-nav-btn.active {
        background: var(--accent-bg);
        border-color: var(--accent);
        color: var(--text);
      }

      .calc-nav-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: inherit;
      }

      .calc-nav-label {
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      /* SECTIONS */
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
        display: flex;
        align-items: center;
        gap: 8px;
      }

      /* RESULT TOP */
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
        font-size: clamp(36px, 6vw, 56px);
        font-weight: 800;
        line-height: 1;
        margin-bottom: 8px;
      }

      .result-top-info {
        font-size: 14px;
        color: var(--text);
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
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
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid var(--border);
      }

      .result-mini {
        display: flex;
        flex-direction: column;
        gap: 2px;
        min-width: 0;
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

      .result-mini-value.green { color: var(--green-bright); }
      .result-mini-value.red { color: var(--red); }
      .result-mini-value.accent { color: var(--accent); }

      .range-details {
        margin-top: 12px;
        font-size: 12px;
        color: var(--muted);
        line-height: 1.6;
      }

      /* ============================================
         FORM GRID SYSTEM (REUSABLE)
         ============================================ */
      .form-grid {
        display: grid;
        gap: 12px;
        margin-bottom: 14px;
      }

      .form-grid-2 {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .form-grid-3 {
        grid-template-columns: repeat(3, minmax(0, 1fr));
      }

      /* FIELD GROUP */
      .field-group {
        display: flex;
        flex-direction: column;
        min-width: 0;
        margin-bottom: 14px;
      }

      .form-grid .field-group {
        margin-bottom: 0;
      }

      .field-group label {
        display: block;
        font-size: 11px;
        color: var(--text-soft);
        margin-bottom: 8px;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 700;
      }

      .field-group select,
      .field-group input {
        width: 100%;
        max-width: 100%;
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        color: var(--text);
        font-family: 'DM Sans', sans-serif;
        font-size: 15px;
        padding: 0 14px;
        height: 50px;
        line-height: 50px;
        outline: none;
        appearance: none;
        -webkit-appearance: none;
        transition: border-color 0.15s ease;
        box-sizing: border-box;
      }

      .field-group input {
        line-height: normal;
      }

      .field-group select:focus,
      .field-group input:focus {
        border-color: var(--accent);
      }

      .field-group select {
        background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23a8aabc' fill='none' stroke-width='1.5'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 14px center;
        padding-right: 36px;
      }

      /* TOGGLE: matches input height for alignment */
      .toggle-row {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 4px;
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 4px;
        height: 50px;
        box-sizing: border-box;
      }

      /* TIME RANGE CARDS */
      .time-range-card {
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 14px;
        margin-bottom: 8px;
      }

      /* TIME INPUTS COMPACT - mejor estilo del original */
      .time-range-card .time-inputs-compact {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      .time-range-card .time-input-group {
        min-width: 0;
      }

      .time-range-card .time-input-label {
        display: block;
        font-size: 11px;
        color: var(--text-soft);
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 6px;
      }

      .time-range-card .time-input-row {
        display: flex;
        align-items: center;
        gap: 6px;
        background: var(--surface3);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 0 8px;
        height: 42px;
      }

      .time-range-card .time-input-row select {
        all: unset;
        flex: 1;
        min-width: 0;
        text-align: center;
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
        height: 100%;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
      }

      .time-range-card .time-input-separator {
        color: var(--muted);
        font-weight: 800;
        font-size: 14px;
        user-select: none;
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
        display: flex;
        align-items: center;
        gap: 6px;
      }

      /* MI DIA */
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
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        background: var(--surface3);
        border-radius: 10px;
        flex-shrink: 0;
        color: var(--accent);
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
        flex-shrink: 0;
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
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .myday-tip {
        font-size: 13px;
        padding: 6px 0;
        line-height: 1.5;
        display: flex;
        align-items: flex-start;
        gap: 8px;
      }

      .myday-tip-icon {
        flex-shrink: 0;
        color: var(--text-soft);
        margin-top: 2px;
      }

      /* ============================================
         RESPONSIVE
         ============================================ */

      @media (max-width: 767px) {
        .card {
          padding: 18px;
          border-radius: 16px;
        }

        .form-grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .form-grid-3 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .time-range-card .time-inputs-compact {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .field-group select,
        .field-group input {
          font-size: 14px;
          padding: 0 12px;
          padding-right: 32px;
          height: 48px;
          line-height: 48px;
        }

        .field-group input {
          line-height: normal;
        }

        .toggle-row {
          height: 48px;
        }

        .time-range-card .time-input-row {
          height: 40px;
        }

        .time-range-card .time-input-row select {
          font-size: 13px;
        }

        .result-top-comparison {
          grid-template-columns: 1fr;
          gap: 8px;
        }

        .result-mini {
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }

        .calc-nav {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      /* Very small phones */
      @media (max-width: 380px) {
        .form-grid-2,
        .form-grid-3 {
          grid-template-columns: 1fr;
        }
      }
    `}</style>
  );
}
