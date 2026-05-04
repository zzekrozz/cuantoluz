// API que llama a REE y cachea los datos durante 1 hora
// Esto evita llamadas excesivas a REE y hace tu web súper rápida.

export const revalidate = 3600; // Cachear durante 1 hora (3600 segundos)

export async function GET() {
  try {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');

    const url = `https://apidatos.ree.es/es/datos/mercados/precios-mercados-tiempo-real?time_trunc=hour&start_date=${yyyy}-${mm}-${dd}T00:00&end_date=${yyyy}-${mm}-${dd}T23:59&geo_trunc=electric_system&geo_limit=peninsular&geo_ids=8741`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Next.js cache: 1 hora
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CuantoLuz/1.0',
      },
    });

    if (!res.ok) {
      throw new Error(`REE API error: ${res.status}`);
    }

    const data = await res.json();
    const included = data.included || [];
    const pvpc = included.find((i: any) => i.id === '1001') || included[0];

    if (!pvpc?.attributes?.values?.length) {
      throw new Error('No PVPC data found');
    }

    const prices = pvpc.attributes.values
      .map((v: any) => ({
        hour: new Date(v.datetime).getHours(),
        price: v.value / 1000, // Convertir €/MWh a €/kWh
      }))
      .sort((a: any, b: any) => a.hour - b.hour);

    return Response.json({
      success: true,
      date: `${yyyy}-${mm}-${dd}`,
      prices,
      cached_at: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
      },
    });

  } catch (error: any) {
    // Fallback con datos demo si REE falla
    const demo = [0.063, 0.058, 0.054, 0.051, 0.049, 0.062, 0.115, 0.183, 0.219, 0.201, 0.178, 0.162, 0.154, 0.147, 0.153, 0.169, 0.198, 0.231, 0.248, 0.239, 0.221, 0.195, 0.158, 0.097];
    const prices = demo.map((p, i) => ({ hour: i, price: p }));

    return Response.json({
      success: false,
      fallback: true,
      error: error.message,
      prices,
    }, { status: 200 });
  }
}
