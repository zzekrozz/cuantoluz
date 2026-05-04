// Utilidades compartidas en toda la app

export const appliances: Record<string, any> = {
  lavadora_basica:    { label: 'Lavadora estándar',         icon: '🧺', kwh: 0.9,  duration: 2.0,  type: 'cycle' },
  lavadora_a:         { label: 'Lavadora eficiente (A)',    icon: '🧺', kwh: 0.55, duration: 1.5,  type: 'cycle' },
  secadora_basica:    { label: 'Secadora estándar',         icon: '💨', kwh: 3.5,  duration: 1.0,  type: 'cycle' },
  secadora_a:         { label: 'Secadora eficiente (A)',    icon: '💨', kwh: 1.6,  duration: 1.0,  type: 'cycle' },
  lavavajillas:       { label: 'Lavavajillas estándar',     icon: '🍽️', kwh: 1.3,  duration: 2.5,  type: 'cycle' },
  lavavajillas_a:     { label: 'Lavavajillas eficiente',    icon: '🍽️', kwh: 0.85, duration: 2.0,  type: 'cycle' },
  aire_inverter:      { label: 'Aire acond. inverter',      icon: '❄️', kw: 1.0,   type: 'time' },
  aire_antiguo:       { label: 'Aire acond. antiguo',       icon: '❄️', kw: 2.5,   type: 'time' },
  calefaccion:        { label: 'Calefacción eléctrica',     icon: '🔥', kw: 2.0,   type: 'time' },
  termo:              { label: 'Termo eléctrico',           icon: '🚿', kw: 1.5,   type: 'time' },
  tv:                 { label: 'TV LED',                    icon: '📺', kw: 0.1,   type: 'time' },
  ordenador:          { label: 'Ordenador / PC',            icon: '💻', kw: 0.2,   type: 'time' },
  estufa:             { label: 'Estufa eléctrica',          icon: '🔥', kw: 1.5,   type: 'time' },
};

export const cars: Record<string, any> = {
  tesla_3:    { label: 'Tesla Model 3',         per100: 14.5, battery: 60 },
  tesla_y:    { label: 'Tesla Model Y',         per100: 16,   battery: 75 },
  kia_niro:   { label: 'Kia Niro EV',           per100: 16,   battery: 64 },
  hyundai_5:  { label: 'Hyundai IONIQ 5',       per100: 17,   battery: 72 },
  vw_id3:     { label: 'VW ID.3',               per100: 16,   battery: 58 },
  byd_atto:   { label: 'BYD Atto 3',            per100: 18,   battery: 60 },
  renault_5:  { label: 'Renault 5 E-Tech',      per100: 14,   battery: 52 },
  fiat_500:   { label: 'Fiat 500e',             per100: 14,   battery: 42 },
  custom:     { label: 'Personalizado',         per100: 16,   battery: 60 },
};

export const GASOLINE_PRICE_PER_LITER = 1.55;
export const GASOLINE_CONSUMPTION_L_PER_100 = 6.5;
export const FAST_CHARGE_PRICE = 0.45;

export const fmt = (p: number) => (p * 100).toFixed(2);
export const fmtE = (p: number) => p.toFixed(4);
export const fmtMoney = (p: number) => p.toFixed(2) + ' €';
export const h = (n: number) => String(n).padStart(2, '0') + ':00';
export const hm = (h: number, m: number) => String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');

export function color(p: number) {
  if (p < 0.10) return 'var(--green)';
  if (p < 0.17) return 'var(--yellow)';
  return 'var(--red)';
}

export function semClass(p: number) {
  if (p < 0.10) return 'green';
  if (p < 0.17) return 'yellow';
  return 'red';
}

export function statusLabel(p: number) {
  if (p < 0.08) return { c: 'green', t: 'Muy barato' };
  if (p < 0.10) return { c: 'green', t: 'Barato' };
  if (p < 0.14) return { c: 'yellow', t: 'Moderado' };
  if (p < 0.18) return { c: 'yellow', t: 'Alto' };
  return { c: 'red', t: 'Caro' };
}

export interface PriceData {
  hour: number;
  price: number;
}

export function getPriceAtHour(prices: PriceData[], hour: number): number {
  return prices.find(p => p.hour === hour)?.price || prices[0]?.price || 0.15;
}

// Calcular precio de un ciclo distribuido entre varias horas
export function calculateCyclePrice(
  prices: PriceData[],
  startHour: number,
  startMin: number,
  durationHours: number,
  totalKwh: number
): number {
  let totalCost = 0;
  let minutesProcessed = 0;
  const totalMinutes = durationHours * 60;
  let h = startHour;
  let m = startMin;

  while (minutesProcessed < totalMinutes) {
    const minutesInThisHour = Math.min(60 - m, totalMinutes - minutesProcessed);
    const kwhInThisHour = totalKwh * (minutesInThisHour / totalMinutes);
    const price = getPriceAtHour(prices, h);
    totalCost += kwhInThisHour * price;

    minutesProcessed += minutesInThisHour;
    h = (h + 1) % 24;
    m = 0;
  }

  return totalCost;
}
