export async function onRequest(context) {
  const { env, request } = context;

  // Solo aceptamos mensajes POST
  if (request.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  const API_KEY = env.GEMINI_API_KEY;

  // Si la llave no aparece, avisamos
  if (!API_KEY) {
    return new Response(JSON.stringify({ error: "La API Key no está configurada en Cloudflare" }), { status: 500 });
  }

  try {
    const body = await request.json();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Error de conexión con Google" }), { status: 500 });
  }
}
