export async function onRequestPost(context) {
  const { env, request } = context;

  try {
    // 1. Extraemos la pregunta del usuario
    const body = await request.json();
    
    // 2. Usamos la API KEY del panel de Cloudflare
    const apiKey = env.GEMINI_API_KEY;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    // 3. Devolvemos la respuesta al chat
    return new Response(JSON.stringify(data), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Error interno del servidor" }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
