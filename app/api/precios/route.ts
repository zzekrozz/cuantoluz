// API que llama a REE y cachea los datos durante 1 hora
// Permite pedir precios de HOY o MAÑANA con:
// /api/precios?day=today
// /api/precios?day=tomorrow

export const revalidate = 3600;

function formatDate(date: Date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return `${yyyy}-${mm}-${dd}`;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const day = searchParams.get('day') || 'today';

    const targetDate = new Date();

    if (day === 'tomorrow') {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const dateStr = formatDate(targetDate);

    const url = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?time_trunc=hour&start_date=${dateStr}T00:00&end_date=${dateStr}T23:59&geo_trunc=electric_system&geo_limit=peninsular&geo_ids=8741`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/json',
        'User-Agent': 'CuantoLuz/1.0'
      }
    });

    if (!res.ok) {
      throw new Error(`REE API error: ${res.status}`);
    }

    const data = await res.json();
    const included = data.included || [];
    const pvpc = included.find((i: any) => i.id === '1001') || included[0];

    if (!pvpc?.attributes?.values?.length) {
      throw new Error(`No PVPC data found for ${dateStr}`);
    }

    const prices = pvpc.attributes.values
      .map((v: any) => ({
        hour: new Date(v.datetime).getHours(),
        price: v.value / 1000
      }))
      .sort((a: any, b: any) => a.hour - b.hour);

    return Response.json(
      {
        success: true,
        day,
        date: dateStr,
        prices,
        cached_at: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200'
        }
      }
    );
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        fallback: false,
        error: error.message,
        prices: []
      },
      { status: 200 }
    );
  }
}
