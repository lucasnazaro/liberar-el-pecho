export async function onRequest(context) {
  const { env, request } = context;
  
  if (request.method !== "POST") {
    return new Response("Método no permitido", { status: 405 });
  }

  try {
    const body = await request.json();
    const API_KEY = env.GEMINI_API_KEY;
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
  } catch (error) {
    return new Response(JSON.stringify({ error: "Error de conexión" }), { status: 500 });
  }
}
