'use client';

import { useEffect, useState } from 'react';
import {
  fmt, fmtE, h,
  color, semClass, statusLabel,
  PriceData
} from '@/lib/utils';
import Calculator from '@/components/Calculator';

type SelectedDay = 'today' | 'tomorrow';

interface ApiResponse {
  success?: boolean;
  day?: string;
  date?: string;
  prices?: PriceData[];
  error?: string;
}

export default function Home() {
  const [todayPrices, setTodayPrices] = useState<PriceData[]>([]);
  const [tomorrowPrices, setTomorrowPrices] = useState<PriceData[]>([]);
  const [todayDate, setTodayDate] = useState('');
  const [tomorrowDate, setTomorrowDate] = useState('');
  const [selectedDay, setSelectedDay] = useState<SelectedDay>('today');
  const [loading, setLoading] = useState(true);
  const [currentHour, setCurrentHour] = useState(0);
  const [tomorrowAvailable, setTomorrowAvailable] = useState(false);

  useEffect(() => {
    const now = new Date();
    setCurrentHour(now.getHours());

    async function loadPrices() {
      try {
        const [todayRes, tomorrowRes] = await Promise.all([
          fetch('/api/precios?day=today'),
          fetch('/api/precios?day=tomorrow')
        ]);

        const todayData: ApiResponse = await todayRes.json();
        const tomorrowData: ApiResponse = await tomorrowRes.json();

        if (todayData.prices?.length) {
          setTodayPrices(todayData.prices);
          setTodayDate(todayData.date || '');
        }

        if (tomorrowData.success && tomorrowData.prices?.length) {
          setTomorrowPrices(tomorrowData.prices);
          setTomorrowDate(tomorrowData.date || '');
          setTomorrowAvailable(true);
        } else {
          setTomorrowPrices([]);
          setTomorrowAvailable(false);
        }
      } catch {
        setTomorrowAvailable(false);
      } finally {
        setLoading(false);
      }
    }

    loadPrices();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <div style={{
          width: '32px', height: '32px', margin: '0 auto 14px',
          border: '2px solid var(--border)', borderTopColor: 'var(--accent)',
          borderRadius: '50%', animation: 'spin 0.7s linear infinite'
        }} />
        <div style={{ color: 'var(--text-soft)', fontSize: '14px' }}>
          Cargando precios...
        </div>
      </div>
    );
  }

  if (!todayPrices.length) return <div>Error cargando datos</div>;

  const pricesToShow = selectedDay === 'today' ? todayPrices : tomorrowPrices;
  const dateToShow = selectedDay === 'today' ? todayDate : tomorrowDate;

  return (
    <HomeContent
      prices={pricesToShow.length ? pricesToShow : todayPrices}
      currentHour={currentHour}
      selectedDay={selectedDay}
      setSelectedDay={setSelectedDay}
      todayDate={todayDate}
      tomorrowDate={tomorrowDate}
      tomorrowAvailable={tomorrowAvailable}
    />
  );
}

function HomeContent({
  prices,
  currentHour,
  selectedDay,
  setSelectedDay,
  todayDate,
  tomorrowDate,
  tomorrowAvailable
}: {
  prices: PriceData[];
  currentHour: number;
  selectedDay: SelectedDay;
  setSelectedDay: (day: SelectedDay) => void;
  todayDate: string;
  tomorrowDate: string;
  tomorrowAvailable: boolean;
}) {
  const isToday = selectedDay === 'today';
  const cur = isToday ? prices.find(p => p.hour === currentHour) || prices[0] : prices[0];
  const minP = prices.reduce((a, b) => a.price < b.price ? a : b);
  const maxP = prices.reduce((a, b) => a.price > b.price ? a : b);
  const avg = prices.reduce((s, p) => s + p.price, 0) / prices.length;
  const sc = semClass(cur.price);
  const savingPct = isToday && cur.price > 0 ? Math.round((1 - minP.price / cur.price) * 100) : 0;

  let urgentMsg = '', urgentCls = '';

  if (!isToday) {
    urgentMsg = '📅 Estás viendo los precios de mañana. Hoy sigue disponible en el botón de arriba.';
    urgentCls = 'normal';
  } else if (sc === 'green') {
    urgentMsg = '✅ Buen momento para consumir. Pon la lavadora si quieres.';
    urgentCls = 'cheap';
  } else if (sc === 'yellow') {
    urgentMsg = '⚡ Precio medio. Mejor espera a una hora más barata si puedes.';
    urgentCls = 'normal';
  } else {
    urgentMsg = '🔴 Estás pagando de más ahora. Si esperas, puedes pagar la mitad.';
    urgentCls = 'expensive';
  }

  return (
    <>
      <HomeStyles />

      <div className="day-switch-card">
        <div>
          <div className="day-switch-title">
            {isToday ? 'Precios de hoy' : 'Precios de mañana'}
          </div>
          <div className="day-switch-sub">
            {isToday ? todayDate : tomorrowDate || 'Disponible normalmente desde las 20:15'}
          </div>
        </div>

        <div className="day-switch">
          <button
            type="button"
            className={`day-btn ${selectedDay === 'today' ? 'active' : ''}`}
            onClick={() => setSelectedDay('today')}
          >
            Hoy
          </button>

          <button
            type="button"
            className={`day-btn ${selectedDay === 'tomorrow' ? 'active' : ''}`}
            onClick={() => tomorrowAvailable && setSelectedDay('tomorrow')}
            disabled={!tomorrowAvailable}
          >
            Mañana
          </button>
        </div>
      </div>

      {!tomorrowAvailable && (
        <div className="tomorrow-warning">
          Los precios de mañana aún no están disponibles. Normalmente salen sobre las 20:15.
        </div>
      )}

      <div className="hero-action">
        <div className="hero-grid">
          <div className="hero-block">
            <div className="hero-label">
              {isToday ? `⚡ Ahora · ${h(currentHour)}` : '📅 Primera hora de mañana'}
            </div>
            <div
              className="hero-price inter-numbers"
              style={{
                color: color(cur.price),
                fontSize: 'clamp(36px,5vw,56px)'
              }}
            >
              {fmt(cur.price)}
              <span style={{ fontSize: '0.4em', color: 'var(--muted)' }}> c€/kWh</span>
            </div>
            <div className="hero-unit">{fmtE(cur.price)} €/kWh</div>
            <div className={`urgent-msg ${urgentCls}`}>{urgentMsg}</div>
          </div>

          <div className="hero-block divider">
            <div className="hero-label">🌙 Mejor hora {isToday ? 'hoy' : 'mañana'}</div>
            <div className="hero-price inter-numbers" style={{ color: 'var(--green-bright)', fontSize: 'clamp(36px,5vw,56px)' }}>
              {h(minP.hour)}
            </div>
            <div className="hero-unit">{fmt(minP.price)} c€/kWh · {fmtE(minP.price)} €/kWh</div>

            {isToday && (
              <div className="hero-saving">
                <span className="saving-pct inter-numbers">−{savingPct}%</span>
                <span className="saving-text"> de ahorro frente al precio actual</span>
              </div>
            )}
          </div>

          <div className="hero-block divider">
            <div className="hero-label">📊 Resumen del día</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-soft)', marginBottom: '4px' }}>MÍNIMO</div>
                <div style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 800, color: 'var(--green-bright)' }}>{fmt(minP.price)} c€</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{h(minP.hour)}</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-soft)', marginBottom: '4px' }}>MEDIA</div>
                <div style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 800, color: 'var(--yellow)' }}>{fmt(avg)} c€</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>del día</div>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: 'var(--text-soft)', marginBottom: '4px' }}>MÁXIMO</div>
                <div style={{ fontFamily: 'Inter', fontSize: '18px', fontWeight: 800, color: 'var(--red)' }}>{fmt(maxP.price)} c€</div>
                <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{h(maxP.hour)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isToday && (
        <div className="semaphore">
          <div className={`sem green ${sc === 'green' ? 'active' : ''}`}>
            <div className="sem-row"><div className="sem-icon">🟢</div><div className="sem-title">Barato</div></div>
            <div className="sem-desc">Menos de 10 c€/kWh — enciende lo que quieras</div>
          </div>
          <div className={`sem yellow ${sc === 'yellow' ? 'active' : ''}`}>
            <div className="sem-row"><div className="sem-icon">🟡</div><div className="sem-title">Moderado</div></div>
            <div className="sem-desc">Entre 10 y 17 c€/kWh — con moderación</div>
          </div>
          <div className={`sem red ${sc === 'red' ? 'active' : ''}`}>
            <div className="sem-row"><div className="sem-icon">🔴</div><div className="sem-title">Caro</div></div>
            <div className="sem-desc">Más de 17 c€/kWh — apaga lo que puedas</div>
          </div>
        </div>
      )}

      <Calculator prices={prices} currentHour={isToday ? currentHour : 0} />

      <div className="card" style={{ marginTop: '32px' }}>
        <div className="card-title">
          Tabla detallada de las 24 horas · {isToday ? 'Hoy' : 'Mañana'}
        </div>
        <div className="table-wrap">
          <table className="price-table">
            <thead>
              <tr><th>Hora</th><th>Precio</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {prices.map(p => {
                const s = statusLabel(p.price);
                const isCur = isToday && p.hour === currentHour;
                const isBest = p.hour === minP.hour;
                return (
                  <tr key={p.hour} className={`${isCur ? 'now-row' : ''}${isBest ? ' best-row' : ''}`}>
                    <td>
                      {h(p.hour)} – {h((p.hour + 1) % 24)}
                      {isCur && <span style={{ fontSize: '10px', color: 'var(--accent)', fontWeight: 600 }}> ← AHORA</span>}
                      {isBest && <span style={{ fontSize: '10px', color: 'var(--green-bright)', fontWeight: 600 }}> ← MÁS BARATA</span>}
                    </td>
                    <td>
                      <strong style={{ color: color(p.price) }}>{fmt(p.price)}</strong>
                      <span style={{ color: 'var(--muted)', fontSize: '11px' }}> c€/kWh</span>
                    </td>
                    <td><span className={`pill ${s.c}`}>{s.t}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '32px', padding: '24px', background: 'var(--accent-bg)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '16px', textAlign: 'center' }}>
        <h3 style={{ fontFamily: 'Syne', fontSize: '18px', marginBottom: '8px' }}>📚 Aprende más sobre el precio de la luz</h3>
        <p style={{ color: 'var(--text-soft)', fontSize: '14px', marginBottom: '12px' }}>
          ¿Quieres entender cómo funciona el PVPC y cómo ahorrar en tu factura?
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/que-es-pvpc" style={{ padding: '8px 16px', background: 'var(--surface)', borderRadius: '8px', fontSize: '13px' }}>¿Qué es el PVPC?</a>
          <a href="/como-ahorrar" style={{ padding: '8px 16px', background: 'var(--surface)', borderRadius: '8px', fontSize: '13px' }}>Cómo ahorrar en la factura</a>
          <a href="/precio-luz-manana" style={{ padding: '8px 16px', background: 'var(--surface)', borderRadius: '8px', fontSize: '13px' }}>Precio de mañana</a>
        </div>
      </div>
    </>
  );
}

function HomeStyles() {
  return (
    <style jsx global>{`
      .day-switch-card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 18px;
        padding: 16px;
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
      }

      .day-switch-title {
        font-family: 'Syne', sans-serif;
        font-size: 18px;
        font-weight: 800;
        margin-bottom: 4px;
      }

      .day-switch-sub {
        color: var(--text-soft);
        font-size: 13px;
      }

      .day-switch {
        display: flex;
        gap: 8px;
        background: var(--surface2);
        border: 1px solid var(--border);
        border-radius: 14px;
        padding: 6px;
      }

      .day-btn {
        all: unset;
        box-sizing: border-box;
        min-width: 92px;
        padding: 11px 14px;
        border-radius: 10px;
        font-size: 13px;
        font-weight: 800;
        text-align: center;
        cursor: pointer;
        color: var(--text-soft);
        transition: all 0.2s ease;
      }

      .day-btn.active {
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        color: white;
      }

      .day-btn:disabled {
        opacity: 0.35;
        cursor: not-allowed;
      }

      .tomorrow-warning {
        background: var(--yellow-bg);
        border: 1px solid rgba(245,158,11,0.25);
        color: var(--yellow);
        border-radius: 14px;
        padding: 12px 14px;
        font-size: 13px;
        margin-bottom: 16px;
      }

      .hero-action {
        background: linear-gradient(135deg, var(--surface2) 0%, var(--surface) 100%);
        border: 1px solid var(--border);
        border-radius: 24px;
        padding: 32px;
        margin-bottom: 16px;
        animation: up 0.5s ease both;
        position: relative;
        overflow: hidden;
      }
      .hero-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 24px; align-items: center; position: relative; }
      .hero-block { position: relative; }
      .hero-block.divider { border-left: 1px solid var(--border); padding-left: 24px; }
      .hero-label { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: var(--text-soft); margin-bottom: 10px; }
      .hero-price { font-family: 'Syne', sans-serif; font-size: 52px; font-weight: 800; line-height: 1; margin-bottom: 8px; }
      .hero-unit { font-size: 13px; color: var(--muted); }
      .hero-saving { display: inline-flex; align-items: center; gap: 8px; background: var(--green-bg); color: var(--green-bright); padding: 10px 16px; border-radius: 12px; font-size: 14px; font-weight: 600; border: 1px solid rgba(34,197,94,0.2); margin-top: 14px; }
      .saving-pct { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800; color: var(--green-bright); }
      .urgent-msg { margin-top: 16px; padding: 10px 14px; border-radius: 10px; font-size: 13px; font-weight: 500; }
      .urgent-msg.cheap { background: var(--green-bg); color: var(--green-bright); }
      .urgent-msg.normal { background: var(--yellow-bg); color: var(--yellow); }
      .urgent-msg.expensive { background: var(--red-bg); color: #fca5a5; }
      .semaphore { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 16px; }
      .sem { border-radius: 16px; padding: 18px 20px; border: 1px solid var(--border-soft); background: var(--surface); opacity: 0.45; transition: all 0.3s; }
      .sem.active { opacity: 1; transform: translateY(-2px); }
      .sem.active.green { border-color: rgba(34,197,94,0.3); background: var(--green-bg); }
      .sem.active.yellow { border-color: rgba(245,158,11,0.3); background: var(--yellow-bg); }
      .sem.active.red { border-color: rgba(239,68,68,0.3); background: var(--red-bg); }
      .sem-row { display: flex; align-items: center; gap: 12px; margin-bottom: 4px; }
      .sem-icon { font-size: 22px; }
      .sem-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; }
      .sem-desc { font-size: 12px; color: var(--text-soft); }
      .card { background: var(--surface); border: 1px solid var(--border); border-radius: 18px; padding: 24px; margin-bottom: 16px; }
      .card-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 16px; }
      .table-wrap { overflow-x: auto; }
      .price-table { width: 100%; border-collapse: collapse; min-width: 400px; }
      .price-table th { font-size: 10px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--muted); font-weight: 500; text-align: left; padding: 0 12px 12px; }
      .price-table td { padding: 11px 12px; font-size: 13px; border-top: 1px solid var(--border-soft); }
      .price-table tr.now-row td { background: rgba(129,140,248,0.06); }
      .price-table tr.best-row td { background: rgba(34,197,94,0.05); }
      .pill { display: inline-block; font-size: 10px; font-weight: 600; padding: 3px 9px; border-radius: 20px; }
      .pill.green { background: var(--green-bg); color: var(--green-bright); }
      .pill.yellow { background: var(--yellow-bg); color: var(--yellow); }
      .pill.red { background: var(--red-bg); color: var(--red); }

      @media (max-width: 767px) {
        .day-switch-card {
          flex-direction: column;
          align-items: stretch;
        }

        .day-switch {
          width: 100%;
        }

        .day-btn {
          flex: 1;
        }

        .hero-grid { grid-template-columns: 1fr; gap: 20px; }
        .hero-block.divider { border-left: none; border-top: 1px solid var(--border); padding-left: 0; padding-top: 20px; }
        .hero-price { font-size: 44px; }
        .semaphore { grid-template-columns: 1fr; gap: 8px; }
      }
    `}</style>
  );
}
